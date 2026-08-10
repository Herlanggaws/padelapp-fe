import type {
  CreateMatchmakingSessionTeam,
  MatchOrganizerSetDraft,
} from "@/types/matchmaking";

const STORAGE_KEY = "match_organizer_set_draft";
const TEAMS_STORAGE_KEY = "match_organizer_set_teams";

export function setMatchOrganizerSetDraft(draft: MatchOrganizerSetDraft): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function getMatchOrganizerSetDraft(
  eventGuid: string,
): MatchOrganizerSetDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as MatchOrganizerSetDraft;
    if (draft.event_guid !== eventGuid) return null;
    return draft;
  } catch {
    return null;
  }
}

export function clearMatchOrganizerSetDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export interface MatchOrganizerSetTeamsPayload {
  event_guid: string;
  teams: CreateMatchmakingSessionTeam[];
}

export function setMatchOrganizerSetTeams(
  payload: MatchOrganizerSetTeamsPayload,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(payload));
}

export function getMatchOrganizerSetTeams(
  eventGuid: string,
): CreateMatchmakingSessionTeam[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TEAMS_STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as MatchOrganizerSetTeamsPayload;
    if (payload.event_guid !== eventGuid) return null;
    return payload.teams;
  } catch {
    return null;
  }
}

export function clearMatchOrganizerSetTeams(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TEAMS_STORAGE_KEY);
}
