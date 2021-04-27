import { Request,  Response } from "@fastly/as-compute";

export abstract class RequestHandler {
  abstract match(req: Request): boolean;
  abstract handle(req: Request): Response;
}