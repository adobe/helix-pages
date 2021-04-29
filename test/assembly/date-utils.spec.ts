import { getISO8601Timestamp, getyyyymmddTimestamp } from "../../assembly/date-utils";

describe("date-utils", () => {
  it("ISO86", () => {
    expect<string>(getISO8601Timestamp(i64(1619679786650))).toBe('20210429T070306Z');
  });

  it("yyyymmdd", () => {
    expect<string>(getyyyymmddTimestamp(i64(1619679786650))).toBe('20210429');
  })
});