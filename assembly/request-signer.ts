import { Request, URL } from "@fastly/as-compute";
import { uriencode } from "./encode-utils";
import {toHexString, hash } from "./vendor/sha256";
import { getISO8601Timestamp, getyyyymmddTimestamp } from "./date-utils";

const LF = '\n';

export class RequestSigner {
  private id: string;
  private key: string;
  private scope: string;
  private region: string;

  constructor(id: string, key: string, scope: string = "/s3/aws4_request", region: string = "us-east-1") {
    this.id = id;
    this.key = key;
    this.scope = scope;
    this.region = region;
  }

  getScope(): string {
    return getyyyymmddTimestamp() + "/" + this.region + this.scope;
  }

  getStringToSign(request: Request): string {
    return "AWS4-HMAC-SHA256" + LF
      + getISO8601Timestamp() + LF
      + this.getScope() + LF
      + toHexString(hash(Uint8Array.wrap(String.UTF8.encode(this.getCanonicalRequest(request)))));
  }

  getCanonicalRequest(request: Request): string {
    // CanonicalRequest =
    //   HTTPRequestMethod + '\n' +
    //   CanonicalURI + '\n' +
    //   CanonicalQueryString + '\n' +
    //   CanonicalHeaders + '\n' +
    //   SignedHeaders + '\n' +
    //   'UNSIGNED-PAYLOAD'

    return request.method + LF
      + this.getCanonicalURI(request) + LF
      + this.getCanonicalQueryString(request)  + LF
      + this.getCanonicalHeaders(request) + LF
      + this.getSignedHeaders(request) + LF
      + 'UNSIGNED-PAYLOAD';
  }

  getCanonicalURI(request: Request) {
    const url = new URL(request.url);
    if (this.scope == "/s3/aws4_request") {  
      return uriencode(url.pathname);
    }
    return uriencode(uriencode(url.pathname, true));
  }

  getCanonicalQueryString(request: Request) {
    const url = new URL(request.url);
    // TODO: sort, but not needed for S3, as we don't use query strings
    return url.search;
  }

  getCanonicalHeaders(request: Request) {
    const headernames = request.headers.keys().sort();
    let retval = '';
    for (let i = 0; i < headernames.length; i++) {
      retval += headernames[i] + ":" + (request.headers.get(headernames[i]) || '').trim() + LF;
    }
    return retval;
  }

  getSignedHeaders(request: Request) {
    const headernames = request.headers.keys().sort();
    let retval = new Array<string>();
    for (let i = 0; i < headernames.length; i++) {
      retval.push(headernames[i]);
    }
    return retval.join(';');
  } 


}