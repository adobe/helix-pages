import { Request,  Response, URL } from "@fastly/as-compute";
import { RequestHandler } from "./request-handler";
import { PathHandler } from "./path-handler";
import { GlobalConfig } from "../global-config";
import { HeaderBuilder } from "../header-builder";
import { Console } from "as-wasi";

export class RequestDispatcher {
  private handlers: RequestHandler[];
  private config: GlobalConfig;
  constructor(config: GlobalConfig) {
    this.handlers = new Array<RequestHandler>();
    this.config = config;
  }

  withHandler(handler: RequestHandler): RequestDispatcher {
    this.handlers.push(handler);
    return this;
  }

  withPathHandler(pattern: string, handler: RequestHandler): RequestDispatcher {
    this.handlers.push(new PathHandler(pattern, handler));
    return this;
  }

  handle(request: Request): Response {
    
    const pathname = new URL(request.url).pathname;
    const match = this.config.fstab.match(pathname);
    Console.log("\nDispatching request for " + pathname);

    if (match == null) {
      Console.log("\nNo mountpoint found for " + pathname);
      return new Response(String.UTF8.encode("This page does not exist."), {
        status: 404,
        headers: new HeaderBuilder('x-error', 'mountpoint not found'),
        url: null
      });
    }

    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i];
      if (handler.match(request)) {
        const res = handler.handle(request, match, this.config);
        Console.log("\nHandler " + i.toString() + " got response status " + res.status.toString());
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