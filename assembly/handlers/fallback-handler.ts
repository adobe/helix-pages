import { Request,  Response, Fastly, Headers } from "@fastly/as-compute";
import { RequestHandler } from "../framework/request-handler";
import { MountPointMatch } from "../mount-config";
import { BACKEND_S3 } from "../backends";
import { GlobalConfig } from "../global-config";
import { HeaderFilter } from "../header-filter";

export class FallbackHandler extends RequestHandler {
  match(req: Request): boolean {
    return true;
  }

  handle(req: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    let fallbackreq = new Request('https://helix3-prototype-fallback-private.s3.us-east-1.amazonaws.com' + mount.relpath, {
        headers: null,
        method: 'GET',
        body: null,
    });

    let cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setTTL(30); // fallback content is changed infrequently and fetched frequently
    const fallbackresponse = Fastly.fetch(config.sign(fallbackreq), {
        backend: BACKEND_S3,
        cacheOverride,
    }).wait();

    if (fallbackresponse.ok) {
      const filter = new HeaderFilter()
        .allow('age')
        .allow('content-length')
        .allow('content-type')
        .allow('date')
        .allow('etag')
        .allow('last-modified')

      return filter.filterResponse(fallbackresponse);
    }

    return new Response(String.UTF8.encode('No content'), {
      url: null,
      headers: null,
      status: 404,
    });
  }
}