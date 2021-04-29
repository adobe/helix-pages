import { Request,  Response } from "@fastly/as-compute";
import { MountPointMatch } from "../mount-config";

export abstract class RequestHandler {
  abstract match(req: Request): boolean;
  abstract handle(req: Request, mount: MountPointMatch): Response;
}