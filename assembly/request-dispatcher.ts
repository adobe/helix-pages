import { Request,  Response } from "@fastly/as-compute";
import { RequestHandler } from "./request-handler";

export class RequestDispatcher {
  private handlers: RequestHandler[];
  constructor() {
    this.handlers = new Array<RequestHandler>();
  }

  withHandler(handler: RequestHandler): RequestDispatcher {
    this.handlers.push(handler);
    return this;
  }

  withPathHandler(pattern: string, handler: RequestHandler): RequestDispatcher {
    return this;
  }

  handle(request: Request): Response {
    for (let i = 0; i < this.handlers.length; i++) {
      const handler = this.handlers[i];
      if (handler.match(request)) {
        return handler.handle(request);
      }
    }
    return new Response(String.UTF8.encode('Unable to handle this URL pattern'), {
      status: 404,
      headers: null,
      url: null,
    })
  }
}