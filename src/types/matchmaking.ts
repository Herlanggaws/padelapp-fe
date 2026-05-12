/** Values sent to POST /padel/matchmaking/session */
export type MatchmakingSessionFormatApi =
  | "mexicano"
  | "americano"
  | "team_americano";

export type MatchmakingTeamAssignmentApi = "random" | "organizer_set";

export interface CreateMatchmakingSessionPayload {
  event_guid: string;
  format: MatchmakingSessionFormatApi;
  number_of_courts: number;
  team_assignment: MatchmakingTeamAssignmentApi;
  total_set_points: number;
  teams: unknown[];
}

export interface MatchmakingSessionCreatedBy {
  guid: string;
  name: string;
  email: string;
}

export interface MatchmakingSessionEventSummary {
  guid: string;
  name: string;
  description: string;
  date_time: string;
  number_of_players: number;
}

export interface MatchmakingSession {
  guid: string;
  event: MatchmakingSessionEventSummary;
  format: MatchmakingSessionFormatApi;
  number_of_courts: number;
  team_assignment: MatchmakingTeamAssignmentApi;
  total_set_points: number;
  created_by: MatchmakingSessionCreatedBy;
}

export interface CreateMatchmakingSessionSuccessResponse {
  data: MatchmakingSession;
  message: string;
}

export interface CreateMatchmakingSessionErrorResponse {
  message: string;
}
