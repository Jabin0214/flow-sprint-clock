import {
  loadPreferences,
  savePreferences,
  STORAGE_KEY,
} from "../lib/session-storage";

describe("session-storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns defaults when storage is empty", () => {
    expect(loadPreferences()).toEqual({
      focusDurationMinutes: 20,
      breakDurationMinutes: 5,
      lastTaskAnchor: "",
    });
  });

  it("saves and reloads preferences", () => {
    savePreferences({
      focusDurationMinutes: 30,
      breakDurationMinutes: 10,
      lastTaskAnchor: "Finish auth callback",
    });

    expect(loadPreferences()).toEqual({
      focusDurationMinutes: 30,
      breakDurationMinutes: 10,
      lastTaskAnchor: "Finish auth callback",
    });

    expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
      "Finish auth callback",
    );
  });

  it("falls back to defaults for malformed stored field types", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        focusDurationMinutes: "30",
        breakDurationMinutes: 10,
        lastTaskAnchor: 123,
      }),
    );

    expect(loadPreferences()).toEqual({
      focusDurationMinutes: 20,
      breakDurationMinutes: 10,
      lastTaskAnchor: "",
    });
  });

  it("returns defaults when stored JSON is invalid", () => {
    window.localStorage.setItem(STORAGE_KEY, "{");

    expect(loadPreferences()).toEqual({
      focusDurationMinutes: 20,
      breakDurationMinutes: 5,
      lastTaskAnchor: "",
    });
  });

  it("returns defaults when reading storage fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    expect(loadPreferences()).toEqual({
      focusDurationMinutes: 20,
      breakDurationMinutes: 5,
      lastTaskAnchor: "",
    });
  });

  it("does not throw when writing storage fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    expect(() =>
      savePreferences({
        focusDurationMinutes: 30,
        breakDurationMinutes: 10,
        lastTaskAnchor: "Finish auth callback",
      }),
    ).not.toThrow();
  });
});
