import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the Flow Sprint Clock scaffold", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /focus timer scaffold/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/flow sprint clock/i)).toBeInTheDocument();
  });
});
