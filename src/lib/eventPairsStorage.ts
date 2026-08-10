import type { CreateMatchmakingSessionTeam } from "@/types/matchmaking";

export interface EventPairPlayer {
  participant_guid: string;
  user_guid: string;
  name: string;
  profile_photo: string | null;
}

export interface EventPair {
  id: string;
  team_name: string;
  player1: EventPairPlayer;
  player2: EventPairPlayer;
}

export interface EventPairsPayload {
  event_guid: string;
  pairs: EventPair[];
}

const STORAGE_KEY = "event_pairs";

export function setEventPairs(payload: EventPairsPayload): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getEventPairs(eventGuid: string): EventPair[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as EventPairsPayload;
    if (payload.event_guid !== eventGuid) return null;
    return payload.pairs;
  } catch {
    return null;
  }
}

export function clearEventPairs(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function eventPairsToTeams(
  pairs: EventPair[],
): CreateMatchmakingSessionTeam[] {
  return pairs.map((pair) => ({
    player1_guid: pair.player1.participant_guid,
    player2_guid: pair.player2.participant_guid,
  }));
}
