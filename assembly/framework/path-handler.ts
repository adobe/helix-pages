import { RequestHandler } from "./request-handler";
import { Request,  Response, URL, Fastly } from "@fastly/as-compute";
import { RegExp } from "assemblyscript-regex"
import { MountPointMatch } from "../mount-config";
import { GlobalConfig } from "../global-config";
import { CoralogixLogger } from "../coralogix-logger";

export class PathHandler extends RequestHandler {
  private handler: RequestHandler;
  private regex: RegExp;

  constructor(pattern: string, handler: RequestHandler) {
    super();
    this.regex = new RegExp(pattern);
    this.handler = handler;
  }

  get name(): string {
    return "path:" + this.handler.name;
  }

  setup(pool: Fastly.FetchPool, req: Request, mount: MountPointMatch, config: GlobalConfig): Fastly.FetchPool {
    return this.handler.setup(pool, req, mount, config);
  }

  handle(resp: Response, req: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    return this.handler.handle(resp, req, mount, config);
  }

  match(req: Request): boolean {
    const pathname = new URL(req.url).pathname;
    const m = this.regex.exec(pathname);
    return (m != null);
  }

  withLogger(logger: CoralogixLogger): PathHandler {
    this.handler.withLogger(logger);
    return this;
  }

  fulfill(all: Fastly.FufilledRequest[]): Response | null {
    return this.handler.fulfill(all);
  }
}

export abstract class AbstractPathHandler extends RequestHandler {
  match(req: Request): boolean {
    return true;
  }
}