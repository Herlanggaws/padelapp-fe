import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MatchHistoryClient from "@/components/MatchHistoryClient";
import * as eventService from "@/services/eventService";
import * as userProfileCache from "@/lib/userProfileCache";
import type { PlayedEvent } from "@/types/event";
import type { UserProfile } from "@/types/auth";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("@/services/eventService", () => ({
  fetchPlayedEvents: vi.fn(),
}));

const mockPlayedEvents: PlayedEvent[] = [
  {
    event: {
      guid: "pe-1",
      club_guid: "club-1",
      club_name: "Padel Club Central",
      name: "Padel Masters",
      date_time: "2026-10-01T10:00:00Z",
      sport: "padel",
      format: "king_of_the_court",
      is_finished: true,
    },
    rank_points: {
      rank: 1,
      base_points: 20,
      session_tier: "gold",
      multiplier: 1.25,
      final_points: 25,
    },
    rounds: [],
  },
  {
    event: {
      guid: "pe-2",
      club_guid: "club-2",
      club_name: "Tennis Club West",
      name: "Tennis Open Championship",
      date_time: "2026-10-05T10:00:00Z",
      sport: "tennis",
      format: "americano",
      is_finished: true,
    },
    rank_points: {
      rank: 2,
      base_points: 12,
      session_tier: "silver",
      multiplier: 1.25,
      final_points: 15,
    },
    rounds: [],
  },
];

describe("MatchHistoryClient", () => {
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

    vi.mocked(eventService.fetchPlayedEvents).mockResolvedValue({
      data: mockPlayedEvents,
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 10,
        total_page: 1,
        total_data: 2,
      },
    });

    render(<MatchHistoryClient />);

    const allChip = screen.getByRole("button", { name: "All" });
    const padelChip = screen.getByRole("button", { name: "Padel" });
    const tennisChip = screen.getByRole("button", { name: "Tennis" });

    expect(allChip).toBeInTheDocument();
    expect(padelChip).toBeInTheDocument();
    expect(tennisChip).toBeInTheDocument();

    // Default to Tennis because user preferred_sports is tennis
    expect(tennisChip).toHaveAttribute("aria-pressed", "true");
    expect(allChip).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(eventService.fetchPlayedEvents).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sport: "tennis",
      });
    });

    // Switch to All
    await user.click(allChip);
    expect(allChip).toHaveAttribute("aria-pressed", "true");
    expect(tennisChip).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(eventService.fetchPlayedEvents).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sport: undefined,
      });
    });

    // Switch to Padel
    await user.click(padelChip);
    expect(padelChip).toHaveAttribute("aria-pressed", "true");
    expect(allChip).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(eventService.fetchPlayedEvents).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sport: "padel",
      });
    });

    // Switch to All
    await user.click(allChip);
    expect(allChip).toHaveAttribute("aria-pressed", "true");
    expect(padelChip).toHaveAttribute("aria-pressed", "false");

    await waitFor(() => {
      expect(eventService.fetchPlayedEvents).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sport: undefined,
      });
    });
  });

  it("T19-AC4: played event cards display SportBadge", async () => {
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue(null);

    vi.mocked(eventService.fetchPlayedEvents).mockResolvedValue({
      data: mockPlayedEvents,
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 10,
        total_page: 1,
        total_data: 2,
      },
    });

    render(<MatchHistoryClient />);

    await waitFor(() => {
      expect(screen.getByText("Padel Masters")).toBeInTheDocument();
    });

    const padelBadges = screen.getAllByText("Padel");
    expect(padelBadges.length).toBeGreaterThan(0);

    const tennisBadges = screen.getAllByText("Tennis");
    expect(tennisBadges.length).toBeGreaterThan(0);
  });

  it("T19-AC5: renders sport-specific empty state when filter has no results", async () => {
    const user = userEvent.setup();
    vi.spyOn(userProfileCache, "getUserProfileCache").mockReturnValue(null);

    vi.mocked(eventService.fetchPlayedEvents).mockResolvedValue({
      data: [],
      message: "Success",
      paginate: {
        current_page: 1,
        per_page: 10,
        total_page: 1,
        total_data: 0,
      },
    });

    render(<MatchHistoryClient />);

    // Default 'all' empty state
    await waitFor(() => {
      expect(screen.getByText("No matches played yet")).toBeInTheDocument();
    });

    // Switch to Tennis -> "No tennis events yet"
    const tennisChip = screen.getByRole("button", { name: "Tennis" });
    await user.click(tennisChip);

    await waitFor(() => {
      expect(screen.getByText("No tennis events yet")).toBeInTheDocument();
    });

    // Switch to Padel -> "No padel events yet"
    const padelChip = screen.getByRole("button", { name: "Padel" });
    await user.click(padelChip);

    await waitFor(() => {
      expect(screen.getByText("No padel events yet")).toBeInTheDocument();
    });
  });
});
