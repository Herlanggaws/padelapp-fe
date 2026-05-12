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

export interface MatchmakingSessionPlayer {
  guid: string;
  name: string;
  email: string;
}

export interface MatchmakingSessionTeam {
  guid: string;
  player1?: MatchmakingSessionPlayer | null;
  player2?: MatchmakingSessionPlayer | null;
  total_points: number;
  games_played: number;
}

export type MatchmakingSessionRoundStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | string;

export interface MatchmakingSessionMatch {
  guid: string;
  court_number: number;
  bracket: string;
  team_a_info?: MatchmakingSessionTeam | null;
  team_b_info?: MatchmakingSessionTeam | null;
  team_a_score: number | null;
  team_b_score: number | null;
}

export interface MatchmakingSessionRound {
  guid: string;
  round_number: number;
  status: MatchmakingSessionRoundStatus;
  matches: MatchmakingSessionMatch[];
  byes: unknown[];
}

/** Full session from GET /padel/matchmaking/session/{session_guid} */
export interface MatchmakingSessionDetail extends MatchmakingSession {
  /** May be missing or non-array depending on API / session state */
  teams?: MatchmakingSessionTeam[] | null;
  rounds?: MatchmakingSessionRound[] | null;
}

export interface CreateMatchmakingSessionSuccessResponse {
  data: MatchmakingSession;
  message: string;
}

export interface CreateMatchmakingSessionErrorResponse {
  message: string;
}

export interface GetMatchmakingSessionSuccessResponse {
  data: MatchmakingSessionDetail;
  message: string;
}

export interface GetMatchmakingSessionErrorResponse {
  message: string;
}
