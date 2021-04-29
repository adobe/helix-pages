import { getISO8601Timestamp, getyyyymmddTimestamp } from "../../assembly/date-utils";

describe("date-utils", () => {
  it("ISO86", () => {
    expect<string>(getISO8601Timestamp(i64(1619679786650))).toBe('20210429T070306Z');
    // example from the AWS docs
    expect<string>(getISO8601Timestamp(i64(1369353600000))).toBe('20130524T000000Z');
  });

  it("yyyymmdd", () => {
    expect<string>(getyyyymmddTimestamp(i64(1619679786650))).toBe('20210429');
  })
});