"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type TabType = "Matches" | "Standings";

// ─── Match Tab ───────────────────────────────────────────────────────────────

interface MatchPlayer {
  name: string;
  avatarSeed: string;
  side: "left" | "right";
}

interface MatchCard {
  id: number;
  court: string;
  time: string;
  isLive?: boolean;
  isFeatured?: boolean;
  teamA: MatchPlayer[];
  teamB: MatchPlayer[];
  scoreA: string;
  scoreB: string;
  round?: string; // "Winner M1" / "Winner M2" for TBD
}

interface Round {
  label: string;
  badge: string;
  matches: MatchCard[];
}

const rounds: Round[] = [
  {
    label: "Round 1",
    badge: "Quarter Finals",
    matches: [
      {
        id: 1,
        court: "Court 1",
        time: "10:30 AM",
        teamA: [
          { name: "Alex M.", avatarSeed: "alexm", side: "left" },
          { name: "David K.", avatarSeed: "davidk", side: "left" },
        ],
        teamB: [
          { name: "Marc J.", avatarSeed: "marcj", side: "right" },
          { name: "Leo R.", avatarSeed: "leor", side: "right" },
        ],
        scoreA: "6",
        scoreB: "4",
      },
      {
        id: 2,
        court: "Center Court",
        time: "LIVE",
        isLive: true,
        isFeatured: true,
        teamA: [
          { name: "Sarah W.", avatarSeed: "sarahw", side: "left" },
          { name: "Emma L.", avatarSeed: "emmal", side: "left" },
        ],
        teamB: [
          { name: "Julia V.", avatarSeed: "juliav", side: "right" },
          { name: "Sia K.", avatarSeed: "siak", side: "right" },
        ],
        scoreA: "3",
        scoreB: "2",
      },
    ],
  },
  {
    label: "Round 2",
    badge: "Semi Finals",
    matches: [
      {
        id: 3,
        court: "TBD",
        time: "Tomorrow",
        teamA: [],
        teamB: [],
        scoreA: "",
        scoreB: "",
        round: "tbd",
      },
    ],
  },
];

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

