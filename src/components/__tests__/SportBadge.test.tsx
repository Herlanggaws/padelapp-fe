import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SportBadge from "@/components/SportBadge";

describe("SportBadge", () => {
  it("T17-AC3: renders 'Tennis' when sport='tennis'", () => {
    render(<SportBadge sport="tennis" />);
    expect(screen.getByText("Tennis")).toBeInTheDocument();
  });

  it("T17-AC3: renders 'Padel' when sport='padel'", () => {
    render(<SportBadge sport="padel" />);
    expect(screen.getByText("Padel")).toBeInTheDocument();
  });

  it("T17-AC3: renders 'Padel · Tennis' when sportType='both'", () => {
    render(<SportBadge sportType="both" />);
    expect(screen.getByText("Padel · Tennis")).toBeInTheDocument();
  });

  it("renders correctly when sportType is padel or tennis", () => {
    const { rerender } = render(<SportBadge sportType="padel" />);
    expect(screen.getByText("Padel")).toBeInTheDocument();

    rerender(<SportBadge sportType="tennis" />);
    expect(screen.getByText("Tennis")).toBeInTheDocument();
  });

  it("renders nothing when neither sport nor sportType is supplied", () => {
    const { container } = render(<SportBadge />);
    expect(container.firstChild).toBeNull();
  });
});
