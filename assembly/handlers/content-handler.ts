import { Fastly, Request, Response } from "@fastly/as-compute";
import { BACKEND_S3 } from "../backends";
import { AbstractPathHandler } from "../framework/path-handler";
import { GlobalConfig } from "../global-config";
import { HeaderFilter } from "../header-filter";
import { MountPointMatch } from "../mount-config";
import { contentBusPartition } from "./utils";

export class ContentHandler extends AbstractPathHandler {
  private contentreq: Request | null;

  get name(): string {
    return "content";
  }

  setup(request: Request, mount: MountPointMatch, config: GlobalConfig): void {
    this.contentreq = new Request('https://' + mount.hash +'.s3.us-east-1.amazonaws.com/' + contentBusPartition(request) + mount.relpath, {
        headers: null,
        method: 'GET',
        body: null,
    });

    this.logger.debug("fetching content from " + (this.contentreq as Request).url);

    const cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setPass();

    const contentresponse = Fastly.fetch(config.sign(this.contentreq as Request), {
      backend: BACKEND_S3,
      cacheOverride,
    });

    this.logger.debug("stashing content response");
    this.pending = contentresponse;
  }

  handle(request: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    this.logger.debug("continuing with stashed content response");
    const contentresponse = (<Fastly.FastlyPendingUpstreamRequest>this.pending).wait();

    if (contentresponse.ok) {
      if (mount.relpath.endsWith(".md")) {
        contentresponse.headers.set('content-type', 'text/markdown; charset=utf-8');
      }
      if (mount.relpath.endsWith(".json")) {
        contentresponse.headers.set('content-type', 'application/json');
      }
      if (mount.relpath.endsWith(".xml")) {
        contentresponse.headers.set('content-type', 'application/xml; charset=utf-8');
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

    this.logger.debug("no content found for " + (this.contentreq as Request).url + " (" + contentresponse.status.toString() + ")");

    return new Response(String.UTF8.encode('No content found.'), {
      url: null,
      headers: null,
      status: contentresponse.status,
    });
  }
}