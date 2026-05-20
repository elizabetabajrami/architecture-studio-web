import { render, screen } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders text correctly", () => {
    render(<Button text="Contact us" />);

    expect(screen.getByRole("button", { name: "Contact us" })).toBeInTheDocument();
  });
});
