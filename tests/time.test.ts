import { formatSeconds, isDecisionWindow } from "../lib/time";

describe("time", () => {
  it("formats seconds as mm:ss", () => {
    expect(formatSeconds(0)).toBe("00:00");
    expect(formatSeconds(9)).toBe("00:09");
    expect(formatSeconds(65)).toBe("01:05");
    expect(formatSeconds(600)).toBe("10:00");
  });

  it("clamps negative values to zero when formatting", () => {
    expect(formatSeconds(-5)).toBe("00:00");
  });

  it("marks the final minute as the decision window", () => {
    expect(isDecisionWindow(61)).toBe(false);
    expect(isDecisionWindow(60)).toBe(true);
    expect(isDecisionWindow(1)).toBe(true);
    expect(isDecisionWindow(0)).toBe(true);
  });
});
