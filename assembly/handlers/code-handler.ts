import { Request,  Response, Fastly, Headers } from "@fastly/as-compute";
import { RequestHandler } from "../framework/request-handler";
import { MountPointMatch } from "../mount-config";
import { BACKEND_S3 } from "../backends";
import { GlobalConfig } from "../global-config";
import { HeaderFilter } from "../header-filter";

export class CodeHandler extends RequestHandler {
  get name(): string {
    return "code";
  }

  match(req: Request): boolean {
    return true;
  }

  handle(req: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    let codereq = new Request('https://helix-code-bus.s3.us-east-1.amazonaws.com/' + config.owner + "/" + config.repo + "/" + config.ref + mount.relpath, {
        headers: null,
        method: 'GET',
        body: null,
    });

    this.logger.debug("fetching code from " + codereq.url);

    const coderesponse = Fastly.fetch(config.sign(codereq), {
      backend: BACKEND_S3,
      cacheOverride: null,
    }).wait();

    if (coderesponse.ok) {
      if (mount.relpath.endsWith(".md")) {
        coderesponse.headers.set('content-type', 'text/markdown; charset=utf-8');
      }

      const filter = new HeaderFilter()
        .allow('age')
        .allow('content-length')
        .allow('content-type')
        .allow('date')
        .allow('etag')
        .allow('last-modified')

      return filter.filterResponse(coderesponse);
    }

    this.logger.debug("no code found for " + coderesponse.url + " (" + coderesponse.status.toString() + ")");

    return new Response(String.UTF8.encode('No code found.'), {
      url: null,
      headers: null,
      status: coderesponse.status,
    });
  }
}