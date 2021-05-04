import { JSONEncoder } from "assemblyscript-json";
import  { Date, Console } from "as-wasi";
import  { Request, Fastly, Response, Headers } from "@fastly/as-compute";

export class CoralogixLogger {
  private subsystemName: string;
  private start: i64;
  private req: Request;
  private logger: Fastly.LogEndpoint;

  constructor(app: string, req: Request) {
    this.subsystemName = app;
    this.start = Math.floor(Date.now()) as i64;
    this.req = req;
    this.logger = Fastly.getLogEndpoint("Coralogix");

    this.debug("logger initialized");
  }

  public format(level: u8, message: string): string {
    let encoder = new JSONEncoder();
    let now: i64 = Math.floor(Date.now()) as i64;

    encoder.pushObject("");
    encoder.setInteger("timestamp", now);
    encoder.setString("applicationName", "fastly-edgecompute");
    encoder.setString("subsystemName", this.subsystemName);
    encoder.setInteger("severity", level);
    encoder.pushObject("json");
    encoder.setString("message", message);

    encoder.pushObject("edgecompute");
    encoder.setString("url", this.req.url);
    encoder.popObject();

    // json.cdn
    encoder.pushObject("cdn");
    if (this.req.headers.has("x-cdn-url")) {
      encoder.setString("url", this.req.headers.get("x-cdn-url") as string);
    } else {
      encoder.setString("url", this.req.url);
    }
    

    // json.cdn.time
    encoder.pushObject("time");
    encoder.setInteger("start_msec", this.start);
    encoder.setInteger("elapsed", now - this.start);
    encoder.popObject();

    // json.cdn.request
    encoder.pushObject("request");
    encoder.setString("method", this.req.method);
    if (this.req.headers.has("User-Agent")) {
      encoder.setString("user_agent", this.req.headers.get("User-Agent") as string);
    }
    encoder.popObject();

    encoder.popObject();

    encoder.popObject();
    encoder.popObject();

    return encoder.toString();
  }

  public logResponse(response: Response) {
    let encoder = new JSONEncoder();
    let now: i64 = Math.floor(Date.now()) as i64;

    encoder.pushObject("");
    encoder.setInteger("timestamp", now);
    encoder.setString("applicationName", "fastly-edgecompute");
    encoder.setString("subsystemName", this.subsystemName);
    let level = 3;
    if (response.status >= 400) {
      level = 4;
    }
    if (response.status >= 500) {
      level = 5;
    }
    encoder.setInteger("severity", level);
    encoder.pushObject("json");

    encoder.pushObject("edgecompute");
    encoder.setString("url", this.req.url);
    encoder.popObject();

    // json.cdn
    encoder.pushObject("cdn");
    if (this.req.headers.has("x-cdn-url")) {
      encoder.setString("url", this.req.headers.get("x-cdn-url") as string);
    } else {
      encoder.setString("url", this.req.url);
    }
    

    // json.cdn.time
    encoder.pushObject("time");
    encoder.setInteger("start_msec", this.start);
    encoder.setInteger("elapsed", now - this.start);
    encoder.popObject();

    // json.cdn.request
    encoder.pushObject("request");
    encoder.setString("method", this.req.method);
    if (this.req.headers.has("User-Agent")) {
      encoder.setString("user_agent", this.req.headers.get("User-Agent") as string);
    }
    encoder.popObject(); // .json.cdn.request

    encoder.pushObject("response");
    encoder.setInteger("status", response.status);
    
    this.logHeader(encoder, response.headers, "x-error", "error");
    this.logHeader(encoder, response.headers, "content-type");
    this.logHeader(encoder, response.headers, "age");
    this.logHeader(encoder, response.headers, "age");
    this.logHeader(encoder, response.headers, "cache-control");
    this.logHeader(encoder, response.headers, "vary");
    encoder.popObject(); // .json.cdn.response

    encoder.popObject(); // .json.cdn

    encoder.popObject(); // .json
    encoder.popObject(); // .

    return encoder.toString();
  }

  private logHeader(encoder: JSONEncoder, headers: Headers, name: string, label?: string) {
    if (!label) {
      label = name;
    }
    if (headers.has(name)) {
      encoder.setString(label, headers.get(name) as string);
    }
  }

  public debug(message: string): void {
    Console.log("[DEBUG] " + message + "\n");
    this.logger.log(this.format(1, message));
  }

  public log(message: string): void {
    Console.log("[LOG] " + message + "\n");
    this.logger.log(this.format(2, message));
  }

  public info(message: string): void {
    Console.log("[INFO] " + message + "\n");
    this.logger.log(this.format(3, message));
  }

  public warn(message: string): void {
    Console.log("[WARN] " + message + "\n");
    this.logger.log(this.format(4, message));
  }

  public error(message: string): void {
    Console.error("[ERROR] " + message + "\n");
    this.logger.log(this.format(5, message));
  }

}