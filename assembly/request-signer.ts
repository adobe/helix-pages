import { Request, URL } from "@fastly/as-compute";
import { uriencode } from "./encode-utils";
import {toHexString, hash, hmac, hmac1, hmac2, hmacraw } from "./vendor/sha256";
import { getISO8601Timestamp, getyyyymmddTimestamp } from "./date-utils";

const LF = '\n';

export class RequestSigner {
  private accessKeyID: string;
  private secretAccessKey: string;
  private scope: string;
  private region: string;
  private timestamp: i64;

  constructor(id: string, key: string, scope: string = "/s3/aws4_request", region: string = "us-east-1") {
    this.accessKeyID = id;
    this.secretAccessKey = key;
    this.scope = scope;
    this.region = region;
    this.timestamp = 0;
  }

  withTimestamp(t: i64): RequestSigner {
    this.timestamp = t;
    return this;
  }

  getScope(): string {
    return getyyyymmddTimestamp(this.timestamp) + "/" + this.region + this.scope;
  }

  getSignature(request: Request): string {
    const dateKey = hmac1("AWS4" + this.secretAccessKey, getyyyymmddTimestamp(this.timestamp));
    const dateRegionKey = hmac2(dateKey, this.region);
    const dateRegionServiceKey = hmac2(dateRegionKey, "s3"); // TODO: make service configurable
    const signingKey = hmac2(dateRegionServiceKey, "aws4_request");

    return toHexString(hmac2(signingKey, this.getStringToSign(request)));
  }

  getStringToSign(request: Request): string {
    return "AWS4-HMAC-SHA256" + LF
      + getISO8601Timestamp(this.timestamp) + LF
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
      // TODO: handle body
      + 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  }

  getCanonicalURI(request: Request): string {
    const url = new URL(request.url);
    if (this.scope == "/s3/aws4_request") {  
      return uriencode(url.pathname);
    }
    return uriencode(uriencode(url.pathname, true));
  }

  getCanonicalQueryString(request: Request): string {
    const url = new URL(request.url);
    // TODO: sort, but not needed for S3, as we don't use query strings
    return url.search;
  }

  getCanonicalHeaders(request: Request): string {
    const headernames = request.headers.keys().sort();
    let retval = '';
    for (let i = 0; i < headernames.length; i++) {
      const headerval:string = request.headers.get(headernames[i]) != null ? request.headers.get(headernames[i]) as string : '';
      retval += headernames[i] + ":" + headerval.trim() + LF;
    }
    return retval;
  }

  getSignedHeaders(request: Request): string {
    const headernames = request.headers.keys().sort();
    let retval = new Array<string>();
    for (let i = 0; i < headernames.length; i++) {
      retval.push(headernames[i]);
    }
    return retval.join(';');
  } 


}