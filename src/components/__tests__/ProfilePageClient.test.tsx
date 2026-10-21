import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProfilePageClient from "@/components/ProfilePageClient";
import * as authService from "@/services/authService";
import * as cache from "@/lib/userProfileCache";
import type { UserProfile } from "@/types/auth";

vi.mock("@/services/authService", () => ({
  fetchUserProfile: vi.fn(),
}));

vi.mock("@/services/clubService", () => ({
  fetchJoinedClubs: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/profile",
}));

describe("ProfilePageClient (T20)", () => {
  it("T20-AC1: displays rating cards for preferred sports and any sport with events played", async () => {
    const mockProfile: UserProfile = {
      guid: "u1",
      name: "Tennis & Padel Player",
      email: "player@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 6.2,
      events_played: 12,
      preferred_sports: "both",
      rank_points_by_sport: {
        padel: { rank_points: 6.2, events_played: 10 },
        tennis: { rank_points: 4.5, events_played: 2 },
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

    render(<ProfilePageClient />);

    await waitFor(() => {
      expect(screen.getByText(/Padel 6.2/i)).toBeInTheDocument();
      expect(screen.getByText(/Tennis 4.5/i)).toBeInTheDocument();
    });
  });

  it("T20-AC6: falls back to legacy rank_points labelled Padel if rank_points_by_sport is missing", async () => {
    const legacyProfile: UserProfile = {
      guid: "u2",
      name: "Legacy User",
      email: "legacy@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 5.1,
      events_played: 8,
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: legacyProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(legacyProfile);

    render(<ProfilePageClient />);

    await waitFor(() => {
      expect(screen.getByText(/Padel 5.1/i)).toBeInTheDocument();
    });
  });
});
