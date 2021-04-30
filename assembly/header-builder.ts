import { Headers } from "@fastly/as-compute";

export class HeaderBuilder extends Headers {
  constructor(name: string, value: string) {
    super();
    this.set(name, value);
  }

  with(name: string, value: string): HeaderBuilder {
    this.set(name, value);
    return this;
  }
}