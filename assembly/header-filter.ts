import { Headers, Request, Response } from "@fastly/as-fetch";

export class HeaderFilter {
  private allowlist: string[];
  private blocklist: string[];

  constructor() {
    this.blocklist = new Array<string>();
    this.allowlist = new Array<string>();
  }

  allowed(name: string): boolean {
    return ((this.allowlist.length > 0 && this.allowlist.includes(name.toLowerCase()))
      || (this.blocklist.length > 0 && !this.blocklist.includes(name.toLowerCase()))) as boolean;
  }

  allow(name: string): HeaderFilter {
    this.allowlist.push(name.toLowerCase());
    return this;
  }

  block(name: string): HeaderFilter {
    this.blocklist.push(name);
    return this;
  }

  filterRequest(req: Request): Request {
    this.filterHeaders(req.headers);
    return req;
  }

  filterResponse(resp: Response): Response {
    this.filterHeaders(resp.headers);
    return resp;
  }

  filterHeaders(headers: Headers): Headers {
    const keys = headers.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!this.allowed(key)) {
        headers.delete(key);
      }
    }
    return headers;
  }
}