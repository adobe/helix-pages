import { Request,  Response, URL } from "@fastly/as-compute";
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

    for (let i = 0; i < this.handlers.length; i++) {
      Console.log("Trying handler #" + i.toString() + "\n");
      const handler = this.handlers[i];
      if (handler.match(request)) {
        Console.log("Matched handler #" + i.toString() + " " + handler.name +"\n");
        const res = handler.handle(request, match, this.config);
        this.logger.info("Handler #" + i.toString() + " got response status " + res.status.toString());
        if (res.ok) {
          return res;
        }
        // keep iterating, so that the fallback handler can jump in
      }
    }

    return new Response(String.UTF8.encode('Unable to handle this URL pattern'), {
      status: 404,
      headers: new HeaderBuilder('x-error', 'No matching handler found for this URL pattern'),
      url: null,
    })
  }
}