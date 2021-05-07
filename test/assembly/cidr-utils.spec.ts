import { isInIPv4Range } from "../../assembly/cidr-utils";

describe("isInIPv4Range", () => {
  it("exact matches", () => {
    expect<boolean>(isInIPv4Range("192.168.1.23/28", "192.168.1.23")).toBe(true);
  });

  it("block matches", () => {
    expect<boolean>(isInIPv4Range("192.168.1.8/28", "192.168.1.12")).toBe(true);
  });

  it("block non matches", () => {
    expect<boolean>(isInIPv4Range("192.168.1.8/16", "192.169.2.12")).toBe(false);
  });

  it("prefix zero", () => {
    expect<boolean>(isInIPv4Range("192.168.1.24/0", "10.17.5.23")).toBe(true);
  });

  it("prefix 32", () => {
    expect<boolean>(isInIPv4Range("192.168.1.24/32", "192.168.1.24")).toBe(true);
  });
});