import styles from "./panel.module.css";

type TaskAnchorProps = {
  taskAnchor: string;
};

export function TaskAnchor({ taskAnchor }: TaskAnchorProps) {
  return (
    <section className={`${styles.panel} ${styles.compactPanel}`}>
      <p className={styles.eyebrow}>Current anchor</p>
      <p className={styles.anchor}>{taskAnchor}</p>
    </section>
  );
}
