import { Request } from "@fastly/as-compute";
import { JSON } from "assemblyscript-json";
import { MountConfig } from "./mount-config";
import { RequestSigner } from "./request-signer";

export class GlobalConfig {
  private json: JSON.Obj;
  private signer: RequestSigner;
  owner: string;
  repo: string;
  ref: string;

  constructor(jsonstr: string, signer: RequestSigner, owner: string, repo: string, ref: string) {
    this.json = <JSON.Obj>JSON.parse(jsonstr);
    this.signer = signer;
    this.owner = owner;
    this.repo = repo;
    this.ref = ref;
  }

  get fstab(): MountConfig {
    return new MountConfig(this.json.getObj("fstab"));
  }

  toString(): string {
    return this.json.toString();
  }

  sign(request: Request): Request {
    return this.signer.sign(request);
  }
}