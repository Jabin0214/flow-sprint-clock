import styles from "./panel.module.css";

const DEFAULT_FOCUS_OPTIONS = [20, 30, 45];
const DEFAULT_BREAK_OPTIONS = [5, 10, 15];

type SetupPanelProps = {
  taskAnchor: string;
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  onTaskAnchorChange: (value: string) => void;
  onFocusDurationChange: (minutes: number) => void;
  onBreakDurationChange: (minutes: number) => void;
  onStart: () => void;
  focusDurationOptions?: number[];
  breakDurationOptions?: number[];
};

type DurationGroupProps = {
  label: string;
  selectedMinutes: number;
  options: number[];
  onChange: (minutes: number) => void;
};

function renderDurationButton(
  label: string,
  minutes: number,
  selectedMinutes: number,
  onClick: (minutes: number) => void,
) {
  const selected = minutes === selectedMinutes;

  return (
    <button
      key={minutes}
      type="button"
      className={`${styles.button} ${selected ? styles.buttonSelected : ""}`}
      onClick={() => onClick(minutes)}
      role="radio"
      aria-checked={selected}
      aria-label={`${label} ${minutes} min`}
    >
      {minutes} min
    </button>
  );
}

function DurationGroup({
  label,
  selectedMinutes,
  options,
  onChange,
}: DurationGroupProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.optionGrid} role="radiogroup" aria-label={label}>
        {options.map((minutes) =>
          renderDurationButton(label, minutes, selectedMinutes, onChange),
        )}
      </div>
    </fieldset>
  );
}

export function SetupPanel({
  taskAnchor,
  focusDurationMinutes,
  breakDurationMinutes,
  onTaskAnchorChange,
  onFocusDurationChange,
  onBreakDurationChange,
  onStart,
  focusDurationOptions = DEFAULT_FOCUS_OPTIONS,
  breakDurationOptions = DEFAULT_BREAK_OPTIONS,
}: SetupPanelProps) {
  const trimmedAnchor = taskAnchor.trim();

  return (
    <section className={styles.panel}>
      <div className={styles.stack}>
        <p className={styles.eyebrow}>Start clean</p>
        <h2 className={styles.title}>One sprint. One task. One clear finish.</h2>
        <p className={styles.body}>
          Name the single move that matters, then give it a short protected block.
        </p>
      </div>

      <div className={styles.stack}>
        <label className={styles.field}>
          <span className={styles.label}>Single task anchor</span>
          <input
            className={styles.input}
            type="text"
            value={taskAnchor}
            onChange={(event) => onTaskAnchorChange(event.target.value)}
            placeholder="Finish the API error states"
            maxLength={120}
            aria-label="Single task anchor"
          />
        </label>

        <DurationGroup
          label="Focus length"
          selectedMinutes={focusDurationMinutes}
          options={focusDurationOptions}
          onChange={onFocusDurationChange}
        />

        <DurationGroup
          label="Break length"
          selectedMinutes={breakDurationMinutes}
          options={breakDurationOptions}
          onChange={onBreakDurationChange}
        />
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          disabled={trimmedAnchor.length === 0}
          onClick={onStart}
        >
          Start sprint
        </button>
      </div>
    </section>
  );
}
