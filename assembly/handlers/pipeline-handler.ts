import { Fastly, Request, Response, URL } from "@fastly/as-compute";
import { GlobalConfig } from "../global-config";
import { HeaderBuilder } from "../header-builder";
import { MountPointMatch } from "../mount-config";
import { BACKEND_UNIVERSAL} from "../backends";
import { HeaderFilter } from "../header-filter";
import { RequestHandler } from "../framework/request-handler";

export class PipelineHandler extends RequestHandler {
  get name(): string {
    return "pipeline";
  }

  match(req: Request): boolean {
    const url = req.url;
    if (url == "/") {
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

  handle(request: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    const requrl = new URL(request.url);

    const url = new URL("https://helix-pages.anywhere.run/helix-services/pipeline-service@v1" +
      "?owner="  + config.owner +
      "&repo=" + config.repo + 
      "&ref=" + config.ref + 
      "&path=" + requrl.pathname + ".md" +
      "&proxyDomain=" + requrl.hostname.split(".").slice(1).join("."));

    let pipelinereq = new Request(url.href, {
        headers: new HeaderBuilder("host", "helix-pages.anywhere.run"),
        method: 'GET',
        body: null,
    });

    this.logger.debug("fetching pipeline from " + pipelinereq.url);

    const contentresponse = Fastly.fetch(config.sign(pipelinereq), {
      backend: "helix-pages.anywhere.run",
      cacheOverride: null,
    }).wait();

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
    
    this.logger.debug(contentresponse.status.toString());

    return new Response(String.UTF8.encode('Not implemented yet.'), {
      url: null,
      headers: null,
      status: 404,
    });
  }
}