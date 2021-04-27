import { Request,  Response, Headers, URL, Fastly } from "@fastly/as-compute";
import { GlobalConfig } from "./global-config";
import { MountPointMatch } from "./mount-config";
import { JSON } from "assemblyscript-json";
import { BACKEND_S3 } from "./backends";
import { RequestDispatcher } from "./request-dispatcher";
import { FallbackHandler} from "./fallback-handler";

function main(req: Request): Response {
  // get config
  let configheaders = new Headers();
  configheaders.set('host', 'hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com')
  let configreq = new Request('https://hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com/trieloff--helix-demo.json', {
      headers: configheaders,
      method: 'GET',
      body: null,
  });

  let cacheOverride = new Fastly.CacheOverride();
  cacheOverride.setTTL(60);
  const configresponse = Fastly.fetch(configreq, {
      backend: BACKEND_S3,
      cacheOverride,
  }).wait();

  // return configresponse;
  const pathname = new URL(req.url).pathname;
  // TODO: check for response status
  const global = new GlobalConfig(configresponse.text());

  const match = global.fstab.match(pathname);

  if (match == null) {
    return new Response(String.UTF8.encode("This page does not exist."), {
      status: 404,
      headers: null,
      url: null
    });
  }

  const dispatcher = new RequestDispatcher(match)
    .withHandler(new FallbackHandler());

  return dispatcher.handle(req);
  
  return new Response(String.UTF8.encode("Found mountpoint: " 
    + (<MountPointMatch>match).hash + "\n"
    + (<string>req.headers.get("host")).split(".")[0]
    ), {
      status: 200,
      headers: null,
      url: null
  });
  
  
}

// Get the request from the client.
let req = Fastly.getClientRequest();

// Pass the request to the main request handler function.
let resp = main(req);

// Send the response back to the client.
Fastly.respondWith(resp);