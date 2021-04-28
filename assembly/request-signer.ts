import { Request, URL } from "@fastly/as-compute";
import { encodeuri } from "./encode-utils";

const LF = '\n';

export class RequestSigner {
  private id: string;
  private key: string;
  private service: string;

  constructor(id: string, key: string, service: string = "S3") {
    this.id = id;
    this.key = key;
    this.service = service;
  }

  getCanonicalRequest(request: Request) {
    // CanonicalRequest =
    //   HTTPRequestMethod + '\n' +
    //   CanonicalURI + '\n' +
    //   CanonicalQueryString + '\n' +
    //   CanonicalHeaders + '\n' +
    //   SignedHeaders + '\n' +
    //   HexEncode(Hash(RequestPayload))



    return request.method + LF
      + this.getCanonicalURI(request) + LF
      + this.getCanonicalQueryString(request)  + LF
      + this.getCanonicalHeaders(request) + LF
      + this.getSignedHeaders(request) + LF
      + 'UNSIGNED-PAYLOAD';
  }

  getCanonicalURI(request: Request) {
    const url = new URL(request.url);
    if (this.service == "S3") {  
      return encodeuri(url.pathname);
    }
    return encodeuri(encodeuri(url.pathname, true));
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