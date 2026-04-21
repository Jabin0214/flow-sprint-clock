"use client";

import { useEffect, useMemo, useState } from "react";
import { BreakPrompt } from "../components/break-prompt";
import { DecisionPanel } from "../components/decision-panel";
import { FocusClock } from "../components/focus-clock";
import styles from "../components/app-shell.module.css";
import { SessionControls } from "../components/session-controls";
import { SetupPanel } from "../components/setup-panel";
import { TaskAnchor } from "../components/task-anchor";
import {
  completeFocusSession,
  finishBreakSession,
  pauseSession,
  resumeSession,
  startBreakSession,
  startFocusSession,
  type SessionState,
  type SetupSession,
} from "../lib/session-machine";
import { loadPreferences, savePreferences } from "../lib/session-storage";

const EXTEND_MINUTES = 10;

function createPreferenceBackedSession(): SessionState {
  const preferences = loadPreferences();

  return {
    mode: "setup",
    focusDurationMinutes: preferences.focusDurationMinutes,
    breakDurationMinutes: preferences.breakDurationMinutes,
    taskAnchor: preferences.lastTaskAnchor,
  };
}

function toSetupSession(session: SessionState): SetupSession {
  return {
    mode: "setup",
    focusDurationMinutes: session.focusDurationMinutes,
    breakDurationMinutes: session.breakDurationMinutes,
    taskAnchor: session.taskAnchor,
  };
}

function extendDecisionSession(session: Extract<SessionState, { mode: "decision" }>) {
  return {
    mode: "focus" as const,
    focusDurationMinutes: session.focusDurationMinutes,
    breakDurationMinutes: session.breakDurationMinutes,
    taskAnchor: session.taskAnchor,
    remainingSeconds: EXTEND_MINUTES * 60,
  };
}

