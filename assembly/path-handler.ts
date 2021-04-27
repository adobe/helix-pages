import { RequestHandler } from "./request-handler";
import { Request,  Response, URL } from "@fastly/as-compute";
import { RegExp } from "assemblyscript-regex";

export class PathHandler extends RequestHandler {
  private handler: RequestHandler;
  private regex: RegExp;

  constructor(pattern: string, handler: RequestHandler) {
    super();
    this.regex = new RegExp(pattern);
    this.handler = handler;
  }

  handle(req: Request): Response {
    return this.handler.handle(req);
  }

  match(req: Request): boolean {
    const pathname = new URL(req.url).pathname;
    const m = this.regex.exec(pathname);
    return (m != null);
  }

}

export abstract class AbstractPathHandler extends RequestHandler {
  match(req: Request): boolean {
    return true;
  }
}