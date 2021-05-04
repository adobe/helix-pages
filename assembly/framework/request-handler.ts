import { Request,  Response } from "@fastly/as-compute";
import { MountPointMatch } from "../mount-config";
import { GlobalConfig } from "../global-config";
import { CoralogixLogger } from "../coralogix-logger";

export abstract class RequestHandler {
  private log: CoralogixLogger | null;

  abstract match(req: Request): boolean;
  abstract handle(req: Request, mount: MountPointMatch, config: GlobalConfig): Response;

  abstract get name(): string;

  withLogger(logger: CoralogixLogger): RequestHandler {
    this.log = logger;
    return this;
  }

  get logger(): CoralogixLogger {
    return this.log as CoralogixLogger;
  }
}