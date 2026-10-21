import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MatchDetailClient from "@/components/MatchDetailClient";
import type { MatchmakingSessionDetail } from "@/types/matchmaking";

// Mock router and params
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  useParams: () => ({ id: "sess-1" }),
  useSearchParams: () => new URLSearchParams({ event_guid: "evt-1" }),
}));

vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: vi.fn(),
  }),
}));

vi.mock("@/lib/userProfileCache", () => ({
  getUserProfileCache: () => ({ guid: "user-organizer" }),
}));

describe("MatchDetailClient (T21-AC5 singles rendering)", () => {
  it("renders 1 player avatar and name per side for singles without empty placeholder slots", async () => {
    const singlesDetail: MatchmakingSessionDetail = {
      guid: "sess-1",
      event: {
        guid: "evt-1",
        name: "Tennis Singles Open",
        description: "",
        date_time: "2026-10-14T10:00:00Z",
        number_of_players: 2,
      },
      format: "americano",
      number_of_courts: 1,
      team_assignment: "random",
      total_set_points: 21,
      race_to_points: null,
      pairing_variant: "smart",
      match_type: "singles",
      created_by: { guid: "user-organizer", name: "Host", email: "host@example.com" },
      rounds: [
        {
          guid: "round-1",
          round_number: 1,
          status: "completed",
          byes: [],
          matches: [
            {
              guid: "match-1",
              court_number: 1,
              team_a_score: 11,
              team_b_score: 10,
              team_a: [
                {
                  guid: "part-1",
                  name: "Roger",
                  email: "roger@tennis.test",
                },
              ],
              team_b: [
                {
                  guid: "part-2",
                  name: "Rafa",
                  email: "rafa@tennis.test",
                },
              ],
            },
          ],
        },
      ],
    };

    vi.spyOn(await import("@/services/matchmakingService"), "fetchMatchmakingSession").mockResolvedValue({
      data: singlesDetail,
      message: "success",
    });

    vi.spyOn(await import("@/services/eventService"), "fetchEventDetail").mockResolvedValue({
      data: {
        guid: "evt-1",
        club_guid: "c-1",
        name: "Tennis Singles Open",
        description: "",
        date_time: "2026-10-14T10:00:00Z",
        sport: "tennis",
        is_owner: true,
      } as any,
      message: "success",
    });

    render(<MatchDetailClient sessionGuid="sess-1" eventGuid="evt-1" />);

    expect(await screen.findByText("Roger")).toBeInTheDocument();
    expect(await screen.findByText("Rafa")).toBeInTheDocument();

    // Verify there are no "TBD" placeholder avatars/names rendered
    expect(screen.queryByText("TBD")).not.toBeInTheDocument();
  });
});
