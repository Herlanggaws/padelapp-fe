"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import ScoreKeyboardSheet from "@/components/ScoreKeyboardSheet";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  cancelMatchmakingRound,
  fetchMatchmakingSession,
  startMatchmakingRound,
  submitMatchmakingMatchScore,
} from "@/services/matchmakingService";
import {
  fetchEventDetail,
  fetchEventStandings,
  finishEvent,
} from "@/services/eventService";
import type {
  CancelMatchmakingRoundErrorResponse,
  GetMatchmakingSessionErrorResponse,
  MatchmakingMatchParticipant,
  MatchmakingSessionDetail,
  MatchmakingSessionMatch,
  MatchmakingSessionMatchSide,
  MatchmakingSessionPlayer,
  MatchmakingSessionRound,
  MatchmakingSessionRoundStatus,
  MatchmakingSessionTeam,
  StartMatchmakingRoundErrorResponse,
  SubmitMatchmakingMatchScoreErrorResponse,
} from "@/types/matchmaking";
import type {
  Event,
  EventStandingRow,
  EventStandingsType,
  FetchEventStandingsErrorResponse,
  FinishEventErrorResponse,
} from "@/types/event";
import {
  downloadPng,
  generateTop3StandingsPng,
  generateYourResultPng,
} from "@/utils/shareStandingsImage";

type TabType = "Matches" | "Standings";

interface MatchPlayer {
  name: string;
  avatarSeed: string;
  avatarUrl?: string;
  side: "left" | "right";
}

interface MatchCard {
  id: string;
  court: string;
  time: string;
  isLive?: boolean;
  isFeatured?: boolean;
  teamA: MatchPlayer[];
  teamB: MatchPlayer[];
  scoreA: string;
  scoreB: string;
  round?: string;
}

interface Round {
  guid: string;
  status: MatchmakingSessionRoundStatus;
  label: string;
  badge: string;
  matches: MatchCard[];
}

function normalizeRoundStatusKey(
  status: MatchmakingSessionRoundStatus | string | undefined,
): string {
  return String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/** Start round only while the round is pending. */
function shouldShowStartRound(
  status: MatchmakingSessionRoundStatus | string | undefined,
): boolean {
  return normalizeRoundStatusKey(status) === "pending";
}

/** Cancel round only while in progress (pending shows Start only). */
function shouldShowCancelRound(
  status: MatchmakingSessionRoundStatus | string | undefined,
): boolean {
  return normalizeRoundStatusKey(status) === "in_progress";
}

interface StandingRow {
  rank: number;
  name: string;
  mp: number;
  wins: number;
  scoreDiff: number;
  winPct: string;
  isPlaceholder?: boolean;
  total_points: number;
}

function avatarSeedFromGuid(guid: string) {
  return guid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || "player";
}

function formatEventTime(dateTime: string) {
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function humanizeRoundStatus(status: string) {
  return status
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function asRoundList(
  value: MatchmakingSessionDetail["rounds"],
): MatchmakingSessionRound[] {
  return Array.isArray(value) ? value : [];
}

function asTeamList(
  value: MatchmakingSessionDetail["teams"],
): MatchmakingSessionTeam[] {
  return Array.isArray(value) ? value : [];
}

function buildTeamsByGuid(
  detail: MatchmakingSessionDetail,
): Map<string, MatchmakingSessionTeam> {
  const map = new Map<string, MatchmakingSessionTeam>();
  for (const team of asTeamList(detail.teams)) {
    if (team.guid) map.set(team.guid, team);
  }
  return map;
}

function playerLabel(
  player: MatchmakingSessionPlayer | null | undefined,
): string {
  if (!player) return "";
  return (
    player.name?.trim() ||
    player.user?.name?.trim() ||
    player.email?.trim() ||
    player.user?.email?.trim() ||
    ""
  );
}

function playerGuid(
  player: MatchmakingSessionPlayer | null | undefined,
): string | undefined {
  return player?.guid || player?.user?.guid;
}

function isParticipantArray(
  value: MatchmakingSessionMatchSide | undefined,
): value is MatchmakingMatchParticipant[] {
  return Array.isArray(value);
}

function mergeTeamWithSession(
  partial: MatchmakingSessionTeam | null | undefined,
  teamsByGuid: Map<string, MatchmakingSessionTeam>,
): MatchmakingSessionTeam | null {
  if (!partial) return null;
  const guid = partial.guid?.trim();
  if (!guid) return partial;
  const full = teamsByGuid.get(guid);
  if (!full) return partial;
  const pickPlayer = (
    fromMatch: MatchmakingSessionPlayer | null | undefined,
    fromSession: MatchmakingSessionPlayer | null | undefined,
  ) => (playerLabel(fromMatch) ? fromMatch : fromSession);
  return {
    ...full,
    ...partial,
    player1: pickPlayer(partial.player1, full.player1),
    player2: pickPlayer(partial.player2, full.player2),
  };
}

function resolveMatchSidePlayers(
  m: MatchmakingSessionMatch,
  side: "a" | "b",
  teamsByGuid: Map<string, MatchmakingSessionTeam>,
): MatchmakingSessionPlayer[] {
  const raw = side === "a" ? m.team_a : m.team_b;
  if (isParticipantArray(raw)) return raw as MatchmakingSessionPlayer[];

  const info = side === "a" ? m.team_a_info : m.team_b_info;
  const teamRaw =
    info ?? (raw && !Array.isArray(raw) ? raw : null);
  const guidOnly = (side === "a" ? m.team_a_guid : m.team_b_guid)?.trim();

  let team: MatchmakingSessionTeam | null = null;
  if (teamRaw) {
    team = mergeTeamWithSession(teamRaw, teamsByGuid);
  } else if (guidOnly) {
    team = teamsByGuid.get(guidOnly) ?? null;
  }

  if (!team) return [];
  return [team.player1, team.player2].filter(
    (p): p is MatchmakingSessionPlayer => Boolean(p),
  );
}

function patchMatchScore(
  detail: MatchmakingSessionDetail,
  matchGuid: string,
  side: "a" | "b",
  value: number | null,
): MatchmakingSessionDetail {
  const rounds = asRoundList(detail.rounds).map((r) => ({
    ...r,
    matches: (Array.isArray(r.matches) ? r.matches : []).map((m) => {
      if (m.guid !== matchGuid) return m;
      return {
        ...m,
        team_a_score: side === "a" ? value : m.team_a_score,
        team_b_score: side === "b" ? value : m.team_b_score,
      };
    }),
  }));
  return { ...detail, rounds };
}

function getMatchRawScores(
  d: MatchmakingSessionDetail,
  matchGuid: string,
): { a: number | null; b: number | null } | null {
  for (const r of asRoundList(d.rounds)) {
    const ms = Array.isArray(r.matches) ? r.matches : [];
    const m = ms.find((x) => x.guid === matchGuid);
    if (m) {
      return {
        a: m.team_a_score ?? null,
        b: m.team_b_score ?? null,
      };
    }
  }
  return null;
}

function parseScoreDisplay(display: string): number | null {
  if (display === "—" || display.trim() === "") return null;
  const n = parseInt(display, 10);
  return Number.isNaN(n) ? null : n;
}

function playersToMatchPlayers(
  players: MatchmakingSessionPlayer[],
  side: "left" | "right",
): MatchPlayer[] {
  const slot = (
    player: MatchmakingSessionPlayer | null | undefined,
    i: number,
  ): MatchPlayer => {
    const label = playerLabel(player);
    return {
      name: label || "TBD",
      avatarSeed: avatarSeedFromGuid(playerGuid(player) ?? `tbd-${side}-${i}`),
      avatarUrl: player?.profile_photo?.trim() || undefined,
      side,
    };
  };
  if (players.length === 0) {
    return [
      { name: "TBD", avatarSeed: `tbd-${side}-1`, side },
      { name: "TBD", avatarSeed: `tbd-${side}-2`, side },
    ];
  }
  return [slot(players[0], 1), slot(players[1], 2)];
}

function mapMatchToCard(
  m: MatchmakingSessionMatch,
  opts: { timeLabel: string; isLive: boolean; isFeatured: boolean },
  teamsByGuid: Map<string, MatchmakingSessionTeam>,
): MatchCard {
  return {
    id: m.guid,
    court: m.court_number ? `Court ${m.court_number}` : "Court",
    time: opts.timeLabel,
    isLive: opts.isLive,
    isFeatured: opts.isFeatured,
    teamA: playersToMatchPlayers(
      resolveMatchSidePlayers(m, "a", teamsByGuid),
      "left",
    ),
    teamB: playersToMatchPlayers(
      resolveMatchSidePlayers(m, "b", teamsByGuid),
      "right",
    ),
    scoreA: m.team_a_score == null ? "—" : String(m.team_a_score),
    scoreB: m.team_b_score == null ? "—" : String(m.team_b_score),
  };
}

function mapDetailToRounds(detail: MatchmakingSessionDetail): Round[] {
  const teamsByGuid = buildTeamsByGuid(detail);
  const sorted = [...asRoundList(detail.rounds)].sort(
    (a, b) => a.round_number - b.round_number,
  );
  return sorted.map((round) => {
    const isRoundLive = round.status === "in_progress";
    const timeLabel = isRoundLive
      ? "LIVE"
      : formatEventTime(detail.event.date_time);
    const matches = Array.isArray(round.matches) ? round.matches : [];
    return {
      guid: round.guid,
      status: round.status,
      label: `Round ${round.round_number}`,
      badge: humanizeRoundStatus(String(round.status)),
      matches: matches.map((m, idx) =>
        mapMatchToCard(
          m,
          {
            timeLabel,
            isLive: isRoundLive,
            isFeatured: isRoundLive && idx === 0,
          },
          teamsByGuid,
        ),
      ),
    };
  });
}

function formatWinRate(wins: number, gamesPlayed: number) {
  if (gamesPlayed <= 0) return "—";
  return `${Math.round((wins / gamesPlayed) * 100)}%`;
}

function formatScoreDiff(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function mapEventStandingsToRows(rows: EventStandingRow[]): StandingRow[] {
  return rows.map((row) => ({
    rank: row.rank,
    name: row.user.name.trim() || row.user.email,
    mp: row.matches_played,
    wins: row.wins,
    scoreDiff: row.score_diff,
    winPct: formatWinRate(row.wins, row.matches_played),
    total_points: row.total_points
  }));
}

function PlayerRow({
  player,
  isFeatured,
}: {
  player: MatchPlayer;
  isFeatured?: boolean;
}) {
  const isRight = player.side === "right";
  return (
    <div
      className={`flex items-center gap-3 ${isRight ? "flex-row-reverse" : ""}`}
    >
      <div
        className="w-8 h-8 rounded-full overflow-hidden shrink-0"
        style={{
          border: `2px solid ${isFeatured ? "#18181B" : "#9FE870"}`,
        }}
      >
        {player.avatarUrl ? (
          <Image
            src={player.avatarUrl}
            alt={player.name}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "#E4E4E7" }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "#52525B" }}
            >
              {(player.name ?? "?").charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <span
        className={`text-xs font-semibold ${isFeatured ? "text-[#18181B]" : "text-[#151C27]"}`}
        style={{ lineHeight: "12px" }}
      >
        {player.name}
      </span>
    </div>
  );
}

function MatchCardComponent({
  match,
  onScoreSidePress,
  scoresEditable,
  showSave,
  isSaving,
  onSave,
  showStartRound,
  onStartRound,
  isStartRoundLoading,
  showCancelRound,
  onCancelRound,
  isCancelRoundLoading,
  isRoundMutationBusy,
}: {
  match: MatchCard;
  onScoreSidePress?: (side: "a" | "b") => void;
  /** When false (e.g. round still pending), score cells are read-only. */
  scoresEditable?: boolean;
  showSave?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  showStartRound?: boolean;
  onStartRound?: () => void;
  isStartRoundLoading?: boolean;
  showCancelRound?: boolean;
  onCancelRound?: () => void;
  isCancelRoundLoading?: boolean;
  isRoundMutationBusy?: boolean;
}) {
  const isFeatured = match.isFeatured;
  const isTBD = match.round === "tbd";
  const canEditScores = scoresEditable !== false;

  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{
        background: isFeatured ? "#9FE870" : "#FFFFFF",
        border: `1px solid ${isFeatured ? "#18181B" : "#F2F2F2"}`,
        borderRadius: "32px",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect
              x="0.75"
              y="0.75"
              width="10.5"
              height="10.5"
              rx="1.5"
              stroke={isFeatured ? "#18181B" : "#5F5E5E"}
              strokeWidth="1.5"
            />
            <line
              x1="6"
              y1="0.75"
              x2="6"
              y2="11.25"
              stroke={isFeatured ? "#18181B" : "#5F5E5E"}
              strokeWidth="1.5"
            />
            <line
              x1="0.75"
              y1="6"
              x2="11.25"
              y2="6"
              stroke={isFeatured ? "#18181B" : "#5F5E5E"}
              strokeWidth="1.5"
            />
          </svg>
          <span
            className={`text-xs font-normal ${isFeatured ? "text-[#18181B]" : "text-[#5F5E5E]"}`}
            style={{ lineHeight: "12px" }}
          >
            {match.court}
          </span>
        </div>
        <span
          className={`text-xs font-bold ${isFeatured ? "text-[#18181B]" : "text-[#5F5E5E]"}`}
          style={{ lineHeight: "12px" }}
        >
          {match.isLive ? "LIVE" : match.time}
        </span>
      </div>

      {showStartRound && onStartRound ? (
        <button
          type="button"
          disabled={isRoundMutationBusy}
          onClick={onStartRound}
          className="w-full py-2.5 text-center text-xs font-semibold rounded-xl border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{
            borderColor: isFeatured ? "#18181B" : "#D4D4D8",
            color: isFeatured ? "#18181B" : "#18181B",
            background: isFeatured ? "rgba(255,255,255,0.35)" : "#FAFAFA",
            lineHeight: "18px",
          }}
        >
          {isStartRoundLoading ? "Starting…" : "Start round"}
        </button>
      ) : null}

      {showCancelRound && onCancelRound ? (
        <button
          type="button"
          disabled={isRoundMutationBusy}
          onClick={onCancelRound}
          className="w-full py-2.5 text-center text-xs font-semibold rounded-xl border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          style={{
            borderColor: isFeatured ? "#BA1A1A" : "#D4D4D8",
            color: "#BA1A1A",
            background: isFeatured ? "rgba(255,255,255,0.5)" : "#FEF2F2",
            lineHeight: "18px",
          }}
        >
          {isCancelRoundLoading ? "Cancelling…" : "Cancel round"}
        </button>
      ) : null}

      {isTBD ? (
        <div className="flex items-center gap-4">
          <div
            className="flex-1 flex items-center px-4 py-4"
            style={{ background: "#F0F3FF", borderRadius: "32px" }}
          >
            <span
              className="text-xs font-semibold text-[#5F5E5E]"
              style={{ lineHeight: "12px" }}
            >
              Winner M1
            </span>
          </div>
          <div className="flex items-center justify-center">
            <span
              className="text-base font-black text-[#D4D4D8]"
              style={{ lineHeight: "24px" }}
            >
              VS
            </span>
          </div>
          <div
            className="flex-1 flex items-center px-4 py-4"
            style={{ background: "#F0F3FF", borderRadius: "32px" }}
          >
            <span
              className="text-xs font-semibold text-[#5F5E5E]"
              style={{ lineHeight: "12px" }}
            >
              Winner M2
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex flex-col gap-3">
            {match.teamA.map((p) => (
              <PlayerRow
                key={`${p.avatarSeed}-a`}
                player={p}
                isFeatured={isFeatured}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={!canEditScores}
              className={`w-10 h-12 flex items-center justify-center border-0 ${canEditScores ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              style={{
                background: isFeatured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
                borderRadius: "6px",
              }}
              onClick={() => onScoreSidePress?.("a")}
              aria-label={
                canEditScores ? "Edit team A score" : "Team A score (locked)"
              }
            >
              <span className="text-base font-normal text-[#18181B]">
                {match.scoreA}
              </span>
            </button>
            <span
              className={`text-base font-bold ${isFeatured ? "text-[#18181B]" : "text-[#D4D4D8]"}`}
              style={{ lineHeight: "24px" }}
            >
              -
            </span>
            <button
              type="button"
              disabled={!canEditScores}
              className={`w-10 h-12 flex items-center justify-center border-0 ${canEditScores ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              style={{
                background: isFeatured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
                borderRadius: "6px",
              }}
              onClick={() => onScoreSidePress?.("b")}
              aria-label={
                canEditScores ? "Edit team B score" : "Team B score (locked)"
              }
            >
              <span className="text-base font-normal text-[#18181B]">
                {match.scoreB}
              </span>
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3 items-end">
            {match.teamB.map((p) => (
              <PlayerRow
                key={`${p.avatarSeed}-b`}
                player={p}
                isFeatured={isFeatured}
              />
            ))}
          </div>
        </div>
      )}

      {showSave && !isTBD ? (
        <div
          className={`pt-3 mt-1 border-t ${isFeatured ? "border-[#18181B]/25" : "border-[#F4F4F5]"}`}
        >
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="w-full py-3 text-center text-sm font-semibold rounded-2xl border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{
              background: isFeatured ? "#FFFFFF" : "#18181B",
              color: isFeatured ? "#18181B" : "#FFFFFF",
              lineHeight: "21px",
            }}
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MatchesTab({
  rounds,
  canManageEvent,
  onScoreSidePress,
  pendingSaveMatchIds,
  savingMatchId,
  onSaveMatch,
  startRoundLoadingGuid,
  onStartRound,
  cancellingRoundGuid,
  onCancelRound,
}: {
  rounds: Round[];
  /** Host-only edits while the event is not finished. */
  canManageEvent: boolean;
  onScoreSidePress?: (matchGuid: string, side: "a" | "b") => void;
  pendingSaveMatchIds: ReadonlySet<string>;
  savingMatchId: string | null;
  onSaveMatch: (matchGuid: string) => void;
  startRoundLoadingGuid: string | null;
  onStartRound: (roundGuid: string) => void;
  cancellingRoundGuid: string | null;
  onCancelRound: (roundGuid: string) => void;
}) {
  if (rounds.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[#71717A]">
        No rounds scheduled yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {rounds.map((round) => (
        <div key={round.guid} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span
              className="text-xl font-semibold text-[#151C27]"
              style={{ lineHeight: "26px" }}
            >
              {round.label}
            </span>
            <div
              className="px-3 py-1"
              style={{ background: "#E7EEFE", borderRadius: "9999px" }}
            >
              <span
                className="text-xs font-normal text-[#41493A]"
                style={{ lineHeight: "12px" }}
              >
                {round.badge}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {round.matches.map((match) => {
              const showStart = shouldShowStartRound(round.status);
              const showCancel = shouldShowCancelRound(round.status);
              const isRoundMutationBusy =
                startRoundLoadingGuid === round.guid ||
                cancellingRoundGuid === round.guid;
              const scoresEditable =
                canManageEvent &&
                normalizeRoundStatusKey(round.status) !== "pending";
              return (
                <MatchCardComponent
                  key={match.id}
                  match={match}
                  scoresEditable={scoresEditable}
                  onScoreSidePress={
                    canManageEvent
                      ? (side) => onScoreSidePress?.(match.id, side)
                      : undefined
                  }
                  showSave={
                    canManageEvent && pendingSaveMatchIds.has(match.id)
                  }
                  isSaving={savingMatchId === match.id}
                  onSave={() => onSaveMatch(match.id)}
                  showStartRound={canManageEvent && showStart}
                  onStartRound={
                    canManageEvent && showStart
                      ? () => onStartRound(round.guid)
                      : undefined
                  }
                  isStartRoundLoading={startRoundLoadingGuid === round.guid}
                  showCancelRound={canManageEvent && showCancel}
                  onCancelRound={
                    canManageEvent && showCancel
                      ? () => onCancelRound(round.guid)
                      : undefined
                  }
                  isCancelRoundLoading={cancellingRoundGuid === round.guid}
                  isRoundMutationBusy={isRoundMutationBusy}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function StandingsTab({
  standings,
  standingsType,
  yourRank,
  onStandingsTypeChange,
  isLoading,
}: {
  standings: StandingRow[];
  standingsType: EventStandingsType;
  yourRank: string | null;
  onStandingsTypeChange: (type: EventStandingsType) => void;
  isLoading: boolean;
}) {
  const standingsTypeLabel =
    standingsType === "wins" ? "Most Wins" : "Point Difference";
  const typeControl = (
    <div className="px-4 pt-4">
      <label className="flex flex-col gap-2">
        <span
          className="text-xs font-semibold uppercase text-[#A1A1AA]"
          style={{ lineHeight: "12px" }}
        >
          Standings Type
        </span>
        <select
          value={standingsType}
          onChange={(e) =>
            onStandingsTypeChange(e.target.value as EventStandingsType)
          }
          disabled={isLoading}
          className="w-full px-4 py-3 text-sm font-semibold text-[#18181B] border border-[#F4F4F5] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderRadius: "16px" }}
        >
          <option value="wins">Wins</option>
          <option value="points">Points</option>
        </select>
      </label>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 pb-8">
        {typeControl}
        <div className="px-4 py-8 text-center text-sm text-[#71717A]">
          Loading standings…
        </div>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="flex flex-col gap-4 pb-8">
        {typeControl}
        <div className="px-4 py-8 text-center text-sm text-[#71717A]">
          No standings available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Leaderboard Summary Card (Bento Style) */}
      <div className="px-4 pt-4">
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{
            background: "#9FE870",
            borderRadius: "32px",
          }}
        >
          {/* Left: top rank */}
          <div className="flex flex-col gap-1">
            <span
              className="text-xs uppercase tracking-widest"
              style={{
                color: "rgba(46,105,0,0.7)",
                lineHeight: "12px",
                letterSpacing: "5%",
              }}
            >
              YOUR RANK
            </span>
            <span
              className="font-semibold text-[#2E6900]"
              style={{
                fontSize: "28px",
                lineHeight: "33.6px",
                letterSpacing: "-0.01em",
              }}
            >
              #{yourRank ?? "—"}
            </span>
          </div>

          {/* Right: standings type badge */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              borderRadius: "32px",
            }}
          >
            {/* Arrow up icon */}
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path
                d="M10 2L16 8M10 2L4 8M10 2V11"
                stroke="#2E6900"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-xs font-semibold text-[#2E6900]"
              style={{ lineHeight: "12px" }}
            >
              {standingsTypeLabel}
            </span>
          </div>
        </div>
      </div>

      {typeControl}


      {/* Section - Detailed Leaderboard Table */}
      <div className="px-4">
        <div
          className="border border-[#F4F4F5] overflow-hidden"
          style={{ borderRadius: "32px" }}
        >
          {/* Header row */}
          <div
            className="flex items-center justify-between px-4 py-4"
            style={{ borderBottom: "1px solid #FAFAFA" }}
          >
            <span
              className="text-xs font-semibold uppercase text-[#18181B]"
              style={{ lineHeight: "12px" }}
            >
              SEASON STANDINGS
            </span>
            <span
              className="text-xs font-semibold uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              {standingsTypeLabel}
            </span>
          </div>

          {/* Column headers */}
          <div
            className="flex items-center"
            style={{ background: "rgba(250,250,250,0.5)" }}
          >
            <div className="pl-3 pr-0.5 py-3" style={{ width: "52px" }}>
              <span
                className="text-xs uppercase text-[#A1A1AA]"
                style={{ lineHeight: "12px" }}
              >
                RK
              </span>
            </div>
            <div className="flex-1 pl-1 pr-0 py-3 min-w-0">
              <span
                className="text-xs uppercase text-[#A1A1AA]"
                style={{ lineHeight: "12px" }}
              >
                PLAYER
              </span>
            </div>
            <div className="px-0.5 py-3 text-center" style={{ width: "36px" }}>
              <span
                className="text-xs uppercase text-[#A1A1AA]"
                style={{ lineHeight: "12px" }}
              >
                MP
              </span>
            </div>
            {standingsType === "wins" ? (
              <>
                <div className="px-0.5 py-3 text-center" style={{ width: "28px" }}>
                  <span
                    className="text-xs uppercase text-[#A1A1AA]"
                    style={{ lineHeight: "12px" }}
                  >
                    W
                  </span>
                </div>
                <div className="px-0.5 py-3 text-center" style={{ width: "40px" }}>
                  <span
                    className="text-xs uppercase text-[#A1A1AA]"
                    style={{ lineHeight: "12px" }}
                  >
                    +/-
                  </span>
                </div>
                <div className="px-0.5 py-3 text-center" style={{ width: "40px" }}>
                  <span
                    className="text-xs uppercase text-[#A1A1AA]"
                    style={{ lineHeight: "12px" }}
                  >
                    W%
                  </span>
                </div>
              </>
            ) : (
              <div className="px-0.5 py-3 text-center" style={{ width: "40px" }}>
                <span
                  className="text-xs uppercase text-[#A1A1AA]"
                  style={{ lineHeight: "12px" }}
                >
                  P
                </span>
              </div>
            )}
          </div>

          {/* Table body */}
          <div className="flex flex-col" style={{ gap: "-1px" }}>
            {standings.map((row, idx) => {
              const isPlaceholder = row.isPlaceholder;
              return (
                <div
                  key={`${row.rank}-${row.name}`}
                  className="flex items-center"
                  style={{
                    background: "transparent",
                    borderTop: idx > 0 ? "1px solid #FAFAFA" : "none",
                    opacity: isPlaceholder ? 0.6 : 1,
                  }}
                >
                  {/* Rank cell */}
                  <div
                    className="flex items-center gap-0.5 py-4 pl-3 pr-0.5 shrink-0"
                    style={{ width: "52px" }}
                  >
                    <span
                      className="text-xs font-semibold"
                      style={{
                        lineHeight: "12px",
                        color: isPlaceholder ? "#71717A" : "#18181B",
                      }}
                    >
                      {row.rank}
                    </span>
                    {row.rank <= 3 && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                          fill={
                            row.rank === 1
                              ? "#EAB308"
                              : row.rank === 2
                                ? "#A1A1AA"
                                : "#FB923C"
                          }
                        />
                      </svg>
                    )}
                  </div>

                  {/* Player cell */}
                  <div className="flex items-center py-3 min-w-0 flex-1 pl-1 pr-0">
                    <span
                      className="text-xs font-normal wrap-break-word leading-snug"
                      style={{ color: "#18181B" }}
                    >
                      {row.name}
                    </span>
                  </div>

                  {/* MP */}
                  <div
                    className="px-0.5 py-4 text-center shrink-0"
                    style={{ width: "36px" }}
                  >
                    <span className="text-xs font-normal text-[#52525B] leading-snug">
                      {row.mp}
                    </span>
                  </div>

                  {standingsType === "wins" ? (
                    <>
                      {/* W */}
                      <div
                        className="px-0.5 py-4 text-center shrink-0"
                        style={{ width: "28px" }}
                      >
                        <span className="text-xs font-normal text-[#52525B] leading-snug">
                          {row.wins}
                        </span>
                      </div>

                      {/* Score difference */}
                      <div
                        className="px-0.5 py-4 text-center shrink-0"
                        style={{ width: "40px" }}
                      >
                        <span className="text-xs font-normal text-[#2F6C00] leading-snug">
                          {formatScoreDiff(row.scoreDiff)}
                        </span>
                      </div>

                      {/* W% */}
                      <div
                        className="px-0.5 py-4 text-center shrink-0"
                        style={{ width: "40px" }}
                      >
                        <span className="text-xs font-normal text-[#52525B] leading-snug">
                          {row.winPct}
                        </span>
                      </div>
                    </>
                  ) : (
                    /* P */
                    <div
                      className="px-0.5 py-4 text-center shrink-0"
                      style={{ width: "40px" }}
                    >
                      <span className="text-xs font-normal text-[#2F6C00] leading-snug">
                        {row.total_points}
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          <div className="px-4 py-4" style={{ background: "#FAFAFA" }}>
            <div
              className="w-full flex items-center justify-center"
              style={{ background: "transparent", border: "none" }}
            >
              <span
                className="text-xs font-semibold text-[#71717A]"
                style={{ lineHeight: "12px" }}
              >
                {standings.length} player{standings.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function MatchDetailClient({
  sessionGuid,
  eventGuid: eventGuidProp,
}: {
  sessionGuid: string;
  eventGuid?: string;
}) {
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<TabType>("Matches");
  const [detail, setDetail] = useState<MatchmakingSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [standingsType, setStandingsType] =
    useState<EventStandingsType>("wins");
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [yourRank, setYourRank] = useState<string | null>(null);
  const [isStandingsLoading, setIsStandingsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [scoreSheet, setScoreSheet] = useState<{
    matchGuid: string;
    side: "a" | "b";
    initial: number | null;
  } | null>(null);
  const [pendingSaveMatchIds, setPendingSaveMatchIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [savingMatchId, setSavingMatchId] = useState<string | null>(null);
  const [startRoundLoadingGuid, setStartRoundLoadingGuid] = useState<
    string | null
  >(null);
  const [cancellingRoundGuid, setCancellingRoundGuid] = useState<string | null>(
    null,
  );
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSharingMatchResult, setIsSharingMatchResult] = useState(false);
  const [isSharingYourResult, setIsSharingYourResult] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [eventDetail, setEventDetail] = useState<Event | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetchMatchmakingSession(sessionGuid);
        if (!cancelled) {
          setDetail(res.data);
          setStandings([]);
          setYourRank(null);
          setPendingSaveMatchIds(new Set());
        }
      } catch (e) {
        const err = e as GetMatchmakingSessionErrorResponse;
        if (!cancelled) {
          setModalMessage(err?.message ?? "Could not load match session.");
          setModalOpen(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionGuid]);

  const eventGuid =
    eventGuidProp?.trim() || detail?.event_guid || detail?.event.guid;

  useEffect(() => {
    if (!eventGuid) {
      setEventDetail(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetchEventDetail(eventGuid);
        if (!cancelled) setEventDetail(res.data);
      } catch {
        if (!cancelled) setEventDetail(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventGuid]);

  const isEventFinished = eventDetail?.is_finished === true;

  useEffect(() => {
    const shouldLoadStandings =
      Boolean(eventGuid) &&
      (activeTab === "Standings" || isEventFinished);
    if (!shouldLoadStandings) return;

    let cancelled = false;
    (async () => {
      setIsStandingsLoading(true);
      setStandings([]);
      setYourRank(null);
      try {
        const res = await fetchEventStandings({
          event_guid: eventGuid!,
          type: standingsType,
        });
        if (!cancelled) {
          setStandings(mapEventStandingsToRows(res.data.standings));
          setYourRank(res.data.your_rank || null);
        }
      } catch (e) {
        const err = e as FetchEventStandingsErrorResponse;
        if (!cancelled) {
          setModalMessage(err?.message ?? "Could not load standings.");
          setModalOpen(true);
        }
      } finally {
        if (!cancelled) setIsStandingsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab, eventGuid, standingsType, isEventFinished]);

  const headerTitle = detail?.event.name ?? (isLoading ? "Loading…" : "Match");
  const rounds = detail ? mapDetailToRounds(detail) : [];

  const canManageEvent =
    eventDetail?.is_host === true && eventDetail?.is_finished !== true;

  const openScoreEditor = (matchGuid: string, side: "a" | "b") => {
    if (!canManageEvent) return;
    const card = rounds
      .flatMap((r) => r.matches)
      .find((m) => m.id === matchGuid);
    const display = side === "a" ? card?.scoreA : card?.scoreB;
    setScoreSheet({
      matchGuid,
      side,
      initial: display != null ? parseScoreDisplay(display) : null,
    });
  };

  const applyScoreFromKeyboard = (value: number | null) => {
    if (!canManageEvent || !detail || !scoreSheet) return;
    const matchGuid = scoreSheet.matchGuid;
    const before = getMatchRawScores(detail, matchGuid);
    const afterA = scoreSheet.side === "a" ? value : (before?.a ?? null);
    const afterB = scoreSheet.side === "b" ? value : (before?.b ?? null);
    const scoresUnchanged =
      before != null && before.a === afterA && before.b === afterB;

    setDetail(patchMatchScore(detail, matchGuid, scoreSheet.side, value));
    if (!scoresUnchanged) {
      setPendingSaveMatchIds((prev) => {
        const next = new Set(prev);
        next.add(matchGuid);
        return next;
      });
    }
    setScoreSheet(null);
  };

  const handleSaveMatch = async (matchGuid: string) => {
    if (!canManageEvent || !detail) return;
    const scores = getMatchRawScores(detail, matchGuid);
    if (!scores) {
      showSnackbar("Could not find this match.");
      return;
    }

    setSavingMatchId(matchGuid);
    try {
      const res = await submitMatchmakingMatchScore(matchGuid, {
        team_a_score: scores.a,
        team_b_score: scores.b,
      });
      showSnackbar(res.message);

      const refreshed = await fetchMatchmakingSession(sessionGuid);
      setDetail(refreshed.data);
      setPendingSaveMatchIds((prev) => {
        const next = new Set(prev);
        next.delete(matchGuid);
        return next;
      });
    } catch (e) {
      const err = e as
        | SubmitMatchmakingMatchScoreErrorResponse
        | GetMatchmakingSessionErrorResponse;
      showSnackbar(err?.message ?? "Could not save or refresh score.");
    } finally {
      setSavingMatchId(null);
    }
  };

  const handleStartRound = async (roundGuid: string) => {
    if (!canManageEvent) return;
    setStartRoundLoadingGuid(roundGuid);
    try {
      const res = await startMatchmakingRound(roundGuid);
      showSnackbar(res.message);
      const refreshed = await fetchMatchmakingSession(sessionGuid);
      setDetail(refreshed.data);
    } catch (e) {
      const err = e as
        | StartMatchmakingRoundErrorResponse
        | GetMatchmakingSessionErrorResponse;
      showSnackbar(err?.message ?? "Could not start round.");
    } finally {
      setStartRoundLoadingGuid(null);
    }
  };

  const handleCancelRound = async (roundGuid: string) => {
    if (!canManageEvent) return;
    setCancellingRoundGuid(roundGuid);
    try {
      const res = await cancelMatchmakingRound(roundGuid);
      showSnackbar(res.message);
      const refreshed = await fetchMatchmakingSession(sessionGuid);
      setDetail(refreshed.data);
    } catch (e) {
      const err = e as
        | CancelMatchmakingRoundErrorResponse
        | GetMatchmakingSessionErrorResponse;
      showSnackbar(err?.message ?? "Could not cancel round.");
    } finally {
      setCancellingRoundGuid(null);
    }
  };

  const handleFinishEvent = async () => {
    if (!canManageEvent) return;
    if (!eventGuid) {
      showSnackbar("Event not found for this session.");
      return;
    }

    setIsFinishing(true);
    try {
      const res = await finishEvent(eventGuid);
      showSnackbar(res.message);
      const refreshed = await fetchEventDetail(eventGuid);
      setEventDetail(refreshed.data);
      setShowFinishConfirm(false);
    } catch (e) {
      const err = e as FinishEventErrorResponse;
      showSnackbar(err?.message ?? "Could not finish event.");
    } finally {
      setIsFinishing(false);
    }
  };

  const ensureStandingsForShare = async () => {
    if (!eventGuid) {
      throw new Error("Event not found for this session.");
    }
    if (standings.length > 0) {
      return { rows: standings, rank: yourRank };
    }

    const res = await fetchEventStandings({
      event_guid: eventGuid,
      type: standingsType,
    });
    const rows = mapEventStandingsToRows(res.data.standings);
    const rank = res.data.your_rank || null;
    setStandings(rows);
    setYourRank(rank);
    return { rows, rank };
  };

  const handleShareMatchResult = async () => {
    if (!eventGuid || isSharingMatchResult || isSharingYourResult) return;

    setIsSharingMatchResult(true);
    try {
      const { rows } = await ensureStandingsForShare();
      const top3 = rows.filter((row) => !row.isPlaceholder).slice(0, 3);
      if (top3.length === 0) {
        showSnackbar("No standings available to share yet.");
        return;
      }

      const blob = await generateTop3StandingsPng({
        eventName: headerTitle,
        standingsType,
        top3,
      });
      downloadPng(
        blob,
        `${headerTitle.replace(/\s+/g, "-").toLowerCase()}-top-3.png`,
      );
      showSnackbar("Match result image downloaded.");
    } catch (e) {
      const err = e as FetchEventStandingsErrorResponse | Error;
      showSnackbar(
        "message" in err && typeof err.message === "string"
          ? err.message
          : "Could not share match result.",
      );
    } finally {
      setIsSharingMatchResult(false);
    }
  };

  const handleShareYourResult = async () => {
    if (!eventGuid || isSharingMatchResult || isSharingYourResult) return;

    setIsSharingYourResult(true);
    try {
      const { rows, rank } = await ensureStandingsForShare();
      if (!rank) {
        showSnackbar("Your standing is not available yet.");
        return;
      }

      const yourRow = rows.find((row) => String(row.rank) === rank);
      if (!yourRow) {
        showSnackbar("Could not find your standing.");
        return;
      }

      const blob = await generateYourResultPng({
        eventName: headerTitle,
        yourRank: rank,
        row: yourRow,
      });
      downloadPng(
        blob,
        `${headerTitle.replace(/\s+/g, "-").toLowerCase()}-my-result.png`,
      );
      showSnackbar("Your result image downloaded.");
    } catch (e) {
      const err = e as FetchEventStandingsErrorResponse | Error;
      showSnackbar(
        "message" in err && typeof err.message === "string"
          ? err.message
          : "Could not share your result.",
      );
    } finally {
      setIsSharingYourResult(false);
    }
  };

  const showFinishFooter = Boolean(
    detail &&
      eventGuid &&
      (isEventFinished || eventDetail?.is_host === true),
  );

  const yourStandingRow = yourRank
    ? standings.find((row) => String(row.rank) === yourRank)
    : null;
  const canShareYourResult =
    !isStandingsLoading &&
    Boolean(yourStandingRow && yourStandingRow.mp > 0);

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 max-w-[448px] mx-auto w-full"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F4F4F5",
          height: "64px",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/matches" className="p-1 shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <span
            className="font-black text-xl text-[#18181B] truncate"
            style={{ lineHeight: "28px" }}
          >
            {headerTitle}
          </span>
        </div>

        <div
          className="w-8 h-8 rounded-full overflow-hidden shrink-0"
          style={{ border: "1px solid #F4F4F5" }}
        >
          <Image
            src="https://picsum.photos/seed/userprofile/32/32"
            alt="Player profile"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div
        className="flex flex-col"
        style={{
          paddingTop: "64px",
          paddingBottom: showFinishFooter ? "96px" : undefined,
        }}
      >
        {isLoading ? (
          <div className="px-6 py-8 text-center text-sm text-[#71717A]">
            Loading session…
          </div>
        ) : detail ? (
          <>
            {/* Tab Switcher - pill style matching Figma */}
            <div
              className="px-4 py-4"
              style={{ borderBottom: "1px solid #F4F4F5" }}
            >
              <div
                className="flex items-center p-1"
                style={{
                  background: "#F4F4F5",
                  borderRadius: "9999px",
                }}
              >
                {(["Matches", "Standings"] as TabType[]).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 py-3 text-center transition-all"
                      style={{
                        borderRadius: "9999px",
                        background: isActive ? "#121212" : "transparent",
                        color: isActive ? "#9FE870" : "#71717A",
                        fontSize: "12px",
                        fontWeight: 600,
                        lineHeight: "12px",
                        boxShadow: isActive
                          ? "0px 1px 2px 0px rgba(0,0,0,0.05)"
                          : "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === "Matches" ? (
              <MatchesTab
                rounds={rounds}
                canManageEvent={canManageEvent}
                onScoreSidePress={openScoreEditor}
                pendingSaveMatchIds={pendingSaveMatchIds}
                savingMatchId={savingMatchId}
                onSaveMatch={handleSaveMatch}
                startRoundLoadingGuid={startRoundLoadingGuid}
                onStartRound={handleStartRound}
                cancellingRoundGuid={cancellingRoundGuid}
                onCancelRound={handleCancelRound}
              />
            ) : (
              <StandingsTab
                standings={standings}
                standingsType={standingsType}
                yourRank={yourRank}
                onStandingsTypeChange={setStandingsType}
                isLoading={isStandingsLoading}
              />
            )}
          </>
        ) : null}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />

      <ScoreKeyboardSheet
        isOpen={scoreSheet !== null}
        onRequestClose={() => setScoreSheet(null)}
        onConfirm={applyScoreFromKeyboard}
        initialValue={scoreSheet?.initial ?? null}
      />

      {showFinishConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#151C27]">
              Finish Event
            </h3>
            <p className="text-sm text-[#41493A]">
              Are you sure you want to finish{" "}
              <span className="font-semibold">{headerTitle}</span>? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowFinishConfirm(false)}
                disabled={isFinishing}
                className="flex-1 py-3 rounded-full text-base text-[#18181B] bg-[#F4F4F5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishEvent}
                disabled={isFinishing}
                className="flex-1 py-3 rounded-full text-base font-semibold text-[#121212] bg-[#9FE870] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFinishing ? "Finishing…" : "Finish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishFooter ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 max-w-[448px] mx-auto px-6 py-4 pb-8"
          style={{ background: "#FFFFFF", borderTop: "1px solid #F4F4F5" }}
        >
          {isEventFinished ? (
            canShareYourResult ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleShareMatchResult}
                  disabled={
                    isSharingMatchResult ||
                    isSharingYourResult ||
                    isStandingsLoading
                  }
                  className="flex-1 text-sm font-semibold text-[#121212] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#9FE870", height: "56px" }}
                >
                  {isSharingMatchResult ? "Generating…" : "Share Match Result"}
                </button>
                <button
                  type="button"
                  onClick={handleShareYourResult}
                  disabled={
                    isSharingMatchResult ||
                    isSharingYourResult ||
                    isStandingsLoading
                  }
                  className="flex-1 text-sm font-semibold text-[#121212] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#F4F4F5", height: "56px" }}
                >
                  {isSharingYourResult ? "Generating…" : "Share your Result"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleShareMatchResult}
                disabled={
                  isSharingMatchResult ||
                  isSharingYourResult ||
                  isStandingsLoading
                }
                className="w-full text-base font-semibold text-[#121212] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#9FE870", height: "56px" }}
              >
                {isSharingMatchResult ? "Generating…" : "Share Match Result"}
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={() => setShowFinishConfirm(true)}
              disabled={isFinishing || !canManageEvent}
              className="w-full text-base font-semibold text-[#121212] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "#9FE870", height: "56px" }}
            >
              {isFinishing ? "Finishing…" : "Finish"}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
