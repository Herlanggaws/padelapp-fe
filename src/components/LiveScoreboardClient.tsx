"use client";

import Image from "next/image";
import { useLiveScoreboard } from "@/hooks/useLiveScoreboard";
import type {
  LiveScoreboardConnectionStatus,
  LiveScoreboardMatch,
  LiveScoreboardPlayer,
  LiveScoreboardRound,
  LiveScoreboardStandingRow,
} from "@/types/scoreboard";

function formatEventDateTime(dateTime: string) {
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatScoreDiff(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function formatScore(score: number | null) {
  return score == null ? "—" : String(score);
}

function humanizeRoundStatus(status: string) {
  return status
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function connectionLabel(status: LiveScoreboardConnectionStatus) {
  switch (status) {
    case "live":
      return "LIVE";
    case "reconnecting":
      return "Reconnecting…";
    case "error":
      return "Disconnected";
    default:
      return "Connecting…";
  }
}

function playerNames(players: LiveScoreboardPlayer[]) {
  return players.map((p) => p.name).join(" & ");
}

interface HistoricalMatchItem {
  key: string;
  roundNumber: number;
  match: LiveScoreboardMatch;
}

function flattenHistoricalMatches(
  rounds: LiveScoreboardRound[],
): HistoricalMatchItem[] {
  return [...rounds]
    .sort((a, b) => b.round_number - a.round_number)
    .flatMap((round) =>
      (Array.isArray(round.matches) ? round.matches : []).map((match, idx) => ({
        key: match.guid || `${round.guid}-match-${idx}`,
        roundNumber: round.round_number,
        match,
      })),
    );
}

function PlayerAvatar({
  player,
  featured,
  size = "md",
}: {
  player: LiveScoreboardPlayer;
  featured?: boolean;
  size?: "sm" | "md";
}) {
  const photo = player.profile_photo?.trim();
  const px = size === "sm" ? 20 : 24;
  return (
    <div
      className="rounded-full overflow-hidden shrink-0"
      style={{
        width: px,
        height: px,
        border: `1.5px solid ${featured ? "#18181B" : "#9FE870"}`,
      }}
    >
      {photo ? (
        <Image
          src={photo}
          alt={player.name}
          width={px}
          height={px}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: "#E4E4E7" }}
        >
          <span
            className="font-semibold"
            style={{ color: "#52525B", fontSize: size === "sm" ? 9 : 10 }}
          >
            {(player.name ?? "?").charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

function PlayerNameRow({
  player,
  featured,
  align = "left",
  size = "md",
}: {
  player: LiveScoreboardPlayer;
  featured?: boolean;
  align?: "left" | "right";
  size?: "sm" | "md";
}) {
  const isRight = align === "right";
  return (
    <div
      className={`flex items-center gap-1.5 ${isRight ? "flex-row-reverse" : ""}`}
    >
      <PlayerAvatar player={player} featured={featured} size={size} />
      <span
        className="font-medium truncate text-[#18181B]"
        style={{
          fontSize: size === "sm" ? 11 : 12,
          lineHeight: size === "sm" ? "14px" : "16px",
        }}
      >
        {player.name}
      </span>
    </div>
  );
}

function MatchCard({
  match,
  featured,
  isLive,
  size = "md",
}: {
  match: LiveScoreboardMatch;
  featured?: boolean;
  isLive?: boolean;
  size?: "sm" | "md";
}) {
  const teamA = match.team_a?.players ?? [];
  const teamB = match.team_b?.players ?? [];
  const compact = size === "sm";

  return (
    <div
      className={`flex flex-col ${compact ? "gap-2 p-2.5" : "gap-2.5 p-3"}`}
      style={{
        background: featured ? "#9FE870" : "#FFFFFF",
        border: `1px solid ${featured ? "#18181B" : "#F2F2F2"}`,
        borderRadius: compact ? "16px" : "20px",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={`font-normal ${featured ? "text-[#18181B]" : "text-[#5F5E5E]"}`}
          style={{ fontSize: 10, lineHeight: "12px" }}
        >
          Court {match.court_number}
        </span>
        {isLive ? (
          <span
            className={`font-bold ${featured ? "text-[#18181B]" : "text-[#5F5E5E]"}`}
            style={{ fontSize: 10, lineHeight: "12px" }}
          >
            LIVE
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5">
        <div className={`flex-1 flex flex-col min-w-0 ${compact ? "gap-1" : "gap-1.5"}`}>
          {teamA.map((p, idx) => (
            <PlayerNameRow
              key={`${match.guid}-a-${p.guid || idx}`}
              player={p}
              featured={featured}
              align="left"
              size={size}
            />
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div
            className={`flex items-center justify-center ${compact ? "w-7 h-8" : "w-8 h-9"}`}
            style={{
              background: featured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
              borderRadius: "4px",
            }}
          >
            <span
              className="font-normal text-[#18181B]"
              style={{ fontSize: compact ? 12 : 13 }}
            >
              {formatScore(match.team_a_score)}
            </span>
          </div>
          <span
            className={`font-bold ${featured ? "text-[#18181B]" : "text-[#D4D4D8]"}`}
            style={{ fontSize: 12 }}
          >
            -
          </span>
          <div
            className={`flex items-center justify-center ${compact ? "w-7 h-8" : "w-8 h-9"}`}
            style={{
              background: featured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
              borderRadius: "4px",
            }}
          >
            <span
              className="font-normal text-[#18181B]"
              style={{ fontSize: compact ? 12 : 13 }}
            >
              {formatScore(match.team_b_score)}
            </span>
          </div>
        </div>

        <div className={`flex-1 flex flex-col min-w-0 ${compact ? "gap-1" : "gap-1.5"}`}>
          {teamB.map((p, idx) => (
            <PlayerNameRow
              key={`${match.guid}-b-${p.guid || idx}`}
              player={p}
              featured={featured}
              align="right"
              size={size}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RoundSection({
  round,
  title,
  featured,
  size = "md",
}: {
  round: LiveScoreboardRound;
  title?: string;
  featured?: boolean;
  size?: "sm" | "md";
}) {
  const isLive = round.status === "in_progress";
  const matches = Array.isArray(round.matches) ? round.matches : [];
  const byes = Array.isArray(round.byes) ? round.byes : [];
  const compact = size === "sm";

  return (
    <section
      className={`flex flex-col ${compact ? "gap-2 p-2.5" : "gap-2.5 p-3"}`}
      style={{
        background: featured ? "#9FE870" : "#FAFAFA",
        border: `1px solid ${featured ? "#18181B" : "#F4F4F5"}`,
        borderRadius: compact ? "16px" : "20px",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {title ? (
            <span
              className="font-semibold uppercase tracking-wider text-[#2E6900]/70 shrink-0"
              style={{ fontSize: 9, lineHeight: "11px" }}
            >
              {title}
            </span>
          ) : null}
          <h2
            className="font-semibold text-[#18181B] truncate"
            style={{
              fontSize: compact ? 13 : 15,
              lineHeight: compact ? "16px" : "20px",
              letterSpacing: "-0.01em",
            }}
          >
            Round {round.round_number}
          </h2>
        </div>
        <span
          className="font-semibold px-2 py-0.5 shrink-0"
          style={{
            background: featured ? "rgba(255,255,255,0.35)" : "#FFFFFF",
            border: `1px solid ${featured ? "#18181B" : "#E4E4E7"}`,
            borderRadius: "999px",
            color: "#18181B",
            fontSize: 9,
            lineHeight: "11px",
          }}
        >
          {humanizeRoundStatus(round.status)}
        </span>
      </div>

      {matches.length === 0 ? (
        <p className="text-center text-[#71717A]" style={{ fontSize: 11 }}>
          No matches in this round yet.
        </p>
      ) : (
        <div
          className={`grid grid-cols-1 gap-2 ${compact ? "" : "xl:grid-cols-2"}`}
        >
          {matches.map((match, idx) => (
            <MatchCard
              key={match.guid || `${round.guid}-match-${idx}`}
              match={match}
              featured={featured}
              isLive={isLive}
              size={size}
            />
          ))}
        </div>
      )}

      {byes.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="font-semibold uppercase text-[#52525B]"
            style={{ fontSize: 9, lineHeight: "11px" }}
          >
            Byes
          </span>
          {byes.map((bye, idx) => {
            const player = bye.player;
            if (!player) return null;
            return (
              <div
                key={player.guid || `${round.guid}-bye-${idx}`}
                className="flex items-center gap-1 px-1.5 py-0.5"
                style={{
                  background: featured ? "rgba(255,255,255,0.35)" : "#FFFFFF",
                  borderRadius: "999px",
                  border: `1px solid ${featured ? "#18181B" : "#F4F4F5"}`,
                }}
              >
                <PlayerAvatar player={player} featured={featured} size="sm" />
                <span
                  className="font-medium text-[#18181B]"
                  style={{ fontSize: 10 }}
                >
                  {player.name}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function HistoricalMatchCard({
  roundNumber,
  match,
}: {
  roundNumber: number;
  match: LiveScoreboardMatch;
}) {
  const teamA = playerNames(match.team_a?.players ?? []);
  const teamB = playerNames(match.team_b?.players ?? []);

  return (
    <div
      className="inline-flex flex-col gap-1 shrink-0 px-2.5 py-2"
      style={{
        minWidth: 180,
        maxWidth: 220,
        background: "#FFFFFF",
        border: "1px solid #E4E4E7",
        borderRadius: "12px",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-semibold text-[#18181B]"
          style={{ fontSize: 10, lineHeight: "12px" }}
        >
          R{roundNumber}
        </span>
        <span
          className="text-[#71717A]"
          style={{ fontSize: 9, lineHeight: "11px" }}
        >
          Court {match.court_number}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className="flex-1 min-w-0 truncate text-[#18181B] text-left"
          style={{ fontSize: 11, lineHeight: "14px" }}
          title={teamA}
        >
          {teamA || "—"}
        </span>
        <span
          className="shrink-0 font-semibold tabular-nums text-[#18181B]"
          style={{ fontSize: 11, lineHeight: "14px" }}
        >
          {formatScore(match.team_a_score)}-{formatScore(match.team_b_score)}
        </span>
        <span
          className="flex-1 min-w-0 truncate text-[#18181B] text-right"
          style={{ fontSize: 11, lineHeight: "14px" }}
          title={teamB}
        >
          {teamB || "—"}
        </span>
      </div>
    </div>
  );
}

function HistoricalRoundsMarquee({
  rounds,
}: {
  rounds: LiveScoreboardRound[];
}) {
  const items = flattenHistoricalMatches(rounds);
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="font-semibold uppercase tracking-wider text-[#A1A1AA]"
        style={{ fontSize: 9, lineHeight: "11px" }}
      >
        Previous rounds
      </span>
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
        }}
      >
        <div className="live-scoreboard-marquee flex w-max py-1">
          {[0, 1].map((copy) => (
            <div key={`hist-copy-${copy}`} className="flex gap-2 pr-2">
              {items.map((item) => (
                <HistoricalMatchCard
                  key={`${copy}-${item.key}`}
                  roundNumber={item.roundNumber}
                  match={item.match}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StandingsTable({ standings }: { standings: LiveScoreboardStandingRow[] }) {
  if (standings.length === 0) {
    return (
      <div
        className="border border-[#F4F4F5] px-3 py-4 text-center text-[#71717A]"
        style={{ borderRadius: "16px", fontSize: 11 }}
      >
        No standings available yet.
      </div>
    );
  }

  return (
    <div
      className="border border-[#F4F4F5] overflow-hidden"
      style={{ borderRadius: "16px", background: "#FFFFFF" }}
    >
      <div
        className="flex items-center justify-between px-2.5 py-2"
        style={{ borderBottom: "1px solid #FAFAFA" }}
      >
        <span
          className="font-semibold uppercase text-[#18181B]"
          style={{ fontSize: 9, lineHeight: "11px" }}
        >
          Standings
        </span>
        <span
          className="font-semibold uppercase text-[#A1A1AA]"
          style={{ fontSize: 9, lineHeight: "11px" }}
        >
          {standings.length} player{standings.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div
          className="flex items-center min-w-[440px]"
          style={{ background: "rgba(250,250,250,0.5)" }}
        >
          <div className="pl-2 pr-0.5 py-1.5" style={{ width: "40px" }}>
            <span className="uppercase text-[#A1A1AA]" style={{ fontSize: 9 }}>
              RK
            </span>
          </div>
          <div className="flex-1 pl-1 pr-0 py-1.5 min-w-0">
            <span className="uppercase text-[#A1A1AA]" style={{ fontSize: 9 }}>
              PLAYER
            </span>
          </div>
          {(["MP", "W", "D", "L", "+/-", "PTS"] as const).map((label) => (
            <div
              key={label}
              className={`px-0.5 py-1.5 text-center ${label === "PTS" ? "pr-2" : ""}`}
              style={{ width: label === "+/-" || label === "PTS" ? 32 : 24 }}
            >
              <span className="uppercase text-[#A1A1AA]" style={{ fontSize: 9 }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {standings.map((row, idx) => (
          <div
            key={`${row.rank}-${row.player.guid}`}
            className="flex items-center min-w-[440px]"
            style={{
              borderTop: idx > 0 ? "1px solid #FAFAFA" : "none",
            }}
          >
            <div
              className="flex items-center gap-0.5 py-1.5 pl-2 pr-0.5 shrink-0"
              style={{ width: "40px" }}
            >
              <span
                className="font-semibold text-[#18181B]"
                style={{ fontSize: 11 }}
              >
                {row.rank}
              </span>
              {row.rank <= 3 ? (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
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
              ) : null}
            </div>

            <div className="flex items-center gap-1.5 py-1.5 min-w-0 flex-1 pl-1 pr-0">
              <PlayerAvatar player={row.player} size="sm" />
              <span
                className="font-normal text-[#18181B] truncate"
                style={{ fontSize: 11 }}
              >
                {row.player.name}
              </span>
            </div>

            <div className="px-0.5 py-1.5 text-center shrink-0" style={{ width: 24 }}>
              <span className="text-[#52525B]" style={{ fontSize: 11 }}>
                {row.matches_played}
              </span>
            </div>
            <div className="px-0.5 py-1.5 text-center shrink-0" style={{ width: 24 }}>
              <span className="text-[#52525B]" style={{ fontSize: 11 }}>
                {row.wins}
              </span>
            </div>
            <div className="px-0.5 py-1.5 text-center shrink-0" style={{ width: 24 }}>
              <span className="text-[#52525B]" style={{ fontSize: 11 }}>
                {row.draws}
              </span>
            </div>
            <div className="px-0.5 py-1.5 text-center shrink-0" style={{ width: 24 }}>
              <span className="text-[#52525B]" style={{ fontSize: 11 }}>
                {row.losses}
              </span>
            </div>
            <div className="px-0.5 py-1.5 text-center shrink-0" style={{ width: 32 }}>
              <span className="text-[#2F6C00]" style={{ fontSize: 11 }}>
                {formatScoreDiff(row.score_diff)}
              </span>
            </div>
            <div
              className="px-0.5 py-1.5 text-center shrink-0 pr-2"
              style={{ width: 32 }}
            >
              <span className="font-semibold text-[#18181B]" style={{ fontSize: 11 }}>
                {row.total_points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveScoreboardClient({
  eventGuid,
}: {
  eventGuid: string;
}) {
  const { data, status, error } = useLiveScoreboard(eventGuid);
  const chipLabel = connectionLabel(status);
  const isLiveChip = status === "live";
  const historicalRounds = data?.historical_rounds ?? [];

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #F7FBF2 0%, #FFFFFF 40%, #F9F9FF 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-3 py-3 lg:px-5 lg:py-4">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="font-semibold uppercase tracking-wider text-[#2E6900]/70"
              style={{ fontSize: 9, lineHeight: "11px" }}
            >
              RallyRank Live
            </span>
            <h1
              className="font-semibold text-[#151C27] truncate"
              style={{ fontSize: 20, letterSpacing: "-0.02em", lineHeight: "24px" }}
            >
              {data?.event.name ?? "Live Scoreboard"}
            </h1>
            <p className="text-[#71717A]" style={{ fontSize: 11 }}>
              {data?.event.date_time
                ? formatEventDateTime(data.event.date_time)
                : status === "connecting"
                  ? "Connecting to live updates…"
                  : "Waiting for event data…"}
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1.5 self-start px-2.5 py-1"
            style={{
              background: isLiveChip ? "#9FE870" : "#F4F4F5",
              borderRadius: "999px",
              border: `1px solid ${isLiveChip ? "#18181B" : "#E4E4E7"}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isLiveChip
                  ? "#2E6900"
                  : status === "error"
                    ? "#EF4444"
                    : "#A1A1AA",
              }}
            />
            <span
              className="font-bold uppercase text-[#18181B]"
              style={{ fontSize: 9, lineHeight: "11px" }}
            >
              {chipLabel}
            </span>
          </div>
        </header>

        {error && !data ? (
          <div
            className="px-3 py-4 text-center text-[#BA1A1A] border border-[#FECACA]"
            style={{ borderRadius: "16px", background: "#FEF2F2", fontSize: 12 }}
          >
            {error}
          </div>
        ) : null}

        {!data && status !== "error" ? (
          <div
            className="px-3 py-8 text-center text-[#71717A] border border-[#F4F4F5]"
            style={{ borderRadius: "16px", background: "#FFFFFF", fontSize: 12 }}
          >
            Connecting to live scoreboard…
          </div>
        ) : null}

        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)] gap-3 lg:gap-4 items-start">
            <div className="flex flex-col gap-3">
              {data.live_round ? (
                <RoundSection
                  round={data.live_round}
                  featured={data.live_round.status === "in_progress"}
                />
              ) : null}

              {data.next_round ? (
                <RoundSection
                  round={data.next_round}
                  title="Up next"
                  size="sm"
                />
              ) : null}

              {historicalRounds.length > 0 ? (
                <HistoricalRoundsMarquee rounds={historicalRounds} />
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-3">
              <StandingsTable standings={data.standings ?? []} />
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}
