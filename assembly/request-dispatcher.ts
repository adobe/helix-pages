import { Request,  Response } from "@fastly/as-compute";
import { RequestHandler } from "./request-handler";
import { MountPointMatch } from "./mount-config";

export class RequestDispatcher {
  private handlers: RequestHandler[];
  private mount: MountPointMatch;
  constructor(mount: MountPointMatch) {
    this.handlers = new Array<RequestHandler>();
    this.mount = mount;
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
        return handler.handle(request, this.mount);
      }
    }
    return new Response(String.UTF8.encode('Unable to handle this URL pattern'), {
      status: 404,
      headers: null,
      url: null,
    })
  }
}