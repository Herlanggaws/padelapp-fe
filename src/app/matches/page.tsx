"use client";

import { useState } from "react";
import Image from "next/image";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

type MatchStatus = "Requested" | "Waitlisted" | "Joining";

interface Match {
  id: number;
  level: string;
  club: string;
  date: string;
  time: string;
  slots: string;
  status: MatchStatus;
}

const matches: Match[] = [
  {
    id: 1,
    level: "BEGINNER • 1.5",
    club: "The Beach Padel Club",
    date: "24 Oct",
    time: "17:00",
    slots: "3 slots left",
    status: "Requested",
  },
  {
    id: 2,
    level: "BEGINNER • 1.5",
    club: "The Beach Padel Club",
    date: "24 Oct",
    time: "17:00",
    slots: "3 slots left",
    status: "Waitlisted",
  },
  {
    id: 3,
    level: "BEGINNER • 1.5",
    club: "The Beach Padel Club",
    date: "24 Oct",
    time: "17:00",
    slots: "3 slots left",
    status: "Joining",
  },
  {
    id: 4,
    level: "BEGINNER • 1.5",
    club: "The Beach Padel Club",
    date: "24 Oct",
    time: "17:00",
    slots: "3 slots left",
    status: "Requested",
  },
];

const statusColors: Record<MatchStatus, string> = {
  Requested: "#0F8BE8",
  Waitlisted: "#FFDD00",
  Joining: "#9FE870",
};

const filterOptions = ["All Matches", "Competitive", "Open", "Mixed"];

function StatusBadge({ status }: { status: MatchStatus }) {
  const bg = statusColors[status];
  return (
    <span
      className="text-white text-[10px] font-normal rounded-full px-3 py-1 whitespace-nowrap text-shadow-2xs"
      style={{ backgroundColor: bg, color: "#FFFFFF", lineHeight: "15px" }}
    >
      {status}
    </span>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <div className="bg-white border border-[#F4F4F5] rounded-[32px] p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={`https://picsum.photos/seed/${match.id}club/40/40`}
              alt={match.club}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-normal text-[#A1A1AA] tracking-[0.1em] uppercase leading-[15px]">
              {match.level}
            </span>
            <h3 className="font-normal text-base text-[rgba(21, 28, 39, 1)] leading-6">
              {match.club}
            </h3>
          </div>
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Details */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-base font-normal text-[#A1A1AA] leading-6">
            Date
          </span>
          <span className="text-base font-semibold text-[#151C27] leading-6">
            {match.date}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-normal text-[#A1A1AA] leading-6">
            Time
          </span>
          <span className="text-base font-semibold text-[#151C27] leading-6">
            {match.time}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-normal text-[#A1A1AA] leading-6">
            Slots
          </span>
          <span className="text-base font-semibold text-[#151C27] leading-6">
            {match.slots}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  const [activeFilter, setActiveFilter] = useState("All Matches");

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar showNotification={true} />

      <main className="flex flex-col gap-4 pt-24 pb-36">
        {/* Search & Filter Bar */}
        <section className="flex flex-col gap-4">
          <div className="px-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search clubs or level..."
                className="w-full bg-white border border-[#F4F4F5] rounded-2xl py-[18px] pl-12 pr-4 text-base text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors font-[Lexend]"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
                    fill="#A1A1AA"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-2.5 text-base font-normal whitespace-nowrap leading-6 transition-colors ${
                    isActive
                      ? "bg-[#18181B] text-[#9FE870]"
                      : "bg-[#F4F4F5] text-[#52525B]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section Heading */}
        <section className="flex items-center justify-between pt-2 px-4">
          <h2 className="font-normal text-base text-[#151C27] leading-6">
            Open Matches
          </h2>
          <span className="font-normal text-base text-[#A1A1AA] leading-6">
            12 Available
          </span>
        </section>

        {/* Match List */}
        <section className="flex flex-col gap-4 px-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
