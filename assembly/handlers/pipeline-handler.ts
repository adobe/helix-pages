import { Fastly, Request, Response, URL } from "@fastly/as-compute";
import { GlobalConfig } from "../global-config";
import { HeaderBuilder } from "../header-builder";
import { MountPointMatch } from "../mount-config";
import { HeaderFilter } from "../header-filter";
import { RequestHandler } from "../framework/request-handler";
import { contentBusPartition } from "./utils";

export class PipelineHandler extends RequestHandler {
  get name(): string {
    return "pipeline";
  }

  match(req: Request): boolean {
    const url = new URL(req.url).pathname;
    if (url.endsWith("/") ) {
      return true;
    }
    const lastsegment = url.split("/").pop();
    if (!lastsegment.includes(".") && lastsegment != "index") {
      // no extension: good
      return true;
    }
    if (lastsegment.endsWith(".plain.html")) {
      // also ok
      return true;
    }
    return false;
  }

  setup(request: Request, mount: MountPointMatch, config: GlobalConfig):void {
    const requrl = new URL(request.url);

    let path = requrl.pathname;
    if (path.endsWith(".plain.html")) {
      path = path.substr(0, path.length - ".plain.html".length);
    }
    if (path.endsWith("/")) {
      path = path + "index";
    }
    path = path + ".md";

    const url = new URL("https://helix-pages.anywhere.run/helix-services/pipeline-service@v1" +
      "?owner="  + config.owner +
      "&repo=" + config.repo + 
      "&ref=" + config.ref + 
      "&path=" + path +
      "&contentBusId=" + mount.hash +
      "&contentBusPartition=" + contentBusPartition(request) +
      (requrl.pathname.endsWith(".plain.html") 
        ? "&selector=plain"
        : "") +
      "&proxyDomain=" + requrl.hostname.split(".").slice(1).join("."));

    let pipelinereq = new Request(url.href, {
        headers: new HeaderBuilder("host", "helix-pages.anywhere.run"),
        method: 'GET',
        body: null,
    });

    this.logger.debug("fetching pipeline from " + pipelinereq.url);

    const cacheOverride = new Fastly.CacheOverride();
    // cacheOverride.setPass();
    // cacheOverride.setTTL(5);
    cacheOverride.setSWR(15);

    const contentresponse = Fastly.fetch(config.sign(pipelinereq), {
      backend: "helix-pages.anywhere.run",
      cacheOverride,
    });

    this.logger.debug('Pending pipeline request has been stashed.');
    this.pending = contentresponse;
  }

  handle(request: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    if (this.pending == null) {
      this.logger.debug('No pending pipeline request has been found, retrying.');
      this.setup(request, mount, config);
    }
    this.logger.debug('A pending pipeline request has been found, continuing.');
    const contentresponse = (this.pending as Fastly.FastlyPendingUpstreamRequest).wait();

    if (contentresponse.ok) {
      const filter = new HeaderFilter()
        .allow('age')
        .allow('content-length')
        .allow('content-type')
        .allow('date')
        .allow('etag')
        .allow('last-modified');

      return filter.filterResponse(contentresponse);
    }
    
    this.logger.debug("Pipeline request failed with status " + contentresponse.status.toString());

    return new Response(String.UTF8.encode('Not implemented yet.'), {
      url: null,
      headers: null,
      status: 404,
    });
  }
}