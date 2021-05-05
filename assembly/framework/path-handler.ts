import { RequestHandler } from "./request-handler";
import { Request,  Response, URL } from "@fastly/as-compute";
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

  setup(req: Request, mount: MountPointMatch, config: GlobalConfig): void {
    this.handler.setup(req, mount, config);
  }

  handle(req: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    return this.handler.handle(req, mount, config);
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
}

export abstract class AbstractPathHandler extends RequestHandler {
  match(req: Request): boolean {
    return true;
  }
}