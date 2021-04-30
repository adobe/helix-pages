import { Request, Response, Headers, Fastly } from "@fastly/as-compute";
import { AbstractPathHandler } from "../framework/path-handler";
import { MountPointMatch } from "../mount-config";
import { BACKEND_BLOBSTORE } from "../backends";
import { GlobalConfig } from "../global-config";
import { Console } from "as-wasi";

export class MediaHandler extends AbstractPathHandler {
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

    let mediaheaders = new Headers();
    mediaheaders.set('host', 'hlx.blob.core.windows.net')
    let mediarequest = new Request('https://hlx.blob.core.windows.net/external/' + hash + sas, {
      headers: mediaheaders,
      method: 'GET',
      body: null,
    });

    let mediaresponse = Fastly.fetch(mediarequest, {
      backend: BACKEND_BLOBSTORE,
      cacheOverride: null,
    }).wait();

    // todo: cleanup response headers
    
    return mediaresponse;
  }
}