"use client";

import { useState } from "react";
import Image from "next/image";

type ScoreType = "Total Set Point" | "Race to X Point";

const totalSetPointRows: number[][] = [
  [4, 8, 12, 16],
  [21, 24, 32],
];

const raceToXPointRows: number[][] = [[3, 4, 5, 6, 7]];

interface Player {
  id: string;
  name: string;
  avatarSeed: string;
}

interface CourtTeams {
  courtNumber: number;
  isPro?: boolean;
  teamA: (Player | null)[];
  teamB: (Player | null)[];
}

const initialCourts: CourtTeams[] = [
  {
    courtNumber: 1,
    isPro: true,
    teamA: [
      { id: "alex", name: "Alex G.", avatarSeed: "alex" },
      { id: "sarah", name: "Sarah L.", avatarSeed: "sarah" },
    ],
    teamB: [{ id: "marc", name: "Marc V.", avatarSeed: "marc" }, null],
  },
  {
    courtNumber: 2,
    teamA: [
      { id: "elena", name: "Elena R.", avatarSeed: "elena" },
      { id: "julian", name: "Julian M.", avatarSeed: "julian" },
    ],
    teamB: [null, null],
  },
];

const unassignedPlayers: Player[] = [
  { id: "sophia", name: "Sophia K.", avatarSeed: "sophia" },
  { id: "david", name: "David T.", avatarSeed: "david" },
  { id: "lina", name: "Lina B.", avatarSeed: "lina" },
  { id: "hugo", name: "Hugo P.", avatarSeed: "hugo" },
];

