import { Fastly, Request, Response } from "@fastly/as-compute";
import { BACKEND_S3 } from "../backends";
import { AbstractPathHandler } from "../framework/path-handler";
import { GlobalConfig } from "../global-config";
import { HeaderFilter } from "../header-filter";
import { MountPointMatch } from "../mount-config";

export class ContentHandler extends AbstractPathHandler {
  get name(): string {
    return "content";
  }

  handle(request: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    let contentreq = new Request('https://' + mount.hash +'.s3.us-east-1.amazonaws.com/live' + mount.relpath, {
        headers: null,
        method: 'GET',
        body: null,
    });

    this.logger.debug("fetching content from " + contentreq.url);

    const contentresponse = Fastly.fetch(config.sign(contentreq), {
      backend: BACKEND_S3,
      cacheOverride: null,
    }).wait();

    if (contentresponse.ok) {
      if (mount.relpath.endsWith(".md")) {
        contentresponse.headers.set('content-type', 'text/markdown');
      }
      if (mount.relpath.endsWith(".json")) {
        contentresponse.headers.set('content-type', 'application/json');
      }
      
      const filter = new HeaderFilter()
        .allow('age')
        .allow('content-length')
        .allow('content-type')
        .allow('date')
        .allow('etag')
        .allow('last-modified')

      return filter.filterResponse(contentresponse);
    }

    this.logger.debug("no content found for " + contentreq.url + " (" + contentresponse.status.toString() + ")");

    return new Response(String.UTF8.encode('No content found.'), {
      url: null,
      headers: null,
      status: contentresponse.status,
    });
  }
}