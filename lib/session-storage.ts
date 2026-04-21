export const STORAGE_KEY = "flow-sprint-clock:preferences";

export type StoredPreferences = {
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  lastTaskAnchor: string;
};

export const DEFAULT_PREFERENCES: StoredPreferences = {
  focusDurationMinutes: 20,
  breakDurationMinutes: 5,
  lastTaskAnchor: "",
};

export function loadPreferences(): StoredPreferences {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredPreferences>;

    return {
      focusDurationMinutes:
        typeof parsed.focusDurationMinutes === "number"
          ? parsed.focusDurationMinutes
          : DEFAULT_PREFERENCES.focusDurationMinutes,
      breakDurationMinutes:
        typeof parsed.breakDurationMinutes === "number"
          ? parsed.breakDurationMinutes
          : DEFAULT_PREFERENCES.breakDurationMinutes,
      lastTaskAnchor:
        typeof parsed.lastTaskAnchor === "string"
          ? parsed.lastTaskAnchor
          : DEFAULT_PREFERENCES.lastTaskAnchor,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(preferences: StoredPreferences): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