function PlayerSlot({
  player,
  isEmpty,
}: {
  player: Player | null;
  isEmpty?: boolean;
}) {
  if (!player || isEmpty) {
    return (
      <div
        className="flex items-center justify-center px-2 py-2 w-full"
        style={{
          border: "1px dashed #E4E4E7",
          borderRadius: "48px",
          minHeight: "44px",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase text-[#D4D4D8]"
          style={{ lineHeight: "15px" }}
        >
          DROP PLAYER
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between px-2 py-2 w-full bg-white border border-[#F4F4F5]"
      style={{ borderRadius: "48px" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: "2px solid #9FE870" }}
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
          className="text-base font-medium text-[#151C27]"
          style={{ lineHeight: "24px" }}
        >
          {player.name}
        </span>
      </div>
      <button className="p-1">
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <circle cx="3" cy="3" r="1.5" fill="#A1A1AA" />
          <circle cx="7" cy="3" r="1.5" fill="#A1A1AA" />
          <circle cx="3" cy="8" r="1.5" fill="#A1A1AA" />
          <circle cx="7" cy="8" r="1.5" fill="#A1A1AA" />
          <circle cx="3" cy="13" r="1.5" fill="#A1A1AA" />
          <circle cx="7" cy="13" r="1.5" fill="#A1A1AA" />
        </svg>
      </button>
    </div>
  );
}

function CourtSection({ court }: { court: CourtTeams }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Court Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Court icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="1"
              y="1"
              width="12"
              height="12"
              rx="2"
              stroke="#18181B"
              strokeWidth="1.5"
            />
            <line
              x1="7"
              y1="1"
              x2="7"
              y2="13"
              stroke="#18181B"
              strokeWidth="1.5"
            />
            <line
              x1="1"
              y1="7"
              x2="13"
              y2="7"
              stroke="#18181B"
              strokeWidth="1.5"
            />
          </svg>
          <span
            className="text-base font-bold text-[#18181B]"
            style={{ lineHeight: "24px" }}
          >
            Court {court.courtNumber}
          </span>
        </div>
        {court.isPro && (
          <div
            className="px-2 py-0.5"
            style={{ background: "#9FE870", borderRadius: "9999px" }}
          >
            <span
              className="text-[10px] font-bold uppercase text-[#2E6900]"
              style={{ lineHeight: "15px" }}
            >
              PRO COURT
            </span>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="flex gap-4">
        {/* Team A */}
        <div className="flex-1 flex flex-col gap-2">
          <span
            className="text-[10px] font-bold uppercase text-[#A1A1AA] px-1"
            style={{ lineHeight: "15px" }}
          >
            TEAM A
          </span>
          <div className="flex flex-col gap-2">
            {court.teamA.map((player, i) => (
              <PlayerSlot key={i} player={player} />
            ))}
          </div>
        </div>

        {/* Team B */}
        <div className="flex-1 flex flex-col gap-2">
          <span
            className="text-[10px] font-bold uppercase text-[#A1A1AA] px-1"
            style={{ lineHeight: "15px" }}
          >
            TEAM B
          </span>
          <div className="flex flex-col gap-2">
            {court.teamB.map((player, i) => (
              <PlayerSlot key={i} player={player} isEmpty={player === null} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchOrganizerSetClient() {
  const [scoreType, setScoreType] = useState<ScoreType>("Total Set Point");
  const [selectedPoints, setSelectedPoints] = useState<number>(21);

  const pointOptionRows =
    scoreType === "Total Set Point" ? totalSetPointRows : raceToXPointRows;

  const handleScoreTypeChange = (option: ScoreType) => {
    if (option === scoreType) return;
    setScoreType(option);
    setSelectedPoints(option === "Total Set Point" ? 21 : 5);
  };

  return (
    <main className="flex flex-col gap-6 pb-32" style={{ paddingTop: "80px" }}>
      {/* Summary Cards */}
      <div className="flex gap-4 px-6">
        {/* Game Format Card */}
        <div
          className="flex-1 flex flex-col gap-2 p-4 bg-white border border-[#F4F4F5]"
          style={{ borderRadius: "16px" }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
            style={{ lineHeight: "15px" }}
          >
            GAME FORMAT
          </span>
          <div className="flex items-center gap-2">
            <svg width="8" height="15" viewBox="0 0 8 15" fill="none">
              <path d="M4 0L8 7.5L4 15L0 7.5L4 0Z" fill="#18181B" />
            </svg>
            <span
              className="text-base font-semibold text-[#18181B]"
              style={{ lineHeight: "24px" }}
            >
              Americano
            </span>
          </div>
        </div>

        {/* Courts Card */}
        <div
          className="flex-1 flex flex-col gap-2 p-4 bg-white border border-[#F4F4F5]"
          style={{ borderRadius: "16px" }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
            style={{ lineHeight: "15px" }}
          >
            COURTS
          </span>
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect
                x="0.75"
                y="0.75"
                width="13.5"
                height="13.5"
                rx="1.5"
                stroke="#18181B"
                strokeWidth="1.5"
              />
              <line
                x1="7.5"
                y1="0.75"
                x2="7.5"
                y2="14.25"
                stroke="#18181B"
                strokeWidth="1.5"
              />
              <line
                x1="0.75"
                y1="7.5"
                x2="14.25"
                y2="7.5"
                stroke="#18181B"
                strokeWidth="1.5"
              />
            </svg>
            <span
              className="text-base font-semibold text-[#18181B]"
              style={{ lineHeight: "24px", color: "#18181B" }}
            >
              2 Courts
            </span>
          </div>
        </div>
      </div>

      {/* Score Type Toggle */}
      <div className="flex flex-col gap-2 px-6">
        <div className="px-1">
          <span
            className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
            style={{ lineHeight: "15px" }}
          >
            SCORE TYPE
          </span>
        </div>
        <div
          className="flex items-center p-1"
          style={{ background: "#E5E2E1", borderRadius: "9999px" }}
        >
          {(["Total Set Point", "Race to X Point"] as ScoreType[]).map(
            (option) => {
              const isActive = scoreType === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleScoreTypeChange(option)}
                  className={`flex-1 py-2 text-center transition-all ${
                    isActive ? "bg-white border border-[#F4F4F5]" : ""
                  }`}
                  style={{
                    borderRadius: "9999px",
                    color: isActive ? "#18181B" : "#71717A",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    boxShadow: isActive
                      ? "0px 1px 2px 0px rgba(0,0,0,0.05)"
                      : "none",
                  }}
                >
                  {option}
                </button>
              );
            },
          )}
        </div>

        {/* Point Options */}
        <div className="flex flex-col gap-2">
          {pointOptionRows.map((row) => (
            <div key={row.join("-")} className="flex gap-2">
              {row.map((pts) => {
                const isSelected = selectedPoints === pts;
                return (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setSelectedPoints(pts)}
                    className="flex-1 py-2 px-6 text-center transition-all"
                    style={{
                      borderRadius: "9999px",
                      background: isSelected ? "#18181B" : "#FFFFFF",
                      border: isSelected
                        ? "1px solid #18181B"
                        : "1px solid #F4F4F5",
                      color: isSelected ? "#9FE870" : "#151C27",
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "12px",
                    }}
                  >
                    {pts}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Courts Interactive Area */}
      <div className="flex flex-col gap-6 px-6">
        {initialCourts.map((court) => (
          <CourtSection key={court.courtNumber} court={court} />
        ))}
      </div>

      {/* Unassigned Players Section */}
      <div
        className="mx-6 flex flex-col gap-4 p-4 border border-[#F4F4F5]"
        style={{
          background: "rgba(244, 244, 245, 0.5)",
          borderRadius: "24px",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="px-1">
            <span
              className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
              style={{ lineHeight: "15px" }}
            >
              UNASSIGNED PLAYERS ({unassignedPlayers.length})
            </span>
          </div>
          <button>
            <svg width="14" height="7" viewBox="0 0 14 7" fill="none">
              <path
                d="M1 1L7 6L13 1"
                stroke="#A1A1AA"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Player chips */}
        <div className="flex flex-wrap gap-2">
          {unassignedPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E4E4E7]"
              style={{
                borderRadius: "9999px",
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
              }}
            >
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={`https://picsum.photos/seed/${player.avatarSeed}/24/24`}
                  alt={player.name}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="text-xs font-medium text-[#151C27]"
                style={{ lineHeight: "18px" }}
              >
                {player.name}
              </span>
              <button className="p-0.5">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <circle cx="1.5" cy="2" r="1" fill="#A1A1AA" />
                  <circle cx="4.5" cy="2" r="1" fill="#A1A1AA" />
                  <circle cx="1.5" cy="5" r="1" fill="#A1A1AA" />
                  <circle cx="4.5" cy="5" r="1" fill="#A1A1AA" />
                  <circle cx="1.5" cy="8" r="1" fill="#A1A1AA" />
                  <circle cx="4.5" cy="8" r="1" fill="#A1A1AA" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
