import { render, screen } from "@testing-library/react";
import ServiceCard from "@/components/cards/ServiceCard";

describe("ServiceCard", () => {
  it("renders title and description correctly", () => {
    render(
      <ServiceCard
        title="Dizajn Interior"
        description="Interior design for residential spaces."
      />,
    );

    expect(screen.getByText("Dizajn Interior")).toBeInTheDocument();
    expect(
      screen.getByText("Interior design for residential spaces."),
    ).toBeInTheDocument();
  });
});
