import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../app/page";
import { STORAGE_KEY } from "../lib/session-storage";

describe("Home page flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads saved preferences into the setup screen", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        focusDurationMinutes: 30,
        breakDurationMinutes: 10,
        lastTaskAnchor: "Return to auth callback edge case",
      }),
    );

    render(<Home />);

    expect(
      await screen.findByDisplayValue("Return to auth callback edge case"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Focus length 30 min" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("radio", { name: "Break length 10 min" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("starts a sprint, then pauses and resumes it", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(
      screen.getByRole("textbox", { name: /single task anchor/i }),
      "Ship the black and white timer shell",
    );
    await user.click(screen.getByRole("button", { name: /start sprint/i }));

    expect(
      await screen.findByText("Ship the black and white timer shell"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Resume" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("moves to the decision state when a zero-minute sprint starts", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        focusDurationMinutes: 0,
        breakDurationMinutes: 5,
        lastTaskAnchor: "Wrap the current thought",
      }),
    );

    render(<Home />);

    await user.click(screen.getByRole("button", { name: /start sprint/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /take break/i }),
      ).toBeInTheDocument();
    });
  });
});
