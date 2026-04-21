import { fireEvent, render, screen } from "@testing-library/react";
import { BreakPrompt } from "../components/break-prompt";
import { DecisionPanel } from "../components/decision-panel";
import { FocusClock } from "../components/focus-clock";
import { SessionControls } from "../components/session-controls";
import { SetupPanel } from "../components/setup-panel";
import { TaskAnchor } from "../components/task-anchor";

describe("FocusClock", () => {
  it("renders the formatted time and a steady-state hint", () => {
    render(<FocusClock remainingSeconds={125} />);

    expect(screen.getByText("02:05")).toBeInTheDocument();
    expect(screen.getByText(/stay with one clear move/i)).toBeInTheDocument();
  });

  it("switches the hint during the decision window", () => {
    render(<FocusClock remainingSeconds={45} />);

    expect(
      screen.getByText(/wrap the thought and choose what happens next/i),
    ).toBeInTheDocument();
  });
});

describe("SetupPanel", () => {
  it("renders the setup controls and disables start without a task anchor", () => {
    render(
      <SetupPanel
        taskAnchor=""
        focusDurationMinutes={20}
        breakDurationMinutes={5}
        onTaskAnchorChange={() => {}}
        onFocusDurationChange={() => {}}
        onBreakDurationChange={() => {}}
        onStart={() => {}}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: /single task anchor/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start sprint/i }),
    ).toBeDisabled();
  });

  it("passes through task and duration changes", () => {
    const onTaskAnchorChange = vi.fn();
    const onFocusDurationChange = vi.fn();
    const onBreakDurationChange = vi.fn();

    render(
      <SetupPanel
        taskAnchor="Ship timer"
        focusDurationMinutes={20}
        breakDurationMinutes={5}
        onTaskAnchorChange={onTaskAnchorChange}
        onFocusDurationChange={onFocusDurationChange}
        onBreakDurationChange={onBreakDurationChange}
        onStart={() => {}}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: /single task anchor/i }), {
      target: { value: "Tighten landing page copy" },
    });
    fireEvent.click(screen.getByRole("button", { name: "30 min" }));
    fireEvent.click(screen.getByRole("button", { name: "10 min" }));

    expect(onTaskAnchorChange).toHaveBeenCalledWith("Tighten landing page copy");
    expect(onFocusDurationChange).toHaveBeenCalledWith(30);
    expect(onBreakDurationChange).toHaveBeenCalledWith(10);
  });
});

describe("TaskAnchor", () => {
  it("shows the current single-task anchor", () => {
    render(<TaskAnchor taskAnchor="Ship the clock UI layer" />);

    expect(screen.getByText(/current anchor/i)).toBeInTheDocument();
    expect(screen.getByText("Ship the clock UI layer")).toBeInTheDocument();
  });
});

describe("SessionControls", () => {
  it("renders up to three session actions", () => {
    render(
      <SessionControls
        actions={[
          { label: "Pause", onClick: () => {} },
          { label: "Finish", onClick: () => {} },
          { label: "Reset", onClick: () => {} },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finish" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("rejects empty action sets", () => {
    expect(() => render(<SessionControls actions={[]} />)).toThrow(
      /between 1 and 3 actions/i,
    );
  });
});

describe("BreakPrompt", () => {
  it("renders calm reset prompts", () => {
    render(<BreakPrompt />);

    expect(screen.getByText(/step away for a clean reset/i)).toBeInTheDocument();
    expect(screen.getByText(/drop your shoulders/i)).toBeInTheDocument();
  });
});

describe("DecisionPanel", () => {
  it("renders break, extend, and next sprint actions", () => {
    render(
      <DecisionPanel
        taskAnchor="Polish the timer controls"
        onTakeBreak={() => {}}
        onExtend={() => {}}
        onNextSprint={() => {}}
      />,
    );

    expect(screen.getByText("Polish the timer controls")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /take break/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /extend 10 min/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next sprint/i })).toBeInTheDocument();
  });
});
