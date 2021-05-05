import { FastlyPendingUpstreamRequest, Request,  Response } from "@fastly/as-compute";
import { MountPointMatch } from "../mount-config";
import { GlobalConfig } from "../global-config";
import { CoralogixLogger } from "../coralogix-logger";

export abstract class RequestHandler {
  private log: CoralogixLogger | null;
  protected pending: FastlyPendingUpstreamRequest | null;

  /**
   * Determines if a handler is eligible to serve a given request. Returning
   * `true` does not guarantee that the response won't be an error (status >= 400),
   * but it ensures the handler is capable of serving this type of requests.
   * 
   * The `match` method should be as simple and lightweight as possible as it is
   * called frequently.
   * @param req the incoming request
   * @returns true if the handler is able to handle the request
   */
  abstract match(req: Request): boolean;
  /**
   * The handle method handles either the incoming request or the stashed `pending`
   * response. It returns a Response. If the response is an error, other request
   * handlers may try to serve the response instead.
   * @param req the incoming request
   * @param mount where the content is mounted
   * @param config a global configuration
   */
  abstract handle(req: Request, mount: MountPointMatch, config: GlobalConfig): Response;
  
  /**
   * Override this method to enable concurrent backend requests. This method 
   * should make a backend request and stash it in `this.pending` without
   * calling `wait()`, which would be done in the `handle` method.
   * 
   * Implementing this method allows you to make speculative backend requests
   * and improve response times in cases where multiple handlers are eligible
   * for a single request.
   * @param req the incoming request
   * @param mount where the content is mounted
   * @param config a global configuration
   */
  setup(req: Request, mount: MountPointMatch, config: GlobalConfig): void {
    // by default, do nothing
  };

  abstract get name(): string;

  withLogger(logger: CoralogixLogger): RequestHandler {
    this.log = logger;
    return this;
  }

  get logger(): CoralogixLogger {
    return this.log as CoralogixLogger;
  }
}