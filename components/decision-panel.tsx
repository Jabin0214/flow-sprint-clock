import { SessionControls } from "./session-controls";
import styles from "./panel.module.css";

type DecisionPanelProps = {
  taskAnchor: string;
  onTakeBreak: () => void;
  onExtend: () => void;
  onNextSprint: () => void;
  extensionMinutes?: number;
};

export function DecisionPanel({
  taskAnchor,
  onTakeBreak,
  onExtend,
  onNextSprint,
  extensionMinutes = 10,
}: DecisionPanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.stack}>
        <p className={styles.eyebrow}>Decision</p>
        <h2 className={styles.title}>Decide the next clean move.</h2>
        <p className={styles.body}>
          You finished a sprint on <strong>{taskAnchor}</strong>. Reset, buy a
          little more time, or begin the next sprint with intention.
        </p>
      </div>

      <SessionControls
        actions={[
          { label: "Take break", onClick: onTakeBreak },
          {
            label: `Extend ${extensionMinutes} min`,
            onClick: onExtend,
          },
          {
            label: "Next sprint",
            onClick: onNextSprint,
            variant: "primary",
          },
        ]}
      />
    </section>
  );
}
