import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PreferredSportsSheet from "@/components/PreferredSportsSheet";
import * as authService from "@/services/authService";

const mockShowSnackbar = vi.fn();
vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: mockShowSnackbar,
  }),
}));

vi.mock("@/services/authService", () => ({
  updatePreferredSports: vi.fn(),
}));

describe("PreferredSportsSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <PreferredSportsSheet
        isOpen={false}
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("T17-AC4: renders 3 choices, submits to updatePreferredSports, disables button during submit, and calls onSaved on success", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleSaved = vi.fn();

    let resolvePromise: (
      value: authService.UpdateUserProfileSuccessResponse,
    ) => void;
    const promise = new Promise<authService.UpdateUserProfileSuccessResponse>(
      (resolve) => {
        resolvePromise = resolve;
      },
    );

    vi.mocked(authService.updatePreferredSports).mockReturnValue(promise);

    render(
      <PreferredSportsSheet
        isOpen={true}
        onClose={handleClose}
        onSaved={handleSaved}
        initialValue="padel"
      />,
    );

    // Check 3 options exist
    expect(screen.getByRole("button", { name: /Padel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tennis/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Both/i })).toBeInTheDocument();

    const tennisOption = screen.getByRole("button", { name: /Tennis/i });
    await user.click(tennisOption);

    const submitBtn = screen.getByRole("button", { name: /Save Preferences/i });
    await user.click(submitBtn);

    // Verify service was called once with the selected sport
    expect(authService.updatePreferredSports).toHaveBeenCalledTimes(1);
    expect(authService.updatePreferredSports).toHaveBeenCalledWith({
      preferred_sports: "tennis",
    });

    // Check that button is disabled and text is changed to Saving...
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent("Saving...");

    // Resolve the promise
    resolvePromise!({ data: null, message: "Success" });

    await waitFor(() => {
      expect(handleSaved).toHaveBeenCalledWith("tennis");
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it("T17-AC4: on error, shows snackbar message and stays open without calling onSaved", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleSaved = vi.fn();

    vi.mocked(authService.updatePreferredSports).mockRejectedValueOnce(
      new Error("Server error updating preference"),
    );

    render(
      <PreferredSportsSheet
        isOpen={true}
        onClose={handleClose}
        onSaved={handleSaved}
        initialValue="both"
      />,
    );

    const submitBtn = screen.getByRole("button", { name: /Save Preferences/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        "Server error updating preference",
      );
    });

    // Stays open, onSaved not called, onClose not called
    expect(handleSaved).not.toHaveBeenCalled();
    expect(handleClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it("T17-AC5: closes on Escape key", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <PreferredSportsSheet
        isOpen={true}
        onClose={handleClose}
        onSaved={vi.fn()}
      />,
    );

    await user.keyboard("{Escape}");
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("T17-AC5: traps focus within the sheet when tabbing", async () => {
    const user = userEvent.setup();

    render(
      <PreferredSportsSheet
        isOpen={true}
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const firstButton = buttons[0];
    const lastButton = buttons[buttons.length - 1]; // Cancel button

    lastButton.focus();
    expect(lastButton).toHaveFocus();

    // Tab forward should wrap to firstButton
    await user.tab();
    expect(firstButton).toHaveFocus();

    // Shift+Tab backward should wrap to lastButton
    await user.tab({ shift: true });
    expect(lastButton).toHaveFocus();
  });
});
