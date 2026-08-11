export interface LiveScoreboardPlayer {
  guid: string;
  name: string;
  email?: string;
  profile_photo?: string;
}

export interface LiveScoreboardEvent {
  guid: string;
  name: string;
  date_time: string;
}

export interface LiveScoreboardStandingRow {
  rank: number;
  /** Present for individual standings */
  player?: LiveScoreboardPlayer;
  /** Present for fixed-partner / organizer-set standings */
  team_name?: string;
  player1?: LiveScoreboardPlayer;
  player2?: LiveScoreboardPlayer;
  wins: number;
  draws: number;
  losses: number;
  matches_played: number;
  score_diff: number;
  total_points?: number;
}

export interface LiveScoreboardTeam {
  team_name?: string | null;
  players?: LiveScoreboardPlayer[];
  player1?: LiveScoreboardPlayer | null;
  player2?: LiveScoreboardPlayer | null;
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
  player?: LiveScoreboardPlayer;
  team_name?: string;
  player1?: LiveScoreboardPlayer;
  player2?: LiveScoreboardPlayer;
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

export function getLiveTeamPlayers(
  team: LiveScoreboardTeam | null | undefined,
): LiveScoreboardPlayer[] {
  if (!team) return [];
  if (Array.isArray(team.players) && team.players.length > 0) {
    return team.players;
  }
  return [team.player1, team.player2].filter(
    (player): player is LiveScoreboardPlayer => Boolean(player),
  );
}

export function getLiveTeamName(
  team: LiveScoreboardTeam | null | undefined,
): string | null {
  const name = team?.team_name?.trim();
  return name || null;
}

export function getLiveTeamDisplayLabel(
  team: LiveScoreboardTeam | null | undefined,
): string {
  const teamName = getLiveTeamName(team);
  if (teamName) return teamName;
  const names = getLiveTeamPlayers(team)
    .map((player) => player.name?.trim())
    .filter(Boolean);
  return names.join(" & ") || "—";
}

export function getLiveStandingDisplayName(
  row: LiveScoreboardStandingRow,
): string {
  const teamName = row.team_name?.trim();
  if (teamName) return teamName;
  if (row.player?.name?.trim()) return row.player.name.trim();
  const player1Name = row.player1?.name?.trim();
  const player2Name = row.player2?.name?.trim();
  if (player1Name && player2Name) return `${player1Name} & ${player2Name}`;
  return player1Name || player2Name || "—";
}

export function getLiveStandingSubtitle(
  row: LiveScoreboardStandingRow,
): string | null {
  if (!row.team_name?.trim()) return null;
  const player1Name = row.player1?.name?.trim();
  const player2Name = row.player2?.name?.trim();
  if (player1Name && player2Name) return `${player1Name} & ${player2Name}`;
  return player1Name || player2Name || null;
}

export function isLiveTeamStanding(row: LiveScoreboardStandingRow): boolean {
  return Boolean(row.team_name?.trim() || (row.player1 && row.player2));
}
