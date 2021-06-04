import { Request,  Response, Fastly } from "@fastly/as-compute";
import { RequestHandler } from "../framework/request-handler";
import { MountPointMatch } from "../mount-config";
import { BACKEND_S3 } from "../backends";
import { GlobalConfig } from "../global-config";
import { HeaderFilter } from "../header-filter";
import { HeaderBuilder } from "../header-builder";

export class FallbackHandler extends RequestHandler {
  get name(): string {
    return "fallback";
  }

  match(req: Request): boolean {
    return true;
  }


  setup(req: Request, mount: MountPointMatch, config: GlobalConfig): void {
    let codereq = new Request('https://helix-code-bus.s3.us-east-1.amazonaws.com/' + config.owner + "/" + config.repo + "/" + config.ref + "/404.html", {
        headers: null,
        method: 'GET',
        body: null,
    });

    this.logger.debug("fetching 404 page from " + codereq.url);

    const cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setTTL(15);

    const coderesponse = Fastly.fetch(config.sign(codereq), {
      backend: BACKEND_S3,
      cacheOverride,
    });

    this.pending = coderesponse;
  }

  handle(req: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    const coderesponse = (this.pending as Fastly.FastlyPendingUpstreamRequest).wait();

    if (coderesponse.ok) {
      const filter = new HeaderFilter()
        .allow('age')
        .allow('content-length')
        .allow('content-type')
        .allow('date')
        .allow('etag')
        .allow('last-modified')

      return filter.filterResponse(new Response(String.UTF8.encode(coderesponse.text()), {
        headers: coderesponse.headers,
        status: 404, // but in a good way
        url: null,
      }));
    }

    this.logger.debug("no 404 page found for " + coderesponse.url + " (" + coderesponse.status.toString() + ")");

    return new Response(String.UTF8.encode('Page not found.'), {
      url: null,
      headers: new HeaderBuilder("x-error", "Page not found and no custom error page defined."),
      status: 404,
    });
  }
}