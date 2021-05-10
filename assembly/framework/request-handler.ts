import { Request, Response, Fastly } from "@fastly/as-compute";
import { MountPointMatch } from "../mount-config";
import { GlobalConfig } from "../global-config";
import { CoralogixLogger } from "../coralogix-logger";

export abstract class RequestHandler {
  private log: CoralogixLogger | null;
  protected pending: Request | null;
  protected pool: Fastly.FetchPool | null;

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
  abstract handle(resp: Response, req: Request, mount: MountPointMatch, config: GlobalConfig): Response;

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
  setup(pool: Fastly.FetchPool, req: Request, mount: MountPointMatch, config: GlobalConfig): Fastly.FetchPool {
    // by default, do nothing
    return pool;
  };

  fulfill(all: Fastly.FufilledRequest[]): Response | null {
    
    if (this.pool == null || this.pending == null) {
      this.logger.debug('fulfill: no pool or pending request');
      return null;
    }
    this.logger.debug('fulfilling URL ' + (this.pending as Request).url);
    const fulfilled = (this.pool as Fastly.FetchPool).any();
    // we need to compare based on URL, as request == otherrequest does not work
    if (fulfilled != null && (fulfilled as Fastly.FufilledRequest).request.url == (<Request>this.pending).url) {
      this.logger.debug('fulfill: request is matching ' + fulfilled.request.url);
      // lucky guess - this is our pending request
      return (fulfilled as Fastly.FufilledRequest).response;
    } else if (fulfilled != null) {
      this.logger.debug('fulfill: request is not matching ' + fulfilled.request.url);
      // that's not the right request for us, but it might be for someone else, so
      // stash it
      all.push(fulfilled);
      // that's not the right request, but we can try again (recurse)
      return this.fulfill(all);
    }

    // all requests have completed, so we just check all responses
    this.logger.debug('fulfill: all requests completed ' + all.length.toString());
    for (let i = 0; i < all.length; i++) {
      this.logger.debug(i.toString() + " " + all[i].request.url);
      if (all[i].request.url == (<Request>this.pending).url) {
        // we found our request and return the matching response
        return all[i].response;
      }
    }
    // there are no matches whatsoever, returning with nothing
    return null;
  }

  abstract get name(): string;

  withLogger(logger: CoralogixLogger): RequestHandler {
    this.log = logger;
    return this;
  }

  get logger(): CoralogixLogger {
    return this.log as CoralogixLogger;
  }
}