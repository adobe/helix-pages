import { Request, Response } from "@fastly/as-compute";
import { AbstractPathHandler } from "../framework/path-handler";
import { MountPointMatch } from "../mount-config";

export class ContentHandler extends AbstractPathHandler {
  handle(request: Request, mount: MountPointMatch): Response {
    return new Response(String.UTF8.encode('Not implemented yet.'), {
      url: null,
      headers: null,
      status: 404,
    });
  }
}