import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardClient from "@/components/DashboardClient";
import * as authService from "@/services/authService";
import * as clubService from "@/services/clubService";
import * as eventService from "@/services/eventService";
import * as cache from "@/lib/userProfileCache";
import type { UserProfile } from "@/types/auth";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/dashboard",
}));

vi.mock("@/services/clubService", () => ({
  fetchJoinedClubs: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("@/services/eventService", () => ({
  fetchUpcomingEvents: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("@/services/authService", () => ({
  fetchUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
}));

describe("DashboardClient Rank Points", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 1 column with 2 compacted rows (Padel RP and Tennis RP) when preferred_sports is both", async () => {
    const mockProfile: UserProfile = {
      guid: "u1",
      name: "Dual Sport Athlete",
      email: "dual@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 6.5,
      events_played: 15,
      preferred_sports: "both",
      rank_points_by_sport: {
        padel: { rank_points: 6.5, events_played: 10 },
        tennis: { rank_points: 4.8, events_played: 5 },
      },
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: mockProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(mockProfile);

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getByText("Padel RP")).toBeInTheDocument();
      expect(screen.getByText("Tennis RP")).toBeInTheDocument();
      expect(screen.getByText("6.5")).toBeInTheDocument();
      expect(screen.getByText("4.8")).toBeInTheDocument();
    });

    // Verify it is rendered in 1 column (flex-col)
    const padelLabel = screen.getByText("Padel RP");
    const container = padelLabel.closest(".flex-col.gap-2\\.5");
    expect(container).toBeInTheDocument();
  });

  it("renders single card for tennis player", async () => {
    const mockProfile: UserProfile = {
      guid: "u2",
      name: "Tennis Player",
      email: "tennis@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 5.2,
      events_played: 8,
      preferred_sports: "tennis",
      rank_points_by_sport: {
        padel: { rank_points: 1.0, events_played: 0 },
        tennis: { rank_points: 5.2, events_played: 8 },
      },
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: mockProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(mockProfile);

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getByText("Tennis Rank point")).toBeInTheDocument();
      expect(screen.getByText("5.2")).toBeInTheDocument();
      expect(screen.queryByText("Padel RP")).not.toBeInTheDocument();
    });
  });

  it("renders single card with Rank point for padel/default player", async () => {
    const mockProfile: UserProfile = {
      guid: "u3",
      name: "Padel Player",
      email: "padel@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 7.1,
      events_played: 12,
      preferred_sports: "padel",
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: mockProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(mockProfile);

    render(<DashboardClient />);

    await waitFor(() => {
      expect(screen.getByText("Rank point")).toBeInTheDocument();
      expect(screen.getByText("7.1")).toBeInTheDocument();
      expect(screen.queryByText("Tennis RP")).not.toBeInTheDocument();
    });
  });
});
