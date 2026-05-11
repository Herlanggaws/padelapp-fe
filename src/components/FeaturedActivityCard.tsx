"use client";

import Image from "next/image";

interface PlayerAvatar {
  src: string;
  alt?: string;
}

interface FeaturedActivityCardProps {
  type: string;
  title: string;
  date: string;
  time: string;
  players: PlayerAvatar[];
  extraPlayerCount?: number;
  onJoin?: () => void;
}

export default function FeaturedActivityCard({
  type,
  title,
  date,
  time,
  players,
  extraPlayerCount,
  onJoin,
}: FeaturedActivityCardProps) {
  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-2xl"
      style={{
        background: "#9FE870",
        border: "1px solid rgba(47,108,0,0.2)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold text-[#151C27] uppercase tracking-[5%] px-3 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.1)", lineHeight: "15px" }}
        >
          {type}
        </span>
        <div className="flex items-center">
          {players.map((player, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-[#9FE870] overflow-hidden"
              style={index > 0 ? { marginLeft: "-12px" } : undefined}
            >
              <Image
                src={player.src}
                alt={player.alt ?? "Player"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {extraPlayerCount != null && extraPlayerCount > 0 && (
            <div
              className="w-8 h-8 rounded-full bg-white border-2 border-[#9FE870] flex items-center justify-center"
              style={{ marginLeft: "-12px" }}
            >
              <span className="text-[10px] font-bold text-[#151C27]">
                +{extraPlayerCount}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-xl text-[#2E6900]" style={{ lineHeight: "26px" }}>
          {title}
        </h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 14C0.716667 14 0.479167 13.9042 0.2875 13.7125C0.0958333 13.5208 0 13.2833 0 13V3C0 2.71667 0.0958333 2.47917 0.2875 2.2875C0.479167 2.09583 0.716667 2 1 2H2V0H3.5V2H10.5V0H12V2H13C13.2833 2 13.5208 2.09583 13.7125 2.2875C13.9042 2.47917 14 2.71667 14 3V13C14 13.2833 13.9042 13.5208 13.7125 13.7125C13.5208 13.9042 13.2833 14 13 14H1ZM1 12.5H13V6H1V12.5Z"
                fill="rgba(46,105,0,0.8)"
              />
            </svg>
            <span
              className="text-xs"
              style={{ color: "rgba(46,105,0,0.8)", lineHeight: "12px" }}
            >
              {date}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15C3.36 15 0 11.64 0 7.5C0 3.36 3.36 0 7.5 0C11.64 0 15 3.36 15 7.5C15 11.64 11.64 15 7.5 15ZM7.5 1.5C4.185 1.5 1.5 4.185 1.5 7.5C1.5 10.815 4.185 13.5 7.5 13.5C10.815 13.5 13.5 10.815 13.5 7.5C13.5 4.185 10.815 1.5 7.5 1.5ZM7.5 3.75V7.5L10.5 9L9.75 10.245L6 8.25V3.75H7.5Z"
                fill="rgba(46,105,0,0.8)"
              />
            </svg>
            <span
              className="text-xs"
              style={{ color: "rgba(46,105,0,0.8)", lineHeight: "12px" }}
            >
              {time}
            </span>
          </div>
        </div>
      </div>

      <button
        className="w-full py-3 rounded-[48px] text-base font-normal text-[#9FE870]"
        style={{ background: "#121212", lineHeight: "24px" }}
        onClick={onJoin}
      >
        Join {type}
      </button>
    </div>
  );
}
