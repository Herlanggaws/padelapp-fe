import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SportFilterChips from "@/components/SportFilterChips";
import type { SportFilterOption } from "@/components/SportFilterChips";

describe("SportFilterChips", () => {
  it("T17-AC1: renders chips for provided options, handles selection, and sets aria-pressed", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options: SportFilterOption[] = ["all", "padel", "tennis"];

    const { rerender } = render(
      <SportFilterChips
        options={options}
        selected="all"
        onChange={handleChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    const allBtn = screen.getByRole("button", { name: "All" });
    const padelBtn = screen.getByRole("button", { name: "Padel" });
    const tennisBtn = screen.getByRole("button", { name: "Tennis" });

    expect(allBtn).toHaveAttribute("aria-pressed", "true");
    expect(padelBtn).toHaveAttribute("aria-pressed", "false");
    expect(tennisBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(tennisBtn);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("tennis");

    // Re-render with selected="tennis"
    rerender(
      <SportFilterChips
        options={options}
        selected="tennis"
        onChange={handleChange}
      />,
    );

    expect(allBtn).toHaveAttribute("aria-pressed", "false");
    expect(tennisBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("T17-AC2: accepts options including 'both' and renders the label 'Both'", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options: SportFilterOption[] = ["all", "padel", "tennis", "both"];

    render(
      <SportFilterChips
        options={options}
        selected="both"
        onChange={handleChange}
      />,
    );

    const bothBtn = screen.getByRole("button", { name: "Both" });
    expect(bothBtn).toBeInTheDocument();
    expect(bothBtn).toHaveAttribute("aria-pressed", "true");

    await user.click(bothBtn);
    expect(handleChange).toHaveBeenCalledWith("both");
  });

  it("T17-AC5: is keyboard accessible with button elements and focusability", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options: SportFilterOption[] = ["all", "padel"];

    render(
      <SportFilterChips
        options={options}
        selected="all"
        onChange={handleChange}
      />,
    );

    const allBtn = screen.getByRole("button", { name: "All" });
    const padelBtn = screen.getByRole("button", { name: "Padel" });

    allBtn.focus();
    expect(allBtn).toHaveFocus();

    await user.tab();
    expect(padelBtn).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleChange).toHaveBeenCalledWith("padel");
  });
});
