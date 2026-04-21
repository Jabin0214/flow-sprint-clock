import {
  createInitialSession,
  startFocusSession,
  completeFocusSession,
  extendCurrentSession,
  startBreakSession,
  finishBreakSession,
  pauseSession,
  resumeSession,
} from "../lib/session-machine";

describe("session-machine", () => {
  it("creates a setup state with default durations", () => {
    const session = createInitialSession();

    expect(session.mode).toBe("setup");
    expect(session.focusDurationMinutes).toBe(20);
    expect(session.breakDurationMinutes).toBe(5);
  });

  it("starts a focus session with a single task anchor", () => {
    const session = startFocusSession(createInitialSession(), "Ship auth callback");

    expect(session.mode).toBe("focus");
    expect(session.taskAnchor).toBe("Ship auth callback");
    expect(session.remainingSeconds).toBe(20 * 60);
  });

  it("moves to decision after completing focus", () => {
    const session = completeFocusSession(
      startFocusSession(createInitialSession(), "Ship auth callback"),
    );

    expect(session.mode).toBe("decision");
  });

  it("extends the current focus session by 10 minutes", () => {
    const session = extendCurrentSession(
      startFocusSession(createInitialSession(), "Ship auth callback"),
      10,
    );

    expect(session.remainingSeconds).toBe(30 * 60);
  });

  it("starts and completes a break session", () => {
    const decision = completeFocusSession(
      startFocusSession(createInitialSession(), "Ship auth callback"),
    );
    const onBreak = startBreakSession(decision);
    const next = finishBreakSession(onBreak);

    expect(onBreak.mode).toBe("break");
    expect(onBreak.remainingSeconds).toBe(5 * 60);
    expect(next.mode).toBe("setup");
    expect(next.taskAnchor).toBe("Ship auth callback");
  });

  it("supports pause and resume", () => {
    const paused = pauseSession(
      startFocusSession(createInitialSession(), "Ship auth callback"),
    );
    const resumed = resumeSession(paused);

    expect(paused.mode).toBe("paused");
    expect(paused.remainingSeconds).toBe(20 * 60);
    expect(paused.taskAnchor).toBe("Ship auth callback");
    expect(resumed.mode).toBe("focus");
    expect(resumed.remainingSeconds).toBe(20 * 60);
    expect(resumed.taskAnchor).toBe("Ship auth callback");
  });

  it("resumes a paused break back to break with time preserved", () => {
    const decision = completeFocusSession(
      startFocusSession(createInitialSession(), "Ship auth callback"),
    );
    const paused = pauseSession(startBreakSession(decision));
    const resumed = resumeSession(paused);

    expect(paused.mode).toBe("paused");
    expect(paused.pausedFrom).toBe("break");
    expect(paused.remainingSeconds).toBe(5 * 60);
    expect(resumed.mode).toBe("break");
    expect(resumed.remainingSeconds).toBe(5 * 60);
    expect(resumed.taskAnchor).toBe("Ship auth callback");
  });
});