function MatchCardComponent({ match }: { match: MatchCard }) {
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
      {/* Header */}
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

      {/* Players & Score */}
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
          {/* Team A */}
          <div className="flex-1 flex flex-col gap-3">
            {match.teamA.map((p) => (
              <PlayerRow key={p.name} player={p} isFeatured={isFeatured} />
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-10 h-12 flex items-center justify-center"
              style={{
                background: isFeatured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
                borderRadius: "6px",
              }}
            >
              <span
                className={`text-base font-normal ${isFeatured ? "text-[#18181B]" : "text-[#18181B]"}`}
              >
                {match.scoreA}
              </span>
            </div>
            <span
              className={`text-base font-bold ${isFeatured ? "text-[#18181B]" : "text-[#D4D4D8]"}`}
              style={{ lineHeight: "24px" }}
            >
              -
            </span>
            <div
              className="w-10 h-12 flex items-center justify-center"
              style={{
                background: isFeatured ? "rgba(255,255,255,0.2)" : "#F0F3FF",
                borderRadius: "6px",
              }}
            >
              <span
                className={`text-base font-normal ${isFeatured ? "text-[#18181B]" : "text-[#18181B]"}`}
              >
                {match.scoreB}
              </span>
            </div>
          </div>

          {/* Team B */}
          <div className="flex-1 flex flex-col gap-3 items-end">
            {match.teamB.map((p) => (
              <PlayerRow key={p.name} player={p} isFeatured={isFeatured} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MatchesTab() {
  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      {rounds.map((round) => (
        <div key={round.label} className="flex flex-col gap-4">
          {/* Round header */}
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

          {/* Match cards */}
          <div
            className="flex flex-col gap-4"
            style={{ opacity: round.label === "Round 2" ? 0.6 : 1 }}
          >
            {round.matches.map((match) => (
              <MatchCardComponent key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Standings Tab ────────────────────────────────────────────────────────────

interface StandingRow {
  rank: number;
  name: string;
  avatarSeed: string;
  mp: number;
  wins: number;
  pts: number;
  winPct: string;
  pPct: string;
  isUser?: boolean;
  isPlaceholder?: boolean;
}

const standings: StandingRow[] = [
  {
    rank: 1,
    name: "Carlos Alcaraz",
    avatarSeed: "carlos",
    mp: 12,
    wins: 11,
    pts: 2450,
    winPct: "92%",
    pPct: "88%",
  },
  {
    rank: 2,
    name: "Marcus Nilsson",
    avatarSeed: "marcus",
    mp: 12,
    wins: 10,
    pts: 2120,
    winPct: "83%",
    pPct: "81%",
  },
  {
    rank: 3,
    name: "Elena Rossi",
    avatarSeed: "elena",
    mp: 12,
    wins: 9,
    pts: 1980,
    winPct: "75%",
    pPct: "79%",
  },
  {
    rank: 12,
    name: "You",
    avatarSeed: "user",
    mp: 10,
    wins: 6,
    pts: 1240,
    winPct: "60%",
    pPct: "55%",
    isUser: true,
  },
  {
    rank: 13,
    name: "Liam Smith",
    avatarSeed: "liam",
    mp: 10,
    wins: 5,
    pts: 1180,
    winPct: "45%",
    pPct: "50%",
    isPlaceholder: true,
  },
];

function StandingsTab() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Your Rank Card */}
      <div className="px-4 pt-4">
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ background: "#9FE870", borderRadius: "32px" }}
        >
          <div className="flex flex-col gap-1">
            <span
              className="text-xs uppercase tracking-[5%] text-[rgba(46,105,0,0.7)]"
              style={{ lineHeight: "12px" }}
            >
              YOUR RANK
            </span>
            <span
              className="text-[28px] font-semibold text-[#2E6900]"
              style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
            >
              #12
            </span>
          </div>
          <div
            className="flex items-center gap-1 px-3 py-2"
            style={{
              background: "rgba(255,255,255,0.3)",
              backdropFilter: "blur(12px)",
              borderRadius: "32px",
            }}
          >
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M10 0L20 12H0L10 0Z" fill="#2E6900" />
            </svg>
            <span
              className="text-xs font-semibold text-[#2E6900]"
              style={{ lineHeight: "12px" }}
            >
              +4 Slots
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div
        className="mx-4 border border-[#F4F4F5]"
        style={{ borderRadius: "32px" }}
      >
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#FAFAFA]">
          <span
            className="text-xs font-semibold uppercase text-[#18181B]"
            style={{ lineHeight: "12px" }}
          >
            SEASON STANDINGS
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

        {/* Column Headers */}
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
              PLAYER
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

        {/* Rows */}
        <div className="flex flex-col">
          {standings.map((row, idx) => {
            const isUser = row.isUser;
            const isPlaceholder = row.isPlaceholder;
            return (
              <div
                key={row.rank}
                className="flex items-center"
                style={{
                  background: isUser ? "rgba(159,232,112,0.2)" : "transparent",
                  borderTop: idx > 0 ? "1px solid #FAFAFA" : "none",
                  borderLeft: isUser ? "4px solid #FAFAFA" : "none",
                  opacity: isPlaceholder ? 0.6 : 1,
                }}
              >
                {/* Rank */}
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

                {/* Player */}
                <div className="flex-1 px-2 py-3 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{
                      border: isUser
                        ? "2px solid #2F6C00"
                        : "1px solid #F4F4F5",
                    }}
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
                    className="text-sm font-normal text-[#18181B]"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.name}
                  </span>
                </div>

                {/* MP */}
                <div className="w-[61px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#52525B]"
                    style={{ lineHeight: "21px" }}
                  >
                    {row.mp}
                  </span>
                </div>

                {/* Wins */}
                <div className="w-[57px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#52525B]"
                    style={{ lineHeight: "21px" }}
                  >
                    {isPlaceholder ? row.wins : row.wins}
                  </span>
                </div>

                {/* PTS */}
                <div className="w-[94px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#2F6C00]"
                    style={{ lineHeight: "21px" }}
                  >
                    {isPlaceholder
                      ? row.pts.toLocaleString()
                      : row.pts.toLocaleString()}
                  </span>
                </div>

                {/* W% */}
                <div className="w-[80px] px-2 py-5 text-center">
                  <span
                    className="text-sm font-normal text-[#52525B]"
                    style={{ lineHeight: "21px" }}
                  >
                    {isPlaceholder ? row.winPct : row.winPct}
                  </span>
                </div>

                {/* P% */}
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

        {/* View Full Rankings */}
        <div className="px-4 py-4" style={{ background: "#FAFAFA" }}>
          <button className="flex items-center justify-center gap-1 w-full">
            <span
              className="text-xs font-semibold text-[#18181B]"
              style={{ lineHeight: "12px" }}
            >
              View Full Rankings
            </span>
            <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
              <path
                d="M1 1L4.5 5L8 1"
                stroke="#18181B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Key Performance Indices */}
      <div className="flex flex-col gap-2 px-4">
        <span
          className="text-xs font-semibold uppercase text-[#A1A1AA]"
          style={{ lineHeight: "12px" }}
        >
          KEY PERFORMANCE INDICES
        </span>
        <div
          className="relative overflow-hidden px-4 py-4"
          style={{ background: "#18181B", borderRadius: "32px" }}
        >
          {/* Decorative element */}
          <div
            className="absolute right-4 top-4 opacity-10"
            style={{ width: "75px", height: "75px" }}
          >
            <svg width="75" height="75" viewBox="0 0 75 75" fill="none">
              <circle
                cx="37.5"
                cy="37.5"
                r="36"
                stroke="white"
                strokeWidth="3"
              />
              <circle
                cx="37.5"
                cy="37.5"
                r="24"
                stroke="white"
                strokeWidth="3"
              />
              <circle
                cx="37.5"
                cy="37.5"
                r="12"
                stroke="white"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <span
              className="text-xs font-normal text-[#A1A1AA]"
              style={{ lineHeight: "12px" }}
            >
              Win Rate Delta
            </span>
            <div className="flex items-end gap-2">
              <span
                className="text-[28px] font-semibold text-white"
                style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
              >
                +12.5%
              </span>
              <div className="flex items-center gap-1 pb-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L11 11H1L6 1Z" fill="#9FE870" />
                </svg>
                <span
                  className="text-sm font-normal text-[#9FE870]"
                  style={{ lineHeight: "21px" }}
                >
                  vs last week
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MatchDetailClient() {
  const [activeTab, setActiveTab] = useState<TabType>("Matches");

  return (
    <>
      {/* Tab Switcher */}
      <div
        className="flex items-center gap-4 px-6 py-4 bg-white"
        style={{ borderBottom: "none" }}
      >
        {(["Matches", "Standings"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-center transition-all"
              style={{
                borderRadius: "9999px",
                background: isActive ? "#FFFFFF" : "transparent",
                border: isActive ? "none" : "none",
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

      {/* Tab Content */}
      {activeTab === "Matches" ? <MatchesTab /> : <StandingsTab />}
    </>
  );
}
