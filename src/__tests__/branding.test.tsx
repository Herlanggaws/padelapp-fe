import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { metadata } from "@/app/layout";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: vi.fn(),
  }),
}));

describe("Branding verification", () => {
  it("has correct root metadata title and description", () => {
    expect(metadata.title).toEqual({
      template: "RallyRank | %s",
      default: "RallyRank",
    });
    expect(metadata.description).toBe(
      "Matchmaking, events and rankings for padel and tennis"
    );
  });

  it("displays RALLYRANK wordmark in LoginForm", () => {
    render(<LoginForm />);
    const heading = screen.getByRole("heading", { level: 1, name: /rallyrank/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("RALLYRANK");
  });

  it("displays RALLYRANK wordmark and placeholder in RegisterForm", () => {
    render(<RegisterForm />);
    const heading = screen.getByRole("heading", { level: 1, name: /rallyrank/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("RALLYRANK");

    const emailInput = screen.getByPlaceholderText("rafa@rallyrank.com");
    expect(emailInput).toBeInTheDocument();
  });
});
