import type { MatchConfigPlayersPayload, MatchConfigSelectedPlayer } from "@/types/matchmaking";

const STORAGE_KEY = "match_config_selected_players";

export function setMatchConfigPlayers(payload: MatchConfigPlayersPayload): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getMatchConfigPlayers(
  eventGuid: string,
): MatchConfigSelectedPlayer[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as MatchConfigPlayersPayload;
    if (payload.event_guid !== eventGuid) return null;
    return payload.players;
  } catch {
    return null;
  }
}

export function clearMatchConfigPlayers(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
