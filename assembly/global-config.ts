import { JSON } from "assemblyscript-json";
import { MountConfig } from "./mount-config";

export class GlobalConfig {
  private json: JSON.Obj;

  constructor(jsonstr: string) {
    this.json = <JSON.Obj>JSON.parse(jsonstr);
  }

  get fstab(): MountConfig {
    return new MountConfig(<JSON.Obj>this.json.getObj("fstab"));
  }
}