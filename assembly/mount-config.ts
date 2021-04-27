import { JSON } from "assemblyscript-json";
import {toHexString, hash } from "./vendor/sha256";

export class MountPoint {
  path: string;
  url: string;

  constructor(path: string, value: JSON.Value) {
    this.path = path;
    this.url = '';
    if (value.isObj) {
      this.url = (<JSON.Str>(<JSON.Obj>value).getString("url")).toString();
      return this;
    } else if (value.isString) {
      this.url = (<JSON.Str>value).toString();
      return this;
    }
  }

  match(path: string): boolean {
    if (path == '') {
      return false;
    } else if (this.path == path) {
      return true;
    }
    const shortpath = path.split('/').slice(0, -1).join('/');
    return this.match(shortpath);
  }
}

export class MountPointMatch {
  path: string;
  url: string;
  relpath: string;

  constructor(parent: MountPoint, path: string) {
    this.path = parent.path;
    this.url = parent.url;
    this.relpath = path.slice(this.path.length);
  }

  get hash(): string {
    return "h3" + toHexString(hash(Uint8Array.wrap(String.UTF8.encode(this.url)))).substr(0, 60);
  }
}

export class MountConfig {
  private mountpoints: MountPoint[];

  constructor(init: JSON.Obj | null) {
    this.mountpoints = new Array<MountPoint>();
    if (init != null) {
      const jmountpoints = init.getObj("mountpoints");
        if (jmountpoints != null) {
        for (let i = 0;i < jmountpoints.keys.length; i++) {
          this.mountpoints.push(new MountPoint(jmountpoints.keys[i], <JSON.Value>jmountpoints.get(jmountpoints.keys[i])));
        }
      }
    }
  }

  get length(): i32 {
    return this.mountpoints.length;
  }

  match(path: string): MountPointMatch | null {
    for (let i = 0; i < this.mountpoints.length; i++) {
      const mountpoint = this.mountpoints[i];
      if (mountpoint.match(path)) {
        return new MountPointMatch(mountpoint, path);
      }
    }
    return null;
  }
}