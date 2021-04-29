import { hmac, hash, toHexString } from "../../assembly/vendor/sha256";

describe("sha256", () => {
  it("hmac", () => {
    expect<string>(hmac("message", "abc")).toBe("859cc656e12c0ecd0afdd7e3d034c3ee81609fcac1b454c231211c7ac69895e8");
    expect<string>(hmac("helix", "abc")).toBe("73e0b24817dc55c7d1296f0f96ca452c95fa3d294db6b7a0871fa1c35b4ef5a7");
    expect<string>(hmac("helix", "this key is long. definitely longer than 256 chars. let's see how truncation works in this case. it will be interesting.")).toBe("02024487855433a389a3f559b16032c5feb08b6b05846de662c5c6a9caf2bac3");
  });

  it("hash", () => {
    expect<string>(toHexString(hash(Uint8Array.wrap(String.UTF8.encode("helix"))))).toBe("54a85d2ae7b0a4d8005ab5cf466d4e582c6ea9aa5060b261241ec65a0ea58506");
  });

  it("hash", () => {
    const data = new Uint8Array(4);
    data[0] = 0x00;
    data[1] = 0x09;
    data[2] = 0xaa;
    data[3] = 0xff;
    expect<string>(toHexString(data)).toBe("0009aaff");
  });
});