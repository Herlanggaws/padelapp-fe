"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import { fetchPlayedEvents } from "@/services/eventService";
import type {
  PlayedEvent,
  PlayedEventPlayer,
  PlayedEventRound,
} from "@/types/event";

const PAGE_LIMIT = 10;

function formatToken(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "—";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function formatPlayedDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFinalPoints(points: number): string {
  return points > 0 ? `+${points}` : String(points);
}

function formatPlayerNames(players: PlayedEventPlayer[]): string {
  const names = players.map((player) => player.name.trim()).filter(Boolean);
  return names.length > 0 ? names.join(" · ") : "—";
}

function PlayedEventCardSkeleton() {
  return (
    <div className="border border-[#F2F2F2] rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="h-3 bg-[#F4F4F5] rounded w-24" />
      <div className="h-5 bg-[#F4F4F5] rounded w-3/4" />
      <div className="h-3 bg-[#F4F4F5] rounded w-1/2" />
      <div className="h-16 bg-[#F4F4F5] rounded-xl" />
    </div>
  );
}

function TeamNames({
  players,
  isViewer,
  align,
}: {
  players: PlayedEventPlayer[];
  isViewer: boolean;
  align: "left" | "right";
}) {
  return (
    <span
      className={`flex-1 text-xs font-medium min-w-0 ${
        align === "right" ? "text-right" : "text-left"
      } ${isViewer ? "text-[#2E6900]" : "text-[#151C27]"}`}
    >
      {formatPlayerNames(players)}
    </span>
  );
}

function ScoreBox({
  score,
  isViewer,
}: {
  score: number;
  isViewer: boolean;
}) {
  return (
    <span
      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold ${
        isViewer ? "bg-[#9FE870] text-[#2E6900]" : "bg-[#F0F3FF] text-[#151C27]"
      }`}
    >
      {score}
    </span>
  );
}

function PlayedRoundRow({ round }: { round: PlayedEventRound }) {
  if (!round.match) {
    return (
      <div className="flex items-center justify-between py-3 border-t border-[#F2F2F2]">
        <span className="text-xs text-[#5F5E5E]">Round {round.round_number}</span>
        <span className="text-xs capitalize text-[#5F5E5E]">
          {formatToken(round.status)}
        </span>
      </div>
    );
  }

  const match = round.match;
  const viewerIsA = match.viewer_side === "a";

  return (
    <div className="flex flex-col gap-2 py-3 border-t border-[#F2F2F2]">
      <span className="text-[10px] font-normal text-[#A1A1AA] tracking-[0.1em] uppercase">
        Round {round.round_number} · Court {match.court_number}
      </span>
      <div className="flex items-center gap-2">
        <TeamNames
          players={match.team_a.players}
          isViewer={viewerIsA}
          align="left"
        />
        <div className="flex items-center gap-1 shrink-0">
          <ScoreBox score={match.team_a_score} isViewer={viewerIsA} />
          <span className="text-xs font-bold text-[#D4D4D8]">–</span>
          <ScoreBox score={match.team_b_score} isViewer={!viewerIsA} />
        </div>
        <TeamNames
          players={match.team_b.players}
          isViewer={!viewerIsA}
          align="right"
        />
      </div>
    </div>
  );
}

function PlayedEventCard({ played }: { played: PlayedEvent }) {
  const { event, rank_points: rankPoints, rounds } = played;

  return (
    <article className="border border-[#F2F2F2] rounded-2xl bg-white p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-normal text-[#A1A1AA] tracking-[0.1em] uppercase">
            {formatToken(event.format)}
          </span>
          <h2 className="text-base font-semibold text-[#151C27] leading-6">
            {event.name}
          </h2>
          <span className="text-xs text-[#5F5E5E]">
            {event.club_name} · {formatPlayedDate(event.date_time)}
          </span>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-sm font-semibold text-[#151C27]">
            Rank {rankPoints.rank}
          </span>
          <span className="text-sm font-semibold text-[#2E6900]">
            {formatFinalPoints(rankPoints.final_points)}
          </span>
          <span className="text-[10px] text-[#A1A1AA]">
            {formatToken(rankPoints.session_tier)}
          </span>
        </div>
      </div>
      {rounds.map((round) => (
        <PlayedRoundRow key={round.round_guid} round={round} />
      ))}
    </article>
  );
}

export default function MatchHistoryClient() {
  const [events, setEvents] = useState<PlayedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const loadEvents = useCallback(async (pageNum: number) => {
    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const result = await fetchPlayedEvents({ page: pageNum, limit: PAGE_LIMIT });
      const incoming = result.data ?? [];
      setEvents((prev) => (pageNum === 1 ? incoming : [...prev, ...incoming]));
      setHasMore(pageNum < (result.paginate?.total_page ?? 1));
    } catch {
      if (pageNum === 1) setEvents([]);
      else pageRef.current = pageNum - 1;
      setError("Failed to load match history. Please try again.");
    } finally {
      if (pageNum === 1) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    pageRef.current = 1;
    loadEvents(1);
  }, [loadEvents]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isLoading &&
          !error
        ) {
          const next = pageRef.current + 1;
          pageRef.current = next;
          loadEvents(next);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, error, loadEvents]);

  function retry() {
    pageRef.current = 1;
    loadEvents(1);
  }

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar
        showBack
        backHref="/profile"
        title="Match History"
        showSettings={false}
      />

      <main className="flex flex-col gap-4 px-4 pt-24 pb-10">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <PlayedEventCardSkeleton key={index} />
          ))
        ) : error && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[#A1A1AA] text-base">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 px-6 py-2 bg-[#9FE870] text-[#18181B] rounded-full text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-base text-[#151C27]">No matches played yet</p>
          </div>
        ) : (
          events.map((played) => (
            <PlayedEventCard key={played.event.guid} played={played} />
          ))
        )}

        {!isLoading && <div ref={sentinelRef} className="h-1" />}

        {isLoadingMore &&
          Array.from({ length: 2 }).map((_, index) => (
            <PlayedEventCardSkeleton key={`more-${index}`} />
          ))}

        {error && events.length > 0 && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-sm text-[#A1A1AA]">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="px-6 py-2 bg-[#9FE870] text-[#18181B] rounded-full text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
