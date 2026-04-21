import styles from "./panel.module.css";

type SessionAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
};

type SessionControlsProps = {
  actions: SessionAction[];
};

export function SessionControls({ actions }: SessionControlsProps) {
  if (actions.length < 1 || actions.length > 3) {
    throw new Error("SessionControls expects between 1 and 3 actions.");
  }

  return (
    <div className={styles.actionRow}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={`${styles.button} ${styles.buttonFlexible} ${
            action.variant === "primary" ? styles.buttonPrimary : ""
          }`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export type { SessionAction };
