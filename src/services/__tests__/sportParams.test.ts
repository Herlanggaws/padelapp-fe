import { describe, it, expect, vi, beforeEach } from "vitest";
import apiClient from "@/lib/apiClient";
import {
  fetchEvents,
  fetchUpcomingEvents,
  fetchPlayedEvents,
  fetchClubEvents,
} from "../eventService";
import { fetchClubs, fetchClubMembers } from "../clubService";
import { updatePreferredSports } from "../authService";

vi.mock("@/lib/apiClient", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("services sport query params and payloads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchEvents includes sport when not all", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [] } });
    await fetchEvents({ sport: "tennis" });
    expect(apiClient.get).toHaveBeenCalledWith("/padel/event", {
      params: { page: 1, limit: 10, sport: "tennis" },
    });

    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [] } });
    await fetchEvents({ sport: "all" as unknown as "padel" });
    expect(apiClient.get).toHaveBeenCalledWith("/padel/event", {
      params: { page: 1, limit: 10 },
    });
  });

  it("fetchUpcomingEvents includes sport", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [] } });
    await fetchUpcomingEvents({ sport: "padel" });
    expect(apiClient.get).toHaveBeenCalledWith("/padel/event/upcoming", {
      params: { page: 1, limit: 10, sport: "padel" },
    });
  });

  it("fetchPlayedEvents includes sport", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [] } });
    await fetchPlayedEvents({ sport: "tennis" });
    expect(apiClient.get).toHaveBeenCalledWith("/padel/event/played", {
      params: { page: 1, limit: 10, sport: "tennis" },
    });
  });

  it("fetchClubEvents includes sport", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [] } });
    await fetchClubEvents({ club_guid: "c-1", sport: "tennis" });
    expect(apiClient.get).toHaveBeenCalledWith("/padel/event", {
      params: {
        club_guid: "c-1",
        sort: "created_at",
        direction: "ASC",
        page: 1,
        limit: 10,
        sport: "tennis",
      },
    });
  });

  it("fetchClubs includes sport", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [] } });
    await fetchClubs({ sport: "both" });
    expect(apiClient.get).toHaveBeenCalledWith("/padel/club", {
      params: { sport: "both" },
    });
  });

  it("fetchClubMembers includes sport", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { data: [] } });
    await fetchClubMembers({ club_guid: "c-1", sport: "tennis" });
    expect(apiClient.get).toHaveBeenCalledWith("/padel/club-member", {
      params: { club_guid: "c-1", sport: "tennis" },
    });
  });

  it("updatePreferredSports sends PUT with preferred_sports", async () => {
    vi.mocked(apiClient.put).mockResolvedValueOnce({ data: { data: {} } });
    await updatePreferredSports({ preferred_sports: "both" });
    expect(apiClient.put).toHaveBeenCalledWith("/auth/profile", {
      preferred_sports: "both",
    });
  });
});
