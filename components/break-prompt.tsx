import styles from "./panel.module.css";

const DEFAULT_PROMPTS = [
  "Drop your shoulders.",
  "Look away from the work.",
  "Let the last sprint end before the next one begins.",
];

type BreakPromptProps = {
  prompts?: string[];
};

export function BreakPrompt({ prompts = DEFAULT_PROMPTS }: BreakPromptProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.stack}>
        <p className={styles.eyebrow}>Break</p>
        <h2 className={styles.title}>Step away for a clean reset.</h2>
      </div>

      <ul className={styles.promptList}>
        {prompts.map((prompt) => (
          <li key={prompt} className={styles.promptItem}>
            {prompt}
          </li>
        ))}
      </ul>
    </section>
  );
}
