import { Request,  Response, Headers, URL, Fastly } from "@fastly/as-compute";
import { JSON } from "assemblyscript-json";

// The name of a backend server associated with this service.
//
// This should be changed to match the name of your own backend. See the the
// `Hosts` section of the Fastly Wasm service UI for more information.
const BACKEND_S3 = "s3.amazonaws.com";

function main(req: Request): Response {
    // get config
    let configheaders = new Headers();
    configheaders.set('host', 'hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com')
    let configreq = new Request('https://hlx3-prototype-configs-public.s3.us-east-1.amazonaws.com/trieloff--helix-demo.json', {
        headers: configheaders,
        method: 'GET',
        body: null,
    });

    let cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setTTL(60);
    const configresponse = Fastly.fetch(configreq, {
        backend: BACKEND_S3,
        cacheOverride,
    }).wait();

    let fragments = new URL(req.url).pathname.split('/');
    let log = '';
    let match = '';


    let jsonObj: JSON.Obj = <JSON.Obj>(JSON.parse(configresponse.text()));
    if (jsonObj.getObj("fstab") != null) {
      let fstab = <JSON.Obj>jsonObj.getObj("fstab");
      if (fstab.getArr("mountpoints") != null) {
        let mountpoints = (<JSON.Arr>fstab.getArr("mountpoints")).valueOf();
        for (let i = 0;i < mountpoints.length;i++) {
          const mountpoint = <JSON.Obj>mountpoints[i];
          log += " testing mountpoint " + i.toString();
          let paths = fragments.slice(0);
          while (paths.length > 0) {
            const pathsofar = paths.join('/');
            log += " testing path " + pathsofar;
            if (mountpoint.has(pathsofar)) {
              log += " found match";
              match = (<JSON.Str>mountpoint.getString(pathsofar)).toString();
              break;
            }
            paths.pop();
          }
        }
      } else {
        log += " mountpoints is not an array";
      }
    } else {
      log += " fstab is not an object";
    }
    

    return new Response(String.UTF8.encode("I'm not ready yet: " + match + " " + log), {
        status: 200,
        headers: null,
        url: null
    });
}

// Get the request from the client.
let req = Fastly.getClientRequest();

// Pass the request to the main request handler function.
let resp = main(req);

// Send the response back to the client.
Fastly.respondWith(resp);