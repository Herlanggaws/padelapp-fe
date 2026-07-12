export interface LiveScoreboardPlayer {
  guid: string;
  name: string;
  profile_photo?: string;
}

export interface LiveScoreboardEvent {
  guid: string;
  name: string;
  date_time: string;
}

export interface LiveScoreboardStandingRow {
  rank: number;
  player: LiveScoreboardPlayer;
  wins: number;
  draws: number;
  losses: number;
  matches_played: number;
  score_diff: number;
  total_points: number;
}

export interface LiveScoreboardTeam {
  players: LiveScoreboardPlayer[];
}

export interface LiveScoreboardMatch {
  guid: string;
  court_number: number;
  team_a: LiveScoreboardTeam;
  team_b: LiveScoreboardTeam;
  team_a_score: number | null;
  team_b_score: number | null;
}

export type LiveScoreboardRoundStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | string;

export interface LiveScoreboardBye {
  player: LiveScoreboardPlayer;
}

export interface LiveScoreboardRound {
  guid: string;
  round_number: number;
  status: LiveScoreboardRoundStatus;
  matches: LiveScoreboardMatch[];
  byes: LiveScoreboardBye[];
}

export interface LiveScoreboardData {
  event: LiveScoreboardEvent;
  standings: LiveScoreboardStandingRow[];
  live_round: LiveScoreboardRound | null;
  next_round: LiveScoreboardRound | null;
  historical_rounds: LiveScoreboardRound[];
}

export type LiveScoreboardConnectionStatus =
  | "connecting"
  | "live"
  | "reconnecting"
  | "error";
