import { formatSeconds, isDecisionWindow } from "../lib/time";
import styles from "./panel.module.css";

type FocusClockProps = {
  remainingSeconds: number;
};

export function FocusClock({ remainingSeconds }: FocusClockProps) {
  const nearingDecision = isDecisionWindow(remainingSeconds);
  const hint = nearingDecision
    ? "Wrap the thought and choose what happens next."
    : "Stay with one clear move until the bell.";

  return (
    <section className={`${styles.panel} ${styles.compactPanel}`}>
      <div className={styles.timerWrap}>
        <p className={styles.eyebrow}>Focus clock</p>
        <p className={styles.timer} aria-live="polite" aria-atomic="true">
          {formatSeconds(remainingSeconds)}
        </p>
        <p className={styles.hint}>{hint}</p>
      </div>
    </section>
  );
}
