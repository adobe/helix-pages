import { Request, Response } from "@fastly/as-compute";
import { AbstractPathHandler } from "../framework/path-handler";

export class MediaHandler extends AbstractPathHandler {
  handle(request: Request): Response {
    return new Response(String.UTF8.encode('Not implemented yet.'), {
      url: null,
      headers: null,
      status: 404,
    });
  }
}