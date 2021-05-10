import { Request,  Response, URL, Fastly } from "@fastly/as-compute";
import { RequestHandler } from "./request-handler";
import { PathHandler } from "./path-handler";
import { GlobalConfig } from "../global-config";
import { HeaderBuilder } from "../header-builder";
import { Console } from "as-wasi";
import { CoralogixLogger } from "../coralogix-logger";

export class RequestDispatcher {
  private handlers: RequestHandler[];
  private config: GlobalConfig;
  private logger: CoralogixLogger;

  constructor(config: GlobalConfig, logger: CoralogixLogger) {
    this.handlers = new Array<RequestHandler>();
    this.config = config;
    this.logger = logger;
  }

  withHandler(handler: RequestHandler): RequestDispatcher {
    this.handlers.push(handler.withLogger(this.logger));
    return this;
  }

  withPathHandler(pattern: string, handler: RequestHandler): RequestDispatcher {
    this.handlers.push(new PathHandler(pattern, handler).withLogger(this.logger));
    return this;
  }

  handle(request: Request): Response {
    const pool = new Fastly.FetchPool();
    // we need to store them here, because FetchPool.all() is not persistent
    const all = new Array<Fastly.FufilledRequest>();

    const pathname = new URL(request.url).pathname;
    const match = this.config.fstab.match(pathname);
    this.logger.info("Dispatching request for " + pathname);

    if (match == null) {
      this.logger.info("No mountpoint found for " + pathname);
      return new Response(String.UTF8.encode("This page does not exist."), {
        status: 404,
        headers: new HeaderBuilder('x-error', 'mountpoint not found'),
        url: null
      });
    }

    // run the setup method first, so that we can queue backend
    // requests
    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i];
      if (handler.match(request)) {
        Console.log("Preparing handler #" + i.toString() + " " + handler.name +"\n");
        handler.setup(pool, request, match, this.config);
      }
    }

    let lastres: Response | null;
    lastres = null;
    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i];
      if (handler.match(request)) {
        Console.log("Matched handler #" + i.toString() + " " + handler.name +"\n");
        const resp = handler.fulfill(all);
        if (resp != null) {
          const res = handler.handle(resp, request, match, this.config);
          this.logger.info("Handler #" + i.toString() + " got response status " + res.status.toString());
          if (res.ok) {
            return res;
          }
          lastres = res;
          // keep iterating, so that the fallback handler can jump in
        }
      }
    }

    if (lastres == null) {
      return new Response(String.UTF8.encode('Unable to handle request'), {
        status: 500,
        headers: new HeaderBuilder('x-error', 'No handlers registered.'),
        url: null,
      });
    }
    return lastres as Response;
  }
}