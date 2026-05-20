import { render, screen } from "@testing-library/react";
import Navbar from "@/components/layout/Navbar";

jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/",
    events: {
      off: jest.fn(),
      on: jest.fn(),
    },
    pathname: "/",
  }),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    logout: jest.fn(),
    user: null,
  }),
}));

describe("Navbar", () => {
  it("renders main navigation links", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /rreth nesh/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /portofolio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /kontakti/i })).toBeInTheDocument();
  });
});
