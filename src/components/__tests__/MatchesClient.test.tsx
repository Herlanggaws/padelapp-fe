import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MatchesClient from "@/components/MatchesClient";
import * as eventService from "@/services/eventService";
import * as userProfileCache from "@/lib/userProfileCache";
import type { UpcomingEvent } from "@/types/event";
import type { UserProfile } from "@/types/auth";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/matches",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/services/eventService", () => ({
  fetchEvents: vi.fn(),
}));

const mockUpcomingEvents: UpcomingEvent[] = [
  {
    guid: "ev-1",
    club_guid: "club-1",
    name: "Padel Match Open",
    description: "Fun match",
    date_time: "2026-11-01T10:00:00Z",
    number_of_players: 4,
    number_of_participants: 2,
    min_level: 2,
    max_level: 4,
    sport: "padel",
    is_active: true,
    is_joined: false,
    is_host: false,
    is_locked: false,
    join_status: "",
    created_at: "2026-01-01T00:00:00Z",
    created_by: "u-1",
  },
  {
    guid: "ev-2",
    club_guid: "club-2",
    name: "Tennis Derby",
    description: "Tennis tournament",
    date_time: "2026-11-02T10:00:00Z",
    number_of_players: 4,
    number_of_participants: 3,
    min_level: 3,
    max_level: 5,
    sport: "tennis",
    is_active: true,
    is_joined: false,
    is_host: false,
    is_locked: false,
    join_status: "",
    created_at: "2026-01-01T00:00:00Z",
    created_by: "u-2",
  },
];

describe("MatchesClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("T19-AC3: shows chips All · Padel · Tennis, defaults to preferred sport, and changes query with sport", async () => {
    const user = userEvent.setup();
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue({
      guid: "u-1",
      name: "Player",
      email: "player@example.com",
      preferred_sports: "tennis",
      rank_points: 0,
      events_played: 0,
    } as unknown as UserProfile);

    vi.mocked(eventService.fetchEvents).mockResolvedValue({
      data: mockUpcomingEvents,
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 100,
        total_page: 1,
        total_data: 2,
      },
    });

    render(<MatchesClient />);

    const allChip = screen.getByRole("button", { name: "All" });
    const padelChip = screen.getByRole("button", { name: "Padel" });
    const tennisChip = screen.getByRole("button", { name: "Tennis" });

    expect(allChip).toBeInTheDocument();
    expect(padelChip).toBeInTheDocument();
    expect(tennisChip).toBeInTheDocument();

    // Default to Tennis because user preferred_sports is tennis
    expect(tennisChip).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(eventService.fetchEvents).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: "tennis",
        }),
      );
    });

    // Change to All
    await user.click(allChip);
    expect(allChip).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(eventService.fetchEvents).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: undefined,
        }),
      );
    });

    // Change to Padel
    await user.click(padelChip);
    expect(padelChip).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(eventService.fetchEvents).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: "padel",
        }),
      );
    });
  });

  it("T19-AC4: event cards display SportBadge", async () => {
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue(null);
    vi.mocked(eventService.fetchEvents).mockResolvedValue({
      data: mockUpcomingEvents,
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 100,
        total_page: 1,
        total_data: 2,
      },
    });

    render(<MatchesClient />);

    await waitFor(() => {
      expect(screen.getByText("Padel Match Open")).toBeInTheDocument();
      expect(screen.getByText("Tennis Derby")).toBeInTheDocument();
    });

    // Assert badges exist
    const padelElements = screen.getAllByText("Padel");
    expect(padelElements.length).toBeGreaterThan(1); // One in filter chips, one in card badge

    const tennisElements = screen.getAllByText("Tennis");
    expect(tennisElements.length).toBeGreaterThan(1); // One in filter chips, one in card badge
  });

  it("T19-AC5: empty state displays 'No tennis events yet' when filtered by tennis", async () => {
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue({
      guid: "u-1",
      name: "Player",
      email: "player@example.com",
      preferred_sports: "tennis",
      rank_points: 0,
      events_played: 0,
    } as unknown as UserProfile);

    vi.mocked(eventService.fetchEvents).mockResolvedValue({
      data: [],
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 100,
        total_page: 0,
        total_data: 0,
      },
    });

    render(<MatchesClient />);

    await waitFor(() => {
      expect(screen.getByText("No tennis events yet")).toBeInTheDocument();
    });
  });

  it("T19-AC5: empty state displays 'No padel events yet' when filtered by padel", async () => {
    const user = userEvent.setup();
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue(null);

    vi.mocked(eventService.fetchEvents).mockResolvedValue({
      data: [],
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 100,
        total_page: 0,
        total_data: 0,
      },
    });

    render(<MatchesClient />);

    const padelChip = screen.getByRole("button", { name: "Padel" });
    await user.click(padelChip);

    await waitFor(() => {
      expect(screen.getByText("No padel events yet")).toBeInTheDocument();
    });
  });
});
