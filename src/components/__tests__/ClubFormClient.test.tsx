import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClubFormClient from "@/components/ClubFormClient";
import * as clubService from "@/services/clubService";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockShowSnackbar = vi.fn();
vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: mockShowSnackbar,
  }),
}));

vi.mock("@/services/clubService", () => ({
  createClub: vi.fn(),
}));

describe("ClubFormClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("T18-AC1: shows required sport selector (Padel / Tennis / Both) and submitting sends sport_type", async () => {
    const user = userEvent.setup();
    vi.mocked(clubService.createClub).mockResolvedValue({
      data: null,
      message: "Club created successfully",
    });

    render(<ClubFormClient />);

    // Check 3 sport options exist
    const padelOption = screen.getByRole("radio", { name: "Padel" });
    const tennisOption = screen.getByRole("radio", { name: "Tennis" });
    const bothOption = screen.getByRole("radio", { name: "Both" });

    expect(padelOption).toBeInTheDocument();
    expect(tennisOption).toBeInTheDocument();
    expect(bothOption).toBeInTheDocument();

    // Default is padel
    expect(padelOption).toHaveAttribute("aria-checked", "true");
    expect(tennisOption).toHaveAttribute("aria-checked", "false");

    // Select Tennis
    await user.click(tennisOption);
    expect(tennisOption).toHaveAttribute("aria-checked", "true");
    expect(padelOption).toHaveAttribute("aria-checked", "false");

    // Enter club name
    const nameInput = screen.getByPlaceholderText("Club Name");
    await user.type(nameInput, "Ace Tennis Club");

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Create Club/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(clubService.createClub).toHaveBeenCalledTimes(1);
      expect(clubService.createClub).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Ace Tennis Club",
          sport_type: "tennis",
        }),
      );
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith("Club created successfully");
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("T18-AC1 / error: displays field error under sport selector if API returns sport_type error", async () => {
    const user = userEvent.setup();
    vi.mocked(clubService.createClub).mockRejectedValue({
      message: "Validation failed",
      error: {
        sport_type: "Invalid sport type provided",
      },
    });

    render(<ClubFormClient />);

    const nameInput = screen.getByPlaceholderText("Club Name");
    await user.type(nameInput, "New Club");

    const submitBtn = screen.getByRole("button", { name: /Create Club/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid sport type provided"),
      ).toBeInTheDocument();
    });
  });
});
