import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditClubFormClient from "@/components/EditClubFormClient";
import * as clubService from "@/services/clubService";
import type { Club } from "@/types/club";

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
  updateClub: vi.fn(),
}));

const baseClub: Club = {
  guid: "club-123",
  name: "Original Club",
  description: "Description",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  created_by: "user-1",
  updated_at: "2026-01-01T00:00:00Z",
  updated_by: null,
};

describe("EditClubFormClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("T18-AC2: for a padel club enables only padel and both; tennis is disabled and hint is displayed", async () => {
    const user = userEvent.setup();
    const club: Club = { ...baseClub, sport_type: "padel" };

    vi.mocked(clubService.updateClub).mockResolvedValue({
      data: null,
      message: "Club updated successfully",
    });

    render(<EditClubFormClient club={club} />);

    const padelOption = screen.getByRole("radio", { name: "Padel" });
    const tennisOption = screen.getByRole("radio", { name: "Tennis" });
    const bothOption = screen.getByRole("radio", { name: "Both" });

    expect(padelOption).not.toBeDisabled();
    expect(bothOption).not.toBeDisabled();
    expect(tennisOption).toBeDisabled();

    expect(
      screen.getByText("Sports can be added but not removed"),
    ).toBeInTheDocument();

    // Select Both and submit
    await user.click(bothOption);
    expect(bothOption).toHaveAttribute("aria-checked", "true");

    const submitBtn = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(clubService.updateClub).toHaveBeenCalledWith(
        "club-123",
        expect.objectContaining({
          name: "Original Club",
          sport_type: "both",
        }),
      );
    });
  });

  it("T18-AC2: for a both club, every other option is disabled", () => {
    const club: Club = { ...baseClub, sport_type: "both" };

    render(<EditClubFormClient club={club} />);

    const padelOption = screen.getByRole("radio", { name: "Padel" });
    const tennisOption = screen.getByRole("radio", { name: "Tennis" });
    const bothOption = screen.getByRole("radio", { name: "Both" });

    expect(padelOption).toBeDisabled();
    expect(tennisOption).toBeDisabled();
    expect(bothOption).not.toBeDisabled();
    expect(bothOption).toHaveAttribute("aria-checked", "true");
  });

  it("T18-AC3: displays sport_type field error under selector if API returns it", async () => {
    const user = userEvent.setup();
    const club: Club = { ...baseClub, sport_type: "padel" };

    vi.mocked(clubService.updateClub).mockRejectedValue({
      message: "Validation failed",
      error: {
        sport_type: "a club cannot remove a sport it already offers",
      },
    });

    render(<EditClubFormClient club={club} />);

    const submitBtn = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("a club cannot remove a sport it already offers"),
      ).toBeInTheDocument();
    });
  });
});
