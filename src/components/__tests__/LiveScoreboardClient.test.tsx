import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LiveScoreboardClient from "@/components/LiveScoreboardClient";
import type { LiveScoreboardData } from "@/types/scoreboard";

// Mock router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock useLiveScoreboard hook
vi.mock("@/hooks/useLiveScoreboard", () => ({
  useLiveScoreboard: vi.fn(),
}));

describe("LiveScoreboardClient (T21-AC5 singles rendering)", () => {
  it("renders 1 player avatar and name per side for singles match", async () => {
    const { useLiveScoreboard } = await import("@/hooks/useLiveScoreboard");

    const mockData: LiveScoreboardData = {
      event: {
        guid: "evt-1",
        name: "Tennis Singles Tournament",
        date_time: "2026-10-14T10:00:00Z",
      },
      standings: [],
      live_round: {
        guid: "round-1",
        round_number: 1,
        status: "in_progress",
        byes: [],
        matches: [
          {
            guid: "m-1",
            court_number: 1,
            team_a_score: 4,
            team_b_score: 2,
            team_a: {
              player1: {
                guid: "u-1",
                name: "Carlos Alcaraz",
              },
            },
            team_b: {
              player1: {
                guid: "u-2",
                name: "Jannik Sinner",
              },
            },
          },
        ],
      },
      next_round: null,
      historical_rounds: [],
    };

    (useLiveScoreboard as any).mockReturnValue({
      data: mockData,
      status: "live",
      error: null,
      reconnect: vi.fn(),
    });

    render(<LiveScoreboardClient eventGuid="evt-1" />);

    expect(screen.getByText("Carlos Alcaraz")).toBeInTheDocument();
    expect(screen.getByText("Jannik Sinner")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
