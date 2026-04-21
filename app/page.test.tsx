import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the Flow Sprint Clock setup shell", () => {
    render(<Home />);

    expect(screen.getByText(/flow sprint clock/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /one task\. one clock\. no clutter\./i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /single task anchor/i }),
    ).toBeInTheDocument();
  });
});
