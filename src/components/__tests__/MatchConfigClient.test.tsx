import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MatchConfigClient from "@/components/MatchConfigClient";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams({ event_guid: "evt-tennis" }),
}));

vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: vi.fn(),
  }),
}));

vi.mock("@/lib/matchConfigPlayersStorage", () => ({
  getMatchConfigPlayers: () => [
    { participant_guid: "p1", user_guid: "u1", name: "Player 1", email: "p1@t.test", profile_photo: null },
    { participant_guid: "p2", user_guid: "u2", name: "Player 2", email: "p2@t.test", profile_photo: null },
    { participant_guid: "p3", user_guid: "u3", name: "Player 3", email: "p3@t.test", profile_photo: null },
  ],
  clearMatchConfigPlayers: vi.fn(),
}));

describe("MatchConfigClient (T21: Singles UI)", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.spyOn(await import("@/services/eventService"), "fetchEventParticipants").mockResolvedValue({
      data: [],
      paginate: { total_page: 1, current_page: 1, per_page: 50, total_data: 0 },
      message: "success",
    });
  });

  it("T21-AC1 & AC3: for a tennis event shows Doubles/Singles toggle and games score labels", async () => {
    vi.spyOn(await import("@/services/eventService"), "fetchEventDetail").mockResolvedValue({
      data: {
        guid: "evt-tennis",
        name: "Tennis Club Championship",
        sport: "tennis",
        number_of_courts: 1,
      } as any,
      message: "success",
    });

    vi.spyOn(await import("@/services/matchmakingService"), "fetchEventMatchmakingPairs").mockResolvedValue({
      data: { teams: [] } as any,
      message: "success",
    });

    render(<MatchConfigClient eventGuid="evt-tennis" />);

    expect(await screen.findByRole("button", { name: "Doubles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Singles" })).toBeInTheDocument();

    // Check games score labels
    expect(screen.getByText("Total games")).toBeInTheDocument();
    expect(screen.getByText("Race to X games")).toBeInTheDocument();
  });

  it("T21-AC1: for a padel event does NOT show Doubles/Singles toggle", async () => {
    vi.spyOn(await import("@/services/eventService"), "fetchEventDetail").mockResolvedValue({
      data: {
        guid: "evt-tennis",
        name: "Padel Open",
        sport: "padel",
        number_of_courts: 1,
      } as any,
      message: "success",
    });

    vi.spyOn(await import("@/services/matchmakingService"), "fetchEventMatchmakingPairs").mockResolvedValue({
      data: { teams: [] } as any,
      message: "success",
    });

    render(<MatchConfigClient eventGuid="evt-tennis" />);

    await screen.findByText("Game Format");
    expect(screen.queryByRole("button", { name: "Singles" })).not.toBeInTheDocument();
  });

  it("T21-AC2: switching to Singles sends match_type singles and team_assignment random", async () => {
    vi.spyOn(await import("@/services/eventService"), "fetchEventDetail").mockResolvedValue({
      data: {
        guid: "evt-tennis",
        name: "Tennis Club Championship",
        sport: "tennis",
        number_of_courts: 1,
      } as any,
      message: "success",
    });

    vi.spyOn(await import("@/services/matchmakingService"), "fetchEventMatchmakingPairs").mockResolvedValue({
      data: { teams: [] } as any,
      message: "success",
    });

    const createMock = vi.fn().mockResolvedValue({
      data: { guid: "sess-created" },
      message: "success",
    });
    vi.spyOn(await import("@/services/matchmakingService"), "createMatchmakingSession").mockImplementation(createMock);

    render(<MatchConfigClient eventGuid="evt-tennis" />);

    const singlesBtn = await screen.findByRole("button", { name: "Singles" });
    fireEvent.click(singlesBtn);

    const generateBtn = screen.getByRole("button", { name: "Generate Match" });
    fireEvent.click(generateBtn);

    // Confirm modal
    const confirmBtn = await screen.findByRole("button", { name: "Generate" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({
          match_type: "singles",
          team_assignment: "random",
        }),
      );
    });
  });
});
