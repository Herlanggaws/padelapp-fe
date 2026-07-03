export interface MatchConfigSelectedPlayer {
  participant_guid: string;
  user_guid: string;
  name: string;
  email: string;
  profile_photo: string | null;
}

export interface MatchConfigPlayersPayload {
  event_guid: string;
  players: MatchConfigSelectedPlayer[];
}

/** Values sent to POST /padel/matchmaking/session */
export type MatchmakingSessionFormatApi =
  | "mexicano"
  | "americano"
  | "team_americano";

export type MatchmakingTeamAssignmentApi = "random" | "organizer_set";

export interface CreateMatchmakingSessionTeam {
  player1_guid: string;
  player2_guid: string;
}

export interface CreateMatchmakingSessionPayload {
  event_guid: string;
  format: MatchmakingSessionFormatApi;
  number_of_courts: number;
  team_assignment: MatchmakingTeamAssignmentApi;
  total_set_points: number;
  teams: CreateMatchmakingSessionTeam[];
  participant_guids: string[];
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
  event_guid?: string;
  event: MatchmakingSessionEventSummary;
  format: MatchmakingSessionFormatApi;
  number_of_courts: number;
  team_assignment: MatchmakingTeamAssignmentApi;
  total_set_points: number;
  created_by: MatchmakingSessionCreatedBy;
}

export interface MatchmakingSessionPlayerUser {
  guid?: string;
  name?: string;
  email?: string;
}

/** Player on a match side (americano / random sessions) */
export interface MatchmakingMatchParticipant {
  guid: string;
  name: string;
  email: string;
  profile_photo?: string;
}

export interface MatchmakingSessionPlayer {
  guid?: string;
  name?: string;
  email?: string;
  profile_photo?: string;
  user?: MatchmakingSessionPlayerUser | null;
}

/** `team_a` / `team_b` may be a player list or a paired team object */
export type MatchmakingSessionMatchSide =
  | MatchmakingMatchParticipant[]
  | MatchmakingSessionTeam
  | null;

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
  bracket?: string;
  /** Organizer-set / mexicano: nested team with player1 & player2 */
  team_a_info?: MatchmakingSessionTeam | null;
  team_b_info?: MatchmakingSessionTeam | null;
  /** Present when match only references teams by id */
  team_a_guid?: string | null;
  team_b_guid?: string | null;
  /** Player list (americano) or team object (organizer-set) */
  team_a?: MatchmakingSessionMatchSide;
  team_b?: MatchmakingSessionMatchSide;
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

export interface SubmitMatchmakingMatchScorePayload {
  team_a_score: number | null;
  team_b_score: number | null;
}

export interface SubmitMatchmakingMatchScoreSuccessResponse {
  data: null;
  message: string;
}

export interface SubmitMatchmakingMatchScoreErrorResponse {
  message: string;
}

export interface EditMatchmakingMatchScorePayload {
  team_a_score: number;
  team_b_score: number;
}

export interface EditMatchmakingMatchScoreSuccessResponse {
  data: null;
  message: string;
}

export interface EditMatchmakingMatchScoreErrorResponse {
  message: string;
}

export interface StartMatchmakingRoundSuccessResponse {
  data: null;
  message: string;
}

export interface StartMatchmakingRoundErrorResponse {
  message: string;
}

export interface CancelMatchmakingRoundSuccessResponse {
  data: null;
  message: string;
}

export interface CancelMatchmakingRoundErrorResponse {
  message: string;
}

export interface GenerateMatchmakingRoundPayload {
  participant_guids: string[];
}

export interface GenerateMatchmakingRoundSuccessResponse {
  data: null;
  message: string;
}

export interface GenerateMatchmakingRoundErrorResponse {
  message: string;
}
