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

  it("limits polite announcements to the timer value instead of the whole panel", () => {
    render(<FocusClock remainingSeconds={125} />);

    const timer = screen.getByText("02:05");
    const panel = screen.getByText(/focus clock/i).closest("section");

    expect(timer).toHaveAttribute("aria-live", "polite");
    expect(panel).not.toHaveAttribute("aria-live");
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
    fireEvent.click(
      screen.getByRole("radio", { name: /focus length 30 min/i }),
    );
    fireEvent.click(
      screen.getByRole("radio", { name: /break length 10 min/i }),
    );

    expect(onTaskAnchorChange).toHaveBeenCalledWith("Tighten landing page copy");
    expect(onFocusDurationChange).toHaveBeenCalledWith(30);
    expect(onBreakDurationChange).toHaveBeenCalledWith(10);
  });

  it("groups duration choices with labeled radio groups", () => {
    render(
      <SetupPanel
        taskAnchor="Ship timer"
        focusDurationMinutes={30}
        breakDurationMinutes={10}
        onTaskAnchorChange={() => {}}
        onFocusDurationChange={() => {}}
        onBreakDurationChange={() => {}}
        onStart={() => {}}
      />,
    );

    expect(screen.getByRole("radiogroup", { name: /focus length/i })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: /break length/i })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /focus length 30 min/i }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("radio", { name: /break length 10 min/i }),
    ).toHaveAttribute("aria-checked", "true");
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

  it("accepts explicit action ids for stable keys when labels repeat", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <SessionControls
        actions={[
          { id: "primary-pause", label: "Pause", onClick: () => {} },
          { id: "secondary-pause", label: "Pause", onClick: () => {} },
        ]}
      />,
    );

    expect(screen.getAllByRole("button", { name: "Pause" })).toHaveLength(2);
    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
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
