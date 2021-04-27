import { Request,  Response, Fastly, URL, Headers } from "@fastly/as-compute";
import { RequestHandler } from "./request-handler";
import { BACKEND_S3 } from "./backends";

export class FallbackHandler extends RequestHandler {
  match(req: Request): boolean {
    return true;
  }

  handle(req: Request): Response {
    const pathname = new URL(req.url).pathname;
    let fallbackheaders = new Headers();
    fallbackheaders.set('host', 'helix3-prototype-fallback-public.s3.us-east-1.amazonaws.com')
    let fallbackreq = new Request('https://helix3-prototype-fallback-public.s3.us-east-1.amazonaws.com' + pathname, {
        headers: fallbackheaders,
        method: 'GET',
        body: null,
    });

    let cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setTTL(30); // fallback content is changed infrequently and fetched frequently
    const fallbackresponse = Fastly.fetch(fallbackreq, {
        backend: BACKEND_S3,
        cacheOverride,
    }).wait();

    if (fallbackresponse.ok) {
      return fallbackresponse;
    }

    return new Response(String.UTF8.encode('No content'), {
      url: null,
      headers: null,
      status: 404,
    });

  }
}