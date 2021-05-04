import { Request, Response } from "@fastly/as-compute";
import { AbstractPathHandler } from "../framework/path-handler";
import { GlobalConfig } from "../global-config";
import { MountPointMatch } from "../mount-config";

export class PipelineHandler extends AbstractPathHandler {
  get name(): string {
    return "pipeline";
  }

  handle(request: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    return new Response(String.UTF8.encode('Not implemented yet.'), {
      url: null,
      headers: null,
      status: 404,
    });
  }
}