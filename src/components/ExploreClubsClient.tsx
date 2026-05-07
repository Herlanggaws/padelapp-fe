"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import SnackBar from "@/components/SnackBar";
import { fetchClubs, joinClub } from "@/services/clubService";
import type { Club, JoinClubErrorResponse } from "@/types/club";

const PAGE_LIMIT = 10;

export default function ExploreClubsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [joiningClubId, setJoiningClubId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const activeSearchRef = useRef(searchQuery);

  const loadClubs = useCallback(async (search: string, pageNum: number) => {
    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const result = await fetchClubs({
        ...(search ? { search } : {}),
        page: pageNum,
        limit: PAGE_LIMIT,
      });
      const incoming = result.data ?? [];
      setClubs((prev) => (pageNum === 1 ? incoming : [...prev, ...incoming]));
      const paginate = result.paginate;
      setHasMore(
        paginate
          ? pageNum < paginate.total_page
          : incoming.length === PAGE_LIMIT,
      );
    } catch {
      setError("Failed to load clubs. Please try again.");
    } finally {
      if (pageNum === 1) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  }, []);

  // Reset and search when query changes (debounced)
  useEffect(() => {
    activeSearchRef.current = searchQuery;
    const timer = setTimeout(() => {
      pageRef.current = 1;
      loadClubs(searchQuery, 1);
    }, 400);
    return () => clearTimeout(timer);
    // loadClubs is stable (useCallback with no deps), safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // IntersectionObserver triggers page increment
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isLoading
        ) {
          const next = pageRef.current + 1;
          pageRef.current = next;
          loadClubs(activeSearchRef.current, next);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, loadClubs]);

  const handleJoin = async (clubGuid: string) => {
    setJoiningClubId(clubGuid);
    try {
      await joinClub(clubGuid);
      setClubs((prev) =>
        prev.map((c) => (c.guid === clubGuid ? { ...c, is_member: true } : c)),
      );
      setSnackbar("Successfully joined club");
    } catch (err) {
      const e = err as JoinClubErrorResponse;
      setSnackbar(e?.message ?? "Failed to join club.");
    } finally {
      setJoiningClubId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar
        showBack
        title="Explore Clubs"
        backHref="/dashboard"
        showSettings={false}
      />

      <main className="flex flex-col gap-4 pt-[104px] pb-36 px-6">
        {/* Search Section */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            {/* Search icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search clubs by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-6 py-[18px] rounded-full border border-[#F4F4F5] bg-white text-base text-[#18181B] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[#9FE870] focus:border-transparent"
              style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
            />
          </div>
          {/* Filter icon */}
          {/* <button
            className="flex items-center justify-center w-12 h-12 rounded-full border border-[#F4F4F5] bg-white flex-shrink-0"
            style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
            aria-label="Filter"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#18181B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
          </button> */}
        </div>

        {/* Club List */}
        <div className="flex flex-col gap-4 pt-2">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full border border-[#F4F4F5] rounded-4xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-[#F4F4F5]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-5 bg-[#F4F4F5] rounded w-2/3" />
                  <div className="h-4 bg-[#F4F4F5] rounded w-1/3" />
                  <div className="h-10 bg-[#F4F4F5] rounded-full" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#A1A1AA] text-base">{error}</p>
              <button
                onClick={() => loadClubs(searchQuery, 1)}
                className="mt-4 px-6 py-2 bg-[#9FE870] text-[#18181B] rounded-full text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          ) : clubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="64" height="64" rx="32" fill="#FAFAFA" />
                <path
                  d="M17 39.5V37.5312C17 36.6354 17.4583 35.9062 18.375 35.3438C19.2917 34.7812 20.5 34.5 22 34.5C22.2708 34.5 22.5312 34.5052 22.7812 34.5156C23.0312 34.526 23.2708 34.5521 23.5 34.5938C23.2083 35.0312 22.9896 35.4896 22.8438 35.9688C22.6979 36.4479 22.625 36.9479 22.625 37.4688V39.5H17ZM24.5 39.5V37.4688C24.5 36.8021 24.6823 36.1927 25.0469 35.6406C25.4115 35.0885 25.9271 34.6042 26.5938 34.1875C27.2604 33.7708 28.0573 33.4583 28.9844 33.25C29.9115 33.0417 30.9167 32.9375 32 32.9375C33.1042 32.9375 34.1198 33.0417 35.0469 33.25C35.974 33.4583 36.7708 33.7708 37.4375 34.1875C38.1042 34.6042 38.6146 35.0885 38.9688 35.6406C39.3229 36.1927 39.5 36.8021 39.5 37.4688V39.5H24.5ZM41.375 39.5V37.4688C41.375 36.9271 41.3073 36.4167 41.1719 35.9375C41.0365 35.4583 40.8333 35.0104 40.5625 34.5938C40.7917 34.5521 41.026 34.526 41.2656 34.5156C41.5052 34.5052 41.75 34.5 42 34.5C43.5 34.5 44.7083 34.776 45.625 35.3281C46.5417 35.8802 47 36.6146 47 37.5312V39.5H41.375ZM32 32C30.9583 32 30.0729 31.6354 29.3438 30.9062C28.6146 30.1771 28.25 29.2917 28.25 28.25C28.25 27.1875 28.6146 26.2969 29.3438 25.5781C30.0729 24.8594 30.9583 24.5 32 24.5C33.0625 24.5 33.9531 24.8594 34.6719 25.5781C35.3906 26.2969 35.75 27.1875 35.75 28.25C35.75 29.2917 35.3906 30.1771 34.6719 30.9062C33.9531 31.6354 33.0625 32 32 32Z"
                  fill="#A1A1AA"
                />
              </svg>
              <p className="mt-4 text-base text-[#18181B]">No clubs found</p>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                Try a different search term
              </p>
            </div>
          ) : (
            clubs.map((club) => (
              <ClubCard
                key={club.guid}
                club={club}
                isJoining={joiningClubId === club.guid}
                onJoin={handleJoin}
              />
            ))
          )}

          {/* Infinite scroll sentinel */}
          {!isLoading && <div ref={sentinelRef} className="h-1" />}

          {/* Loading more skeletons */}
          {isLoadingMore &&
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={`more-${i}`}
                className="w-full border border-[#F4F4F5] rounded-4xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-[#F4F4F5]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-5 bg-[#F4F4F5] rounded w-2/3" />
                  <div className="h-4 bg-[#F4F4F5] rounded w-1/3" />
                  <div className="h-10 bg-[#F4F4F5] rounded-full" />
                </div>
              </div>
            ))}
        </div>
      </main>

      <BottomNavBar />

      {snackbar && (
        <SnackBar message={snackbar} onClose={() => setSnackbar(null)} />
      )}
    </div>
  );
}

interface ClubCardProps {
  club: Club;
  isJoining: boolean;
  onJoin: (guid: string) => void;
}

function ClubCard({ club, isJoining, onJoin }: ClubCardProps) {
  const memberCount = club.member_count ?? 0;
  const formattedMembers =
    memberCount >= 1000
      ? `${(memberCount / 1000).toFixed(1)}k+`
      : `${memberCount}`;
  const rating = club.rating ?? 0;

  return (
    <Link
      href={`/clubs/${club.guid}`}
      className="block w-full border border-[#F4F4F5] rounded-4xl overflow-hidden bg-white"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {club.cover_photo ? (
          <Image
            src={club.cover_photo}
            alt={club.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#E4E4E7]" />
        )}
        {/* Rating badge */}
        {rating > 0 && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
            }}
          >
            {/* Star icon */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="#18181B"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span
              className="text-xs text-[#18181B]"
              style={{ lineHeight: "16px" }}
            >
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-2 p-4">
        {/* Club Name */}
        <div>
          <h3
            className="text-base text-[#18181B]"
            style={{ lineHeight: "24px" }}
          >
            {club.name}
          </h3>
        </div>

        {/* Members row */}
        <div
          className="flex items-center gap-4 py-2"
          style={{
            borderTop: "1px solid #FAFAFA",
            borderBottom: "1px solid #FAFAFA",
          }}
        >
          <div className="flex flex-col">
            <span
              className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-[0.05em]"
              style={{ lineHeight: "15px" }}
            >
              MEMBERS
            </span>
            <span
              className="text-sm text-[#18181B]"
              style={{ lineHeight: "20px" }}
            >
              {formattedMembers}
            </span>
          </div>
          <div className="w-px h-6 bg-[#F4F4F5]" />
        </div>

        {/* Join Button */}
        <div className="pt-2">
          {club.is_member ? (
            <div className="w-full py-3 rounded-full bg-[#F4F4F5] flex items-center justify-center">
              <span className="text-base text-[#A1A1AA]">Joined</span>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                onJoin(club.guid);
              }}
              disabled={isJoining}
              className="w-full py-3 rounded-full bg-[#18181B] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-base text-[#9FE870]">
                {isJoining ? "Joining..." : "Join"}
              </span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
