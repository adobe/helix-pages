import { Request, Response, Headers, Fastly, URL } from "@fastly/as-compute";
import { AbstractPathHandler } from "../framework/path-handler";
import { MountPointMatch } from "../mount-config";
import { BACKEND_BLOBSTORE } from "../backends";
import { GlobalConfig } from "../global-config";
import { Console } from "as-wasi";
import { HeaderFilter } from "../header-filter";

export class MediaHandler extends AbstractPathHandler {
  get name(): string {
    return "media";
  }

  handle(request: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    const name = mount.relpath.split("media_").pop();
    const hash = name.split(".")[0];
    let sas = "";

    let secrets = new Fastly.Dictionary("secrets");
    if (secrets.contains("AZURE_BLOB_SAS_RO")) {
      let valueOrNull = secrets.get("AZURE_BLOB_SAS_RO");
      if (valueOrNull != null) {
        sas = changetype<string>(valueOrNull);
      }
    }

    Console.log("\n handling media for hash " + hash + " with sas " + sas.substr(0, 4));

    const qs = new URL(request.url).search.replace("?", "&");

    let mediaheaders = new Headers();
    mediaheaders.set('host', 'media.hlx3.one')
    let mediarequest = new Request('https://media.hlx3.one/external/' + hash + sas + qs, {
      headers: mediaheaders,
      method: 'GET',
      body: null,
    });

    const cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setPass();

    let mediaresponse = Fastly.fetch(mediarequest, {
      backend: 'media.hlx3.one',
      cacheOverride,
    }).wait();

    // todo: cleanup response headers
    
    const filter = new HeaderFilter()
      .allow('age')
      .allow('content-length')
      .allow('content-type')
      .allow('date')
      .allow('etag')
      .allow('last-modified')

    return filter.filterResponse(mediaresponse);
  }
}