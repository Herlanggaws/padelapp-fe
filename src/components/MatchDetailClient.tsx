"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import ScoreKeyboardSheet from "@/components/ScoreKeyboardSheet";
import { fetchMatchmakingSession } from "@/services/matchmakingService";
import type {
  GetMatchmakingSessionErrorResponse,
  MatchmakingSessionDetail,
  MatchmakingSessionMatch,
  MatchmakingSessionRound,
  MatchmakingSessionTeam,
} from "@/types/matchmaking";

type TabType = "Matches" | "Standings";

interface MatchPlayer {
  name: string;
  avatarSeed: string;
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
  label: string;
  badge: string;
  matches: MatchCard[];
}

interface StandingRow {
  rank: number;
  name: string;
  avatarSeed: string;
  mp: number;
  wins: number;
  pts: number;
  winPct: string;
  pPct: string;
  isPlaceholder?: boolean;
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

function asRoundList(value: MatchmakingSessionDetail["rounds"]): MatchmakingSessionRound[] {
  return Array.isArray(value) ? value : [];
}

function asTeamList(value: MatchmakingSessionDetail["teams"]): MatchmakingSessionTeam[] {
  return Array.isArray(value) ? value : [];
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

function parseScoreDisplay(display: string): number | null {
  if (display === "—" || display.trim() === "") return null;
  const n = parseInt(display, 10);
  return Number.isNaN(n) ? null : n;
}

function teamToMatchPlayers(
  team: MatchmakingSessionMatch["team_a_info"],
  side: "left" | "right",
): MatchPlayer[] {
  const slot = (player: { name?: string; guid?: string } | null | undefined, i: number): MatchPlayer => ({
    name: player?.name?.trim() || "TBD",
    avatarSeed: avatarSeedFromGuid(player?.guid ?? `tbd-${side}-${i}`),
    side,
  });
  if (!team) {
    return [
      { name: "TBD", avatarSeed: `tbd-${side}-1`, side },
      { name: "TBD", avatarSeed: `tbd-${side}-2`, side },
    ];
  }
  return [slot(team.player1, 1), slot(team.player2, 2)];
}

function mapMatchToCard(
  m: MatchmakingSessionMatch,
  opts: { timeLabel: string; isLive: boolean; isFeatured: boolean },
): MatchCard {
  return {
    id: m.guid,
    court: m.court_number ? `Court ${m.court_number}` : "Court",
    time: opts.timeLabel,
    isLive: opts.isLive,
    isFeatured: opts.isFeatured,
    teamA: teamToMatchPlayers(m.team_a_info, "left"),
    teamB: teamToMatchPlayers(m.team_b_info, "right"),
    scoreA: m.team_a_score == null ? "—" : String(m.team_a_score),
    scoreB: m.team_b_score == null ? "—" : String(m.team_b_score),
  };
}

function mapDetailToRounds(detail: MatchmakingSessionDetail): Round[] {
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
      label: `Round ${round.round_number}`,
      badge: humanizeRoundStatus(String(round.status)),
      matches: matches.map((m, idx) =>
        mapMatchToCard(m, {
          timeLabel,
          isLive: isRoundLive,
          isFeatured: isRoundLive && idx === 0,
        }),
      ),
    };
  });
}

function mapDetailToStandings(detail: MatchmakingSessionDetail): StandingRow[] {
  const sorted = [...asTeamList(detail.teams)].sort(
    (a, b) =>
      (b.total_points ?? 0) - (a.total_points ?? 0) ||
      (b.games_played ?? 0) - (a.games_played ?? 0),
  );
  return sorted.map((team, i) => {
    const p1 = team.player1?.name?.trim() || "TBD";
    const p2 = team.player2?.name?.trim() || "TBD";
    return {
      rank: i + 1,
      name: `${p1} / ${p2}`,
      avatarSeed: avatarSeedFromGuid(team.guid),
      mp: team.games_played ?? 0,
      wins: 0,
      pts: team.total_points ?? 0,
      winPct: "—",
      pPct: "—",
    };
  });
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
        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
        style={{
          border: `2px solid ${isFeatured ? "#18181B" : "#9FE870"}`,
        }}
      >
        <Image
          src={`https://picsum.photos/seed/${player.avatarSeed}/32/32`}
          alt={player.name}
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
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
}: {
  match: MatchCard;
  onScoreSidePress?: (side: "a" | "b") => void;
}) {
  const isFeatured = match.isFeatured;
  const isTBD = match.round === "tbd";

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

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="w-10 h-12 flex items-center justify-center cursor-pointer border-0"
              style={{
                background: isFeatured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
                borderRadius: "6px",
              }}
              onClick={() => onScoreSidePress?.("a")}
              aria-label="Edit team A score"
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
              className="w-10 h-12 flex items-center justify-center cursor-pointer border-0"
              style={{
                background: isFeatured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
                borderRadius: "6px",
              }}
              onClick={() => onScoreSidePress?.("b")}
              aria-label="Edit team B score"
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
    </div>
  );
}

function MatchesTab({
  rounds,
  onScoreSidePress,
}: {
  rounds: Round[];
  onScoreSidePress?: (matchGuid: string, side: "a" | "b") => void;
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
        <div key={round.label} className="flex flex-col gap-4">
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
            {round.matches.map((match) => (
              <MatchCardComponent
                key={match.id}
                match={match}
                onScoreSidePress={(side) => onScoreSidePress?.(match.id, side)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StandingsTab({ standings }: { standings: StandingRow[] }) {
  if (standings.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[#71717A]">
        No teams in this session.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div
        className="mx-4 mt-4 border border-[#F4F4F5]"
        style={{ borderRadius: "32px" }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#FAFAFA]">
          <span
            className="text-xs font-semibold uppercase text-[#18181B]"
            style={{ lineHeight: "12px" }}
          >
            TEAM STANDINGS
          </span>
          <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
            <path
              d="M1 1H14M4 5H11M6.5 9H8.5"
              stroke="#A1A1AA"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          className="flex items-center"
          style={{ background: "rgba(250,250,250,0.5)" }}
        >
          <div className="w-[79px] px-4 py-4">
            <span
              className="text-xs uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              RK
            </span>
          </div>
          <div className="flex-1 px-2 py-4">
            <span
              className="text-xs uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              TEAM
            </span>
          </div>
          <div className="w-[61px] px-2 py-4 text-center">
            <span
              className="text-xs uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              MP
            </span>
          </div>
          <div className="w-[57px] px-2 py-4 text-center">
            <span
              className="text-xs uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              W
            </span>
          </div>
          <div className="w-[94px] px-2 py-4 text-center">
            <span
              className="text-xs uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              PTS
            </span>
          </div>
          <div className="w-[80px] px-2 py-4 text-center">
            <span
              className="text-xs uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              W%
            </span>
          </div>
          <div className="w-[81px] px-2 py-4 text-right pr-4">
            <span
              className="text-xs uppercase text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              P%
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          {standings.map((row, idx) => {
            const isPlaceholder = row.isPlaceholder;
            return (
              <div
                key={row.rank}
                className="flex items-center"
                style={{
                  background: "transparent",
                  borderTop: idx > 0 ? "1px solid #FAFAFA" : "none",
                  opacity: isPlaceholder ? 0.6 : 1,
                }}
              >
                <div className="w-[79px] px-4 py-5 flex items-center gap-1">
                  <span
                    className="text-xs font-semibold text-[#18181B]"
                    style={{ lineHeight: "12px" }}
                  >
                    {row.rank}
                  </span>
                  {row.rank <= 3 && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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

                <div className="flex-1 px-2 py-3 flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: "1px solid #F4F4F5" }}
                  >
                    {isPlaceholder ? (
                      <div
                        className="w-full h-full rounded-full"
                        style={{ background: "#E4E4E7" }}
                      />
                    ) : (
                      <Image
                        src={`https://picsum.photos/seed/${row.avatarSeed}/32/32`}
                        alt={row.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span
                    className="text-sm font-normal text-[#18181B] truncate"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.name}
                  </span>
                </div>

                <div className="w-[61px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#52525B]"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.mp}
                  </span>
                </div>

                <div className="w-[57px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#52525B]"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.wins === 0 ? "—" : row.wins}
                  </span>
                </div>

                <div className="w-[94px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#2F6C00]"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.pts.toLocaleString()}
                  </span>
                </div>

                <div className="w-[80px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#52525B]"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.winPct}
                  </span>
                </div>

                <div className="w-[81px] px-2 py-5 text-right pr-4">
                  <span
                    className="text-sm font-normal text-[#A1A1AA]"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.pPct}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MatchDetailClient({
  sessionGuid,
}: {
  sessionGuid: string;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("Matches");
  const [detail, setDetail] = useState<MatchmakingSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [scoreSheet, setScoreSheet] = useState<{
    matchGuid: string;
    side: "a" | "b";
    initial: number | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetchMatchmakingSession(sessionGuid);
        if (!cancelled) setDetail(res.data);
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

  const headerTitle = detail?.event.name ?? (isLoading ? "Loading…" : "Match");
  const rounds = detail ? mapDetailToRounds(detail) : [];
  const standings = detail ? mapDetailToStandings(detail) : [];

  const openScoreEditor = (matchGuid: string, side: "a" | "b") => {
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
    if (!detail || !scoreSheet) return;
    setDetail(
      patchMatchScore(detail, scoreSheet.matchGuid, scoreSheet.side, value),
    );
    setScoreSheet(null);
  };

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
          <Link href="/matches" className="p-1 flex-shrink-0">
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
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
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

      <div className="flex flex-col" style={{ paddingTop: "64px" }}>
        {isLoading ? (
          <div className="px-6 py-8 text-center text-sm text-[#71717A]">
            Loading session…
          </div>
        ) : detail ? (
          <>
            <div
              className="flex items-center gap-4 px-6 py-4 bg-white"
              style={{ borderBottom: "none" }}
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
                      background: isActive ? "#FFFFFF" : "transparent",
                      color: isActive ? "#18181B" : "#71717A",
                      fontSize: "14px",
                      fontWeight: isActive ? 700 : 500,
                      lineHeight: "21px",
                      boxShadow: isActive
                        ? "0px 1px 2px 0px rgba(0,0,0,0.05)"
                        : "none",
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {activeTab === "Matches" ? (
              <MatchesTab
                rounds={rounds}
                onScoreSidePress={openScoreEditor}
              />
            ) : (
              <StandingsTab standings={standings} />
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
    </div>
  );
}