export default function Home() {
  const [session, setSession] = useState<SessionState>(createPreferenceBackedSession);

  useEffect(() => {
    savePreferences({
      focusDurationMinutes: session.focusDurationMinutes,
      breakDurationMinutes: session.breakDurationMinutes,
      lastTaskAnchor: session.taskAnchor ?? "",
    });
  }, [session.breakDurationMinutes, session.focusDurationMinutes, session.taskAnchor]);

  useEffect(() => {
    if (session.mode !== "focus" && session.mode !== "break") {
      return;
    }

    const timer = window.setTimeout(() => {
      setSession((current) => {
        if (current.mode !== "focus" && current.mode !== "break") {
          return current;
        }

        if (current.remainingSeconds <= 1) {
          return current.mode === "focus"
            ? completeFocusSession(current)
            : finishBreakSession(current);
        }

        return {
          ...current,
          remainingSeconds: current.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [session]);

  const modeLabel = useMemo(() => {
    switch (session.mode) {
      case "focus":
        return "Focus sprint";
      case "paused":
        return "Paused";
      case "decision":
        return "Decision point";
      case "break":
        return "Break reset";
      default:
        return "Setup";
    }
  }, [session.mode]);

  const startSprint = () => {
    setSession((current) =>
      startFocusSession(toSetupSession(current), (current.taskAnchor ?? "").trim()),
    );
  };

  const returnToSetup = () => {
    setSession((current) => toSetupSession(current));
  };

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <p className={styles.eyebrow}>Flow Sprint Clock</p>
            <h1 className={styles.headline}>One task. One clock. No clutter.</h1>
            <p className={styles.subhead}>
              Built to hold attention in place while you study, code, or finish
              the next clean move.
            </p>
          </div>

          <div className={styles.metaRow}>
            <span className={styles.badge}>{modeLabel}</span>
            <span className={styles.badge}>
              Focus {session.focusDurationMinutes}m / Break {session.breakDurationMinutes}m
            </span>
          </div>
        </header>

        {session.mode === "setup" ? (
          <div className={styles.setupStage}>
            <div className={styles.supportStack}>
              <section className={styles.supportPanel}>
                <p className={styles.supportLabel}>How to use it</p>
                <p className={styles.supportText}>
                  Pick a single task, keep the sprint short, and let the page
                  hold the time so your head does not have to.
                </p>
              </section>

              <p className={styles.setupNote}>
                This first version is intentionally narrow: one current anchor,
                one timer, one clear choice at the end.
              </p>
            </div>

            <SetupPanel
              taskAnchor={session.taskAnchor ?? ""}
              focusDurationMinutes={session.focusDurationMinutes}
              breakDurationMinutes={session.breakDurationMinutes}
              onTaskAnchorChange={(taskAnchor) =>
                setSession((current) => ({
                  ...toSetupSession(current),
                  taskAnchor,
                }))
              }
              onFocusDurationChange={(focusDurationMinutes) =>
                setSession((current) => ({
                  ...toSetupSession(current),
                  focusDurationMinutes,
                }))
              }
              onBreakDurationChange={(breakDurationMinutes) =>
                setSession((current) => ({
                  ...toSetupSession(current),
                  breakDurationMinutes,
                }))
              }
              onStart={startSprint}
            />
          </div>
        ) : null}

        {session.mode === "focus" || session.mode === "paused" || session.mode === "break" ? (
          <div className={styles.focusStage}>
            <div className={styles.supportStack}>
              <TaskAnchor taskAnchor={session.taskAnchor ?? ""} />
              {session.mode === "break" ? (
                <BreakPrompt />
              ) : (
                <section className={styles.supportPanel}>
                  <p className={styles.supportLabel}>
                    {session.mode === "paused" ? "Paused state" : "Stay here"}
                  </p>
                  <p className={styles.supportText}>
                    {session.mode === "paused"
                      ? "Take a breath, then step back into the exact same thought."
                      : "Let the rest of the browser disappear. This page only needs the current task and the remaining time."}
                  </p>
                </section>
              )}
            </div>

            <div className={styles.supportStack}>
              <FocusClock remainingSeconds={session.remainingSeconds} />
              <SessionControls
                actions={
                  session.mode === "paused"
                    ? [
                        {
                          id: "resume",
                          label: "Resume",
                          onClick: () =>
                            setSession((current) =>
                              current.mode === "paused" ? resumeSession(current) : current,
                            ),
                          variant: "primary",
                        },
                        {
                          id: "end",
                          label: "End sprint",
                          onClick: returnToSetup,
                        },
                      ]
                    : session.mode === "break"
                      ? [
                          {
                            id: "pause",
                            label: "Pause",
                            onClick: () =>
                              setSession((current) =>
                                current.mode === "break" ? pauseSession(current) : current,
                              ),
                          },
                          {
                            id: "skip",
                            label: "Skip break",
                            onClick: () =>
                              setSession((current) =>
                                current.mode === "break"
                                  ? finishBreakSession(current)
                                  : current,
                              ),
                            variant: "primary",
                          },
                        ]
                      : [
                          {
                            id: "pause",
                            label: "Pause",
                            onClick: () =>
                              setSession((current) =>
                                current.mode === "focus" ? pauseSession(current) : current,
                              ),
                          },
                          {
                            id: "end",
                            label: "End sprint",
                            onClick: returnToSetup,
                          },
                        ]
                }
              />
            </div>
          </div>
        ) : null}

        {session.mode === "decision" ? (
          <div className={styles.decisionStage}>
            <div className={styles.supportStack}>
              <TaskAnchor taskAnchor={session.taskAnchor} />
              <section className={styles.supportPanel}>
                <p className={styles.supportLabel}>Why this pause exists</p>
                <p className={styles.supportText}>
                  Do not slide into the next thing by accident. Choose whether
                  this thought needs a clean break, a little more time, or a
                  fresh sprint.
                </p>
              </section>
            </div>

            <DecisionPanel
              taskAnchor={session.taskAnchor}
              onTakeBreak={() =>
                setSession((current) =>
                  current.mode === "decision" ? startBreakSession(current) : current,
                )
              }
              onExtend={() =>
                setSession((current) =>
                  current.mode === "decision"
                    ? extendDecisionSession(current)
                    : current,
                )
              }
              onNextSprint={() =>
                setSession((current) =>
                  current.mode === "decision"
                    ? startFocusSession(
                        toSetupSession(current),
                        current.taskAnchor,
                      )
                    : current,
                )
              }
            />
          </div>
        ) : null}

        <footer className={styles.footerHint}>
          <p>Preferences are saved locally in this browser.</p>
          <p>No account. No cloud sync. Just a stable focus surface.</p>
        </footer>
      </section>
    </main>
  );
}
