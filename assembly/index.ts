import { Request, Response, Headers, URL, Fastly } from "@fastly/as-compute";
import { GlobalConfig } from "./global-config";
import { Console } from "as-wasi";
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

function loadConfig(req: Request): MaybeResponse<GlobalConfig> {
  const subdomain = (<string>req.headers.get("host")).split(".")[0];
  const subdomainparts = subdomain.split('--');
  if (subdomainparts.length < 2) {
    return new MaybeResponse<GlobalConfig>().withResponse(
      new Response(String.UTF8.encode("Specify at least repo--owner.hlx3.page"), {
        status: 404,
        headers: new HeaderBuilder('x-error', 'No owner, repo, ref'),
        url: null
      }));
  }
  let owner = subdomainparts.pop();
  let repo = subdomainparts.pop();
  let ref = subdomainparts.length > 0 ? subdomainparts.pop() : "main";

  Console.log("\nreceived: " + owner + " " + repo + " " + ref);

  const configpath = "/" + owner + "/" + repo + "/" + ref + ".json";
  // get config
  const configurl = "https://hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com" + configpath;
  Console.log('\nLoading: ' + configurl);

  let configreq = new Request(configurl, {
    headers: new HeaderBuilder('host', 'hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com'),
    method: 'GET',
    body: null,
  });

  let cacheOverride = new Fastly.CacheOverride();
  cacheOverride.setTTL(60);
  const configresponse = Fastly.fetch(configreq, {
    backend: BACKEND_S3,
    cacheOverride,
  }).wait();

  if (!configresponse.ok) {
    Console.log("\nUnable to load configuration at " + configurl + " (" + configresponse.status.toString(10) + ")");
    return new MaybeResponse<GlobalConfig>().withResponse(
      new Response(String.UTF8.encode("Unable to load configuration for " + owner + "/" + repo + "."), {
        status: configresponse.status,
        headers: new HeaderBuilder('x-error', 'Error from S3'),
        url: null
      }));
  }

  // TODO: check for response status
  const global = new GlobalConfig(configresponse.text());

  Console.log("\nGlobal Configuration has been loaded");

  return new MaybeResponse<GlobalConfig>().withValue(global);
}

function main(req: Request): Response {
  const globalorerr = loadConfig(req);
  if (globalorerr.hasResponse()) {
    return globalorerr.getResponse();
  }
  const global = globalorerr.getValue();

  return new Response(String.UTF8.encode("Not implemented yet."), {
    status: 500,
    headers: new HeaderBuilder("x-error", "Not implemented yet"),
    url: null
  });

  // return configresponse;
  const pathname = new URL(req.url).pathname;
  const match = global.fstab.match(pathname);

  if (match == null) {
    return new Response(String.UTF8.encode("This page does not exist."), {
      status: 404,
      headers: null,
      url: null
    });
  }

  Console.log('Starting dispatcher');

  const dispatcher = new RequestDispatcher(match as MountPointMatch)
    .withPathHandler("/(media_([0-9a-f]){40,41}).([0-9a-z]+)$", new MediaHandler())
    .withPathHandler("/$", new PipelineHandler())
    .withPathHandler("\\.plain\\.html$", new PipelineHandler())
    .withPathHandler("\\.json$", new ContentHandler())
    .withPathHandler("\\.md$", new ContentHandler())
    .withHandler(new CodeHandler())
    .withHandler(new FallbackHandler());

  return dispatcher.handle(req);
}

// Get the request from the client.
let req = Fastly.getClientRequest();

// Pass the request to the main request handler function.
let resp = main(req);

// Send the response back to the client.
Fastly.respondWith(resp);