import { Request,  Response, Fastly, Headers } from "@fastly/as-compute";
import { RequestHandler } from "../framework/request-handler";
import { MountPointMatch } from "../mount-config";
import { BACKEND_S3 } from "../backends";
import { GlobalConfig } from "../global-config";

export class CodeHandler extends RequestHandler {
  match(req: Request): boolean {
    return true;
  }

  handle(req: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    return new Response(String.UTF8.encode('Not implemented yet.'), {
      url: null,
      headers: null,
      status: 404,
    });
  }
}