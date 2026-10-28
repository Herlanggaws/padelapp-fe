import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExploreClubsClient from "@/components/ExploreClubsClient";
import * as clubService from "@/services/clubService";
import * as userProfileCache from "@/lib/userProfileCache";
import type { Club } from "@/types/club";
import type { UserProfile } from "@/types/auth";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/clubs",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/services/clubService", () => ({
  fetchClubs: vi.fn(),
}));

const mockClubs: Club[] = [
  {
    guid: "club-1",
    name: "Padel Club",
    description: "Padel only",
    sport_type: "padel",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    created_by: "user-1",
    updated_at: "2026-01-01T00:00:00Z",
    updated_by: null,
  },
  {
    guid: "club-2",
    name: "Tennis Club",
    description: "Tennis only",
    sport_type: "tennis",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    created_by: "user-1",
    updated_at: "2026-01-01T00:00:00Z",
    updated_by: null,
  },
  {
    guid: "club-3",
    name: "Multi Club",
    description: "Both sports",
    sport_type: "both",
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    created_by: "user-1",
    updated_at: "2026-01-01T00:00:00Z",
    updated_by: null,
  },
];

describe("ExploreClubsClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(clubService.fetchClubs).mockResolvedValue({
      data: mockClubs,
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 10,
        total_page: 1,
        total_data: 3,
      },
    });
  });

  it("shows chips All · Padel · Tennis, defaults to All, and multi-selecting Padel and Tennis filters by both", async () => {
    const user = userEvent.setup();
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue({
      guid: "u-1",
      name: "Player",
      email: "player@example.com",
      preferred_sports: "tennis",
      rank_points: 0,
      events_played: 0,
    } as unknown as UserProfile);

    render(<ExploreClubsClient />);

    // Should show 3 chips: All, Padel, Tennis
    const allChip = screen.getByRole("button", { name: "All" });
    const padelChip = screen.getByRole("button", { name: "Padel" });
    const tennisChip = screen.getByRole("button", { name: "Tennis" });

    expect(allChip).toBeInTheDocument();
    expect(padelChip).toBeInTheDocument();
    expect(tennisChip).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Both" })).not.toBeInTheDocument();

    // Default should be Tennis because preferred_sports is tennis
    expect(tennisChip).toHaveAttribute("aria-pressed", "true");
    expect(allChip).toHaveAttribute("aria-pressed", "false");
    expect(padelChip).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(clubService.fetchClubs).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: "tennis",
          page: 1,
        }),
      );
    });

    // Click Padel while Tennis is active -> should select both Padel and Tennis (sport="both")
    await user.click(padelChip);
    expect(padelChip).toHaveAttribute("aria-pressed", "true");
    expect(tennisChip).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(clubService.fetchClubs).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: "both",
          page: 1,
        }),
      );
    });

    // Clicking Tennis while both are active deselects Tennis, keeping Padel active
    await user.click(tennisChip);
    expect(padelChip).toHaveAttribute("aria-pressed", "true");
    expect(tennisChip).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(clubService.fetchClubs).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: "padel",
          page: 1,
        }),
      );
    });

    // Change to All
    await user.click(allChip);
    expect(allChip).toHaveAttribute("aria-pressed", "true");
    expect(padelChip).toHaveAttribute("aria-pressed", "false");
    expect(tennisChip).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(clubService.fetchClubs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          sport: undefined,
        }),
      );
    });
  });

  it("defaults to All when preferred sport is both or null", async () => {
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue({
      guid: "u-2",
      name: "Player 2",
      email: "player2@example.com",
      preferred_sports: "both",
      rank_points: 0,
      events_played: 0,
    } as unknown as UserProfile);

    render(<ExploreClubsClient />);

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Tennis" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Padel" })).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(clubService.fetchClubs).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: undefined,
          page: 1,
        }),
      );
    });
  });

  it("T18-AC5: club cards display SportBadge", async () => {
    render(<ExploreClubsClient />);

    await waitFor(() => {
      expect(screen.getByText("Padel Club")).toBeInTheDocument();
      expect(screen.getByText("Tennis Club")).toBeInTheDocument();
      expect(screen.getByText("Multi Club")).toBeInTheDocument();
    });

    // Sport badges for the clubs
    const tennisElements = screen.getAllByText("Tennis");
    expect(tennisElements.length).toBeGreaterThan(1); // One in filter chips, one in Tennis Club card badge
    expect(screen.getByText("Padel · Tennis")).toBeInTheDocument();
  });
});
