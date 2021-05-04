import { Request, Response, Headers, URL, Fastly } from "@fastly/as-compute";
import { GlobalConfig } from "./global-config";
import { Console, Date } from "as-wasi";
import { BACKEND_S3 } from "./backends";
import { RequestDispatcher } from "./framework/request-dispatcher";
import { MountPointMatch } from "./mount-config";
import { MediaHandler } from "./handlers/media-handler";
import { FallbackHandler } from "./handlers/fallback-handler";
import { PipelineHandler } from "./handlers/pipeline-handler";
import { ContentHandler } from "./handlers/content-handler";
import { CodeHandler } from "./handlers/code-handler";
import { HeaderBuilder } from "./header-builder";
import { MaybeResponse } from "./maybe-response";
import { RequestSigner } from "./request-signer";
import { CoralogixLogger } from "./coralogix-logger";

function loadRequestSigner(request: Request): MaybeResponse<RequestSigner> {
  let secretsDict = new Fastly.Dictionary("secrets");
  let awsKey = "";
  let awsID = "";
  if (secretsDict.contains("AWS_SECRET_ACCESS_KEY") && secretsDict.contains("AWS_ACCESS_KEY_ID")) {
    awsKey = secretsDict.get("AWS_SECRET_ACCESS_KEY") != null ? <string>secretsDict.get("AWS_SECRET_ACCESS_KEY") : "";
    awsID = secretsDict.get("AWS_ACCESS_KEY_ID") != null ? <string>secretsDict.get("AWS_ACCESS_KEY_ID") : "";
  }
  if (awsID == "" || awsKey == "") {
    return new MaybeResponse<RequestSigner>().withResponse(
      new Response(String.UTF8.encode("Unable to load credentials."), {
        status: 500,
        headers: new HeaderBuilder('x-error', 'Unable to load credentials'),
        url: null
      }));
  }

  const now = <i64>Date.now();

  Console.log("\nLoaded AWS Credentials: " + awsKey.substr(0, 4) + "... " + awsID.substr(0, 4) + "... at" + now.toString());

  const signer = new RequestSigner(awsID, awsKey)
    .withTimestamp(now);
  
  return new MaybeResponse<RequestSigner>().withValue(signer);
}

function loadConfig(req: Request): MaybeResponse<GlobalConfig> {
  const subdomain = (<string>req.headers.get("host")).split(".")[0];
  const subdomainparts = subdomain.split('--');
  if (subdomainparts.length < 2) {
    return new MaybeResponse<GlobalConfig>().withResponse(
      new Response(String.UTF8.encode("Specify at least repo--owner.hlx3.one"), {
        status: 404,
        headers: new HeaderBuilder('x-error', 'No owner, repo, ref'),
        url: null
      }));
  }
  let owner = subdomainparts.pop();
  let repo = subdomainparts.pop();
  let ref = subdomainparts.length > 0 ? subdomainparts.pop() : "main";

  Console.log("\nreceived: " + owner + " " + repo + " " + ref);

  const configpath = "/" + owner + "/" + repo + "/" + ref + "/config.json";
  // get config
  // https://helix3-prototype-private-bucket.s3.us-east-1.amazonaws.com/
  const confighost = 'helix-code-bus.s3.us-east-1.amazonaws.com';
  const configurl = "https://" + confighost + configpath;
  Console.log('\nLoading: ' + configurl);

  let configreq = new Request(configurl, {
    headers: null,
    method: 'GET',
    body: null,
  });

  let signerorresp = loadRequestSigner(req);
  if (signerorresp.hasResponse()) {
    return new MaybeResponse<GlobalConfig>().withResponse(signerorresp.getResponse());
  }
  const signer = signerorresp.getValue();

  const signedrequest = signer.sign(configreq);

  Console.log('Request has been signed with Authorization header: ' + <string>signedrequest.headers.get('authorization'));

  const configresponse = Fastly.fetch(signedrequest, {
    backend: BACKEND_S3,
    cacheOverride: null,
  }).wait();

  if (!configresponse.ok) {
    Console.log("\nUnable to load configuration at " + configurl + " (" + configresponse.status.toString(10) + ")");
    Console.log(configresponse.text());
    return new MaybeResponse<GlobalConfig>().withResponse(
      new Response(String.UTF8.encode("Unable to load configuration for " + owner + "/" + repo + "."), {
        status: configresponse.status,
        headers: new HeaderBuilder('x-error', 'Error from S3'),
        url: null
      }));
  }

  // TODO: check for response status
  const global = new GlobalConfig(configresponse.text(), signer, owner, repo, ref);

  Console.log("\nGlobal Configuration has been loaded");

  return new MaybeResponse<GlobalConfig>().withValue(global);
}

function main(req: Request): Response {
  const logger = new CoralogixLogger("helix3", req);

  const globalorerr = loadConfig(req);
  if (globalorerr.hasResponse()) {
    return globalorerr.getResponse();
  }
  const global = globalorerr.getValue();

  logger.debug('Starting dispatcher');

  const dispatcher = new RequestDispatcher(global, logger)
    .withPathHandler("/(media_([0-9a-f]){40,41}).([0-9a-z]+)$", new MediaHandler())
    .withHandler(new PipelineHandler())
    // .withPathHandler("\\.plain\\.html$", new PipelineHandler())
    .withPathHandler("\\.json$", new ContentHandler())
    .withPathHandler("\\.md$", new ContentHandler())
    .withHandler(new CodeHandler())
    .withHandler(new FallbackHandler());

  const dispatchresponse = dispatcher.handle(req);
  logger.logResponse(dispatchresponse);
  return dispatchresponse;
}

// Get the request from the client.
let req = Fastly.getClientRequest();

// Pass the request to the main request handler function.
let resp = main(req);

// Send the response back to the client.
Fastly.respondWith(resp);