import { Fastly, Request, Response, URL } from "@fastly/as-compute";
import { JSON, JSONEncoder } from "assemblyscript-json";
import { BACKEND_S3 } from "../backends";
import { AbstractPathHandler } from "../framework/path-handler";
import { GlobalConfig } from "../global-config";
import { HeaderBuilder } from "../header-builder";
import { HeaderFilter } from "../header-filter";
import { MountPointMatch } from "../mount-config";
import { queryparam, queryparamint } from "../url-utils";

export class JSONHandler extends AbstractPathHandler {
  private contentreq: Request | null;

  get name(): string {
    return "json";
  }
  setup(request: Request, mount: MountPointMatch, config: GlobalConfig): void {
    this.contentreq = new Request('https://' + mount.hash +'.s3.us-east-1.amazonaws.com/live' + mount.relpath, {
        headers: null,
        method: 'GET',
        body: null,
    });

    this.logger.debug("fetching json from " + (this.contentreq as Request).url);

    const cacheOverride = new Fastly.CacheOverride();
    cacheOverride.setPass();

    this.pending = Fastly.fetch(config.sign(this.contentreq as Request), {
      backend: BACKEND_S3,
      cacheOverride,
    });
  }


  handle(request: Request, mount: MountPointMatch, config: GlobalConfig): Response {
    const contentresponse = (this.pending as Fastly.FastlyPendingUpstreamRequest).wait();

    if (contentresponse.ok) {
      if (mount.relpath.endsWith(".json")) {
        contentresponse.headers.set('content-type', 'application/json');
      }

      const urlParams = new URL(request.url).search;
      const sheet = queryparam(urlParams, "sheet", "");
      let limit = queryparamint(urlParams, "limit", -1);
      let offset = queryparamint(urlParams, "offset", -1);

      this.logger.debug("Query string: " + urlParams);

      if (sheet != "") {
        this.logger.debug("Filtering sheet " + sheet + " from " + offset.toString(10) + " to " + limit.toString(10));

        const data = <JSON.Obj>JSON.parse(contentresponse.text());
        if (data == null) {
          return new Response(String.UTF8.encode('No JSON object found.'), {
            url: null,
            headers: new HeaderBuilder("x-error", "No JSON object found."),
            status: 502,
          });
        }
        if (!data.has(sheet)) {
          return new Response(String.UTF8.encode('Sheet does not exist.'), {
            url: null,
            headers: new HeaderBuilder("x-error", "Sheet does not exist."),
            status: 404,
          });
        }
        const sheetdata = <JSON.Arr>data.getArr(sheet);
        const sheetrows = sheetdata.valueOf();

        const filtered = new Array<JSON.Value>();

        if (offset <= 0) {
          offset = 0;
        }
        if (limit <= 0) {
          limit = sheetrows.length - offset;
        }
        for (let i = offset; // start at offset or zero
             i < sheetrows.length && i < limit + offset; // go up to limit or end
             i++) {
               this.logger.debug("Index " + i.toString(10) + " is between offset " + offset.toString(10) + " and limit " + limit.toString(10));
               filtered.push(sheetrows[i]);
             }
        

        this.logger.debug("Building JSON output with " + filtered.length.toString() + " results");
        const retval = new JSONEncoder();
        retval.pushObject(""); // root
        retval.setInteger("limit", limit);
        retval.setInteger("offset", offset),
        retval.setInteger("total", filtered.length);

        this.logger.debug("Metadata properties attached, building data array now");
        
        retval.pushArray("data"); // .data

        for (let i = 0; i < filtered.length; i++) {
          this.logger.debug("Adding element " + i.toString(10) + " of " + filtered.length.toString(10) + " to output");
          const filteredobj = <JSON.Obj>filtered[i];
          if (filteredobj == null || !filteredobj.isObj) {
            this.logger.debug("Element is empty, returning empty object.");
            retval.pushObject("");
            retval.popObject();
          }
          retval.pushObject("");
          const keys = filteredobj.keys;

          this.logger.debug("Adding element " + i.toString(10) + " of " + filtered.length.toString(10) + " to output with keys: " + keys.join(", "));
          for (let j=0;j < keys.length; j++) {
            const key = keys[j];
            const val = filteredobj.get(key);
            if (val == null) {
              retval.setNull(key);
            } else if (val.isString) {
              retval.setString(key, (<JSON.Str>val).toString());
            } else if (val.isInteger) {
              retval.setInteger(key, (<JSON.Integer>val).valueOf());
            } else if (val.isFloat) {
              retval.setFloat(key, (<JSON.Float>val).valueOf());
            } else if (val.isBool) {
              retval.setBoolean(key, (<JSON.Bool>val).valueOf());
            }
          }
          retval.popObject();
        }

        retval.popArray(); // .data

        retval.popObject(); // root

        return new Response(String.UTF8.encode(retval.toString()), {
          url: null,
          headers: new HeaderBuilder("content-type", "application/json"),
          status: 200,
        });
      }
      
      const filter = new HeaderFilter()
        .allow('age')
        .allow('content-length')
        .allow('content-type')
        .allow('date')
        .allow('etag')
        .allow('last-modified')

      return filter.filterResponse(contentresponse);
    }

    this.logger.debug("no content found for " + (this.contentreq as Request).url + " (" + contentresponse.status.toString() + ")");

    return new Response(String.UTF8.encode('No content found.'), {
      url: null,
      headers: null,
      status: contentresponse.status,
    });
  }
}