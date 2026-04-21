export type SessionMode = "setup" | "focus" | "decision" | "break" | "paused";

type SessionBase = {
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  taskAnchor?: string;
};

export type SetupSession = SessionBase & {
  mode: "setup";
  taskAnchor?: string;
};

export type FocusSession = SessionBase & {
  mode: "focus";
  taskAnchor: string;
  remainingSeconds: number;
};

export type DecisionSession = SessionBase & {
  mode: "decision";
  taskAnchor: string;
};

export type BreakSession = SessionBase & {
  mode: "break";
  taskAnchor: string;
  remainingSeconds: number;
};

export type PausedSession = SessionBase & {
  mode: "paused";
  taskAnchor: string;
  remainingSeconds: number;
  pausedFrom: "focus" | "break";
};

export type SessionState =
  | SetupSession
  | FocusSession
  | DecisionSession
  | BreakSession
  | PausedSession;

const DEFAULT_FOCUS_DURATION_MINUTES = 20;
const DEFAULT_BREAK_DURATION_MINUTES = 5;

function createBaseSession(
  session: Pick<SessionBase, "focusDurationMinutes" | "breakDurationMinutes">,
): SessionBase {
  return {
    focusDurationMinutes: session.focusDurationMinutes,
    breakDurationMinutes: session.breakDurationMinutes,
  };
}

export function createInitialSession(): SetupSession {
  return {
    mode: "setup",
    focusDurationMinutes: DEFAULT_FOCUS_DURATION_MINUTES,
    breakDurationMinutes: DEFAULT_BREAK_DURATION_MINUTES,
  };
}

export function startFocusSession(
  session: SetupSession,
  taskAnchor: string,
): FocusSession {
  return {
    ...createBaseSession(session),
    mode: "focus",
    taskAnchor,
    remainingSeconds: session.focusDurationMinutes * 60,
  };
}

export function completeFocusSession(
  session: FocusSession,
): DecisionSession {
  return {
    ...createBaseSession(session),
    mode: "decision",
    taskAnchor: session.taskAnchor,
  };
}

export function extendCurrentSession(
  session: FocusSession,
  extensionMinutes: number,
): FocusSession {
  return {
    ...session,
    remainingSeconds: session.remainingSeconds + extensionMinutes * 60,
  };
}

export function startBreakSession(
  session: DecisionSession,
): BreakSession {
  return {
    ...createBaseSession(session),
    mode: "break",
    taskAnchor: session.taskAnchor,
    remainingSeconds: session.breakDurationMinutes * 60,
  };
}

export function finishBreakSession(
  session: BreakSession,
): SetupSession {
  return {
    mode: "setup",
    focusDurationMinutes: session.focusDurationMinutes,
    breakDurationMinutes: session.breakDurationMinutes,
    taskAnchor: session.taskAnchor,
  };
}

export function pauseSession(
  session: FocusSession | BreakSession,
): PausedSession {
  return {
    ...createBaseSession(session),
    mode: "paused",
    taskAnchor: session.taskAnchor,
    remainingSeconds: session.remainingSeconds,
    pausedFrom: session.mode,
  };
}

export function resumeSession(
  session: PausedSession,
): FocusSession | BreakSession {
  if (session.pausedFrom === "break") {
    return {
      ...createBaseSession(session),
      mode: "break",
      taskAnchor: session.taskAnchor,
      remainingSeconds: session.remainingSeconds,
    };
  }

  return {
    ...createBaseSession(session),
    mode: "focus",
    taskAnchor: session.taskAnchor,
    remainingSeconds: session.remainingSeconds,
  };
}
