import { Request, Headers } from "@fastly/as-compute";
import { RequestSigner } from "../../assembly/request-signer";


describe("request-signer", () => {
  xit('getCanonicalHeaders', () => {
    const headers = new Headers();
    headers.set('Host', "hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com");
    headers.set('x-amz-date', '20130524T000000Z');
    headers.set('x-amz-content-sha256', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    headers.set('range', 'bytes=0-9');

    const request = new Request("https://hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com/trieloff--helix-demo.json", {
      body: null,
      method: 'GET',
      headers
    });

    const signer = new RequestSigner("AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY")
      .withTimestamp(i64(1369353600000));
    
    const exp = 'host:hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com\nrange:bytes=0-9\nx-amz-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nx-amz-date:20130524T000000Z\n';
    const res = signer.getCanonicalHeaders(request);
    // log(res);
    // log(exp);
    expect<string>(res).toBe(exp);
  });

  xit('getSignedHeaders', () => {
    const headers = new Headers();
    headers.set('Host', "hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com");
    headers.set('x-amz-date', '20130524T000000Z');
    headers.set('x-amz-content-sha256', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    headers.set('range', 'bytes=0-9');

    const request = new Request("https://hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com/trieloff--helix-demo.json", {
      body: null,
      method: 'GET',
      headers
    });

    const signer = new RequestSigner("AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY")
      .withTimestamp(i64(1369353600000));
    
    const exp = 'host;range;x-amz-content-sha256;x-amz-date';
    const res = signer.getSignedHeaders(request);
    log(res);
    log(exp == res);
    expect<string>(res).toBe(exp);
  });

  it('getCanonicalRequest', () => {
    const headers = new Headers();
    headers.set('Host', "examplebucket.s3.amazonaws.com");
    headers.set('x-amz-date', '20130524T000000Z');
    headers.set('x-amz-content-sha256', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    headers.set('range', 'bytes=0-9');

    const request = new Request("https://examplebucket.s3.amazonaws.com/test.txt", {
      body: null,
      method: 'GET',
      headers
    });

    const signer = new RequestSigner("AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY")
      .withTimestamp(i64(1369353600000));
    
    // log("signature (should be f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41)")
    // log(signer.getAuthorizationHeaderValue(request));

    const signed = signer.sign(request);
    log(signed.headers.get('authorization'));
  });
});