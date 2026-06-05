"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import { fetchEvents } from "@/services/eventService";
import type { UpcomingEvent } from "@/types/event";

type MatchStatus = "Requested" | "Waitlisted" | "Joining";

const statusColors: Record<MatchStatus, string> = {
  Requested: "#0F8BE8",
  Waitlisted: "#FFDD00",
  Joining: "#9FE870",
};

function mapJoinStatus(joinStatus: string): MatchStatus | null {
  switch (joinStatus.toLowerCase()) {
    case "pending":
      return "Requested";
    case "waitlisted":
      return "Waitlisted";
    case "approved":
      return "Joining";
    default:
      return null;
  }
}

function formatLevelRange(minLevel: number, maxLevel: number): string {
  return `LV ${minLevel}–${maxLevel}`;
}

function formatEventDate(dateTime: string): string {
  const d = new Date(dateTime);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function formatEventTime(dateTime: string): string {
  const d = new Date(dateTime);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatSlotsLeft(
  numberOfPlayers: number,
  numberOfParticipants: number,
): string {
  const slotsLeft = numberOfPlayers - numberOfParticipants;
  return `${slotsLeft} slot${slotsLeft === 1 ? "" : "s"} left`;
}

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

function MatchCardSkeleton() {
  return (
    <div className="bg-white border border-[#F4F4F5] rounded-[32px] p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E4E4E7] flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-3 bg-[#E4E4E7] rounded w-24" />
            <div className="h-4 bg-[#E4E4E7] rounded w-40" />
          </div>
        </div>
        <div className="h-6 bg-[#E4E4E7] rounded-full w-16" />
      </div>
      <div className="flex items-center gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 bg-[#E4E4E7] rounded w-10" />
            <div className="h-4 bg-[#E4E4E7] rounded w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchCard({ event }: { event: UpcomingEvent }) {
  const status = mapJoinStatus(event.join_status);

  return (
    <Link
      href={`/events/${event.guid}`}
      className="bg-white border border-[#F4F4F5] rounded-[32px] p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={`https://picsum.photos/seed/${event.guid}club/40/40`}
              alt={event.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-normal text-[#A1A1AA] tracking-[0.1em] uppercase leading-[15px]">
              {formatLevelRange(event.min_level, event.max_level)}
            </span>
            <h3 className="font-normal text-base text-[rgba(21, 28, 39, 1)] leading-6">
              {event.name}
            </h3>
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-base font-normal text-[#A1A1AA] leading-6">
            Date
          </span>
          <span className="text-base font-semibold text-[#151C27] leading-6">
            {formatEventDate(event.date_time)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-normal text-[#A1A1AA] leading-6">
            Time
          </span>
          <span className="text-base font-semibold text-[#151C27] leading-6">
            {formatEventTime(event.date_time)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-normal text-[#A1A1AA] leading-6">
            Slots
          </span>
          <span className="text-base font-semibold text-[#151C27] leading-6">
            {formatSlotsLeft(
              event.number_of_players,
              event.number_of_participants,
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function MatchesClient() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents({ page: 1, limit: 10 })
      .then((res) => {
        setEvents(res.data);
        setTotalCount(res.paginate.total_data);
      })
      .catch(() => {
        setEvents([]);
        setTotalCount(0);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar showNotification={true} />

      <main className="flex flex-col gap-4 pt-24 pb-36">
        <section className="flex flex-col gap-4">
          <div className="px-4">
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
        </section>

        <section className="flex items-center justify-between pt-2 px-4">
          <h2 className="font-normal text-base text-[#151C27] leading-6">
            Open Matches
          </h2>
          <span className="font-normal text-base text-[#A1A1AA] leading-6">
            {isLoading ? "—" : `${totalCount} Available`}
          </span>
        </section>

        <section className="flex flex-col gap-4 px-4">
          {isLoading && events.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <MatchCardSkeleton key={i} />
              ))
            : events.map((event) => (
                <MatchCard key={event.guid} event={event} />
              ))}

          {!isLoading && events.length === 0 && (
            <p className="text-center text-base text-[#A1A1AA] py-8">
              No open matches available.
            </p>
          )}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
