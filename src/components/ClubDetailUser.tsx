"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import ClubPopupMenu from "@/components/ClubPopupMenu";
import ClubMembersBottomSheet from "@/components/ClubMembersBottomSheet";
import TopAppBar from "@/components/TopAppBar";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  fetchClubDetail,
  joinClub,
  leaveClub,
  fetchClubMembers,
} from "@/services/clubService";
import { fetchClubEvents } from "@/services/eventService";
import type {
  Club,
  ClubMember,
  JoinClubErrorResponse,
  LeaveClubErrorResponse,
} from "@/types/club";
import type { Event } from "@/types/event";

function ActivityCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl border border-[#F4F4F5] animate-pulse">
      <div className="w-12 h-12 rounded-[48px] bg-[#F0F3FF] shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-2/3 rounded bg-[#F4F4F5]" />
        <div className="h-3 w-1/2 rounded bg-[#F4F4F5]" />
      </div>
    </div>
  );
}

export default function ClubDetailUser() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [membersLoading, setMembersLoading] = useState(true);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showMembersSheet, setShowMembersSheet] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsPage, setEventsPage] = useState(1);
  const [eventsTotalPage, setEventsTotalPage] = useState(1);
  const [eventsLoading, setEventsLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingEventsRef = useRef(false);
  const clubGuidRef = useRef<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const loadEvents = useCallback(async (clubGuid: string, page: number) => {
    if (loadingEventsRef.current) return;
    loadingEventsRef.current = true;
    setEventsLoading(true);
    try {
      const res = await fetchClubEvents({
        club_guid: clubGuid,
        sort: "created_at",
        direction: "ASC",
        page,
        limit: 10,
      });
      setEvents((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setEventsTotalPage(res.paginate.total_page);
    } catch {
      // keep existing list on error
    } finally {
      setEventsLoading(false);
      loadingEventsRef.current = false;
    }
  }, []);

  const loadMembers = async (clubGuid: string) => {
    setMembersLoading(true);
    try {
      const res = await fetchClubMembers({
        club_guid: clubGuid,
        limit: 5,
        page: 1,
      });
      setMembers(res.data);
      setTotalMembers(res.paginate.total_data);
    } catch {
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!club || club.is_joined) return;
    setIsJoining(true);
    try {
      await joinClub(club.guid);
      setClub((prev) => (prev ? { ...prev, is_joined: true } : prev));
      showSnackbar("Successfully joined club");
      loadMembers(club.guid);
    } catch (err) {
      const e = err as JoinClubErrorResponse;
      showSnackbar(e?.message ?? "Failed to join club.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!club) return;
    setIsLeaving(true);
    try {
      await leaveClub(club.guid);
      setClub((prev) => (prev ? { ...prev, is_joined: false } : prev));
      showSnackbar("Successfully left the club");
      loadMembers(club.guid);
    } catch (err) {
      const e = err as LeaveClubErrorResponse;
      showSnackbar(e?.message ?? "Failed to leave club.");
    } finally {
      setIsLeaving(false);
      setShowLeaveConfirm(false);
    }
  };

  useEffect(() => {
    fetchClubDetail(id)
      .then((res) => {
        setClub(res.data);
        clubGuidRef.current = res.data.guid;
        loadMembers(res.data.guid);
        loadEvents(res.data.guid, 1);
      })
      .catch(() => router.replace("/not-found"));
  }, [id, router, loadEvents]);

  // Infinite scroll: observe sentinel, load next page when visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingEventsRef.current &&
          clubGuidRef.current
        ) {
          setEventsPage((prev) => {
            const next = prev + 1;
            if (next <= eventsTotalPage) {
              loadEvents(clubGuidRef.current!, next);
              return next;
            }
            return prev;
          });
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [eventsTotalPage, loadEvents]);

  if (!club) return null;

  const hasMoreEvents = eventsPage < eventsTotalPage;

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar
        showBack
        backHref="/clubs"
        title={club.name}
        showSettings={false}
        transparent
      />

      <main className="flex flex-col pb-10 pt-14">
        {/* Hero Section */}
        <div className="relative w-full h-[280px]">
          {club.cover_photo && (
            <Image
              src={club.cover_photo}
              alt="Club Cover"
              fill
              className="object-cover"
            />
          )}
          {/* Club Logo */}
          {club.logo && (
            <div
              className="absolute left-6 -bottom-12 w-24 h-24 rounded-full border-4 border-white overflow-hidden"
              style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
            >
              <Image
                src={club.logo}
                alt="Club Logo"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Club Info Section */}
        <div className="flex flex-col gap-4 px-6 pt-16 pb-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2
                className="font-semibold text-[28px] text-[#151C27]"
                style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
              >
                {club.name}
              </h2>
            </div>
            {/* <div className="flex items-center gap-1">
              <svg
                width="12"
                height="15"
                viewBox="0 0 12 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 0C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 10.5 6 15 6 15C6 15 12 10.5 12 6C12 4.4087 11.3679 2.88258 10.2426 1.75736C9.11742 0.632141 7.5913 0 6 0ZM6 8.25C5.40326 8.25 4.83097 8.01295 4.40901 7.59099C3.98705 7.16903 3.75 6.59674 3.75 6C3.75 5.40326 3.98705 4.83097 4.40901 4.40901C4.83097 3.98705 5.40326 3.75 6 3.75C6.59674 3.75 7.16903 3.98705 7.59099 4.40901C8.01295 4.83097 8.25 5.40326 8.25 6C8.25 6.59674 8.01295 7.16903 7.59099 7.59099C7.16903 8.01295 6.59674 8.25 6 8.25Z"
                  fill="#41493A"
                />
              </svg>
              <span
                className="text-xs text-[#41493A]"
                style={{ lineHeight: "12px" }}
              >
                District 4, Barcelona
              </span>
            </div> */}
          </div>

          <p
            className="text-sm text-[#41493A]"
            style={{ lineHeight: "22.75px" }}
          >
            {club.description}
          </p>

          <div className="flex justify-center pt-2">
            {club.is_joined ? (
              <button
                onClick={() => setShowLeaveConfirm(true)}
                disabled={isLeaving}
                className="w-full py-3 rounded-full text-base font-normal text-[#EF4444] bg-[#FEF2F2] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ lineHeight: "24px" }}
              >
                {isLeaving ? "Leaving..." : "Leave"}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="w-full py-3 rounded-full text-base font-normal text-[#121212] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#9FE870", lineHeight: "24px" }}
              >
                {isJoining ? "Joining..." : "Join"}
              </button>
            )}
          </div>
        </div>

        {/* Club Members Section */}
        {(membersLoading || members.length > 0) && (
          <div className="flex flex-col gap-4 mt-6 w-full overflow-hidden">
            <div className="flex items-center justify-between px-6">
              <h3
                className="font-semibold text-xl text-[#151C27]"
                style={{ lineHeight: "26px" }}
              >
                Club Members
              </h3>
              {totalMembers > 5 && (
                <button
                  className="text-xs font-semibold text-[#2F6C00]"
                  style={{ lineHeight: "12px" }}
                  onClick={() => setShowMembersSheet(true)}
                >
                  See all
                </button>
              )}
            </div>

            <div className="w-full overflow-hidden">
              <div className="flex gap-2 md:gap-3 px-6 overflow-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {membersLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-2 px-1 animate-pulse"
                      >
                        <div className="w-16 h-16 rounded-full bg-[#F4F4F5]" />
                        <div className="w-10 h-3 rounded bg-[#F4F4F5]" />
                      </div>
                    ))
                  : members.map((member) => (
                      <div
                        key={member.guid}
                        className="flex flex-col items-center gap-2 px-1"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-[#F4F4F5] flex items-center justify-center">
                          {member.user.profile_photo ? (
                            <Image
                              src={member.user.profile_photo}
                              alt={member.user.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#A1A1AA"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="8" r="4" />
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                          )}
                        </div>
                        <span
                          className="text-xs text-[#151C27] text-center w-16 truncate"
                          style={{ lineHeight: "12px" }}
                        >
                          {member.user.name}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Activities Section */}
        {(eventsLoading || events.length > 0) && <div className="flex flex-col gap-4 px-6 mt-8">
          <h3 className="text-xl text-[#151C27]" style={{ lineHeight: "26px" }}>
            Upcoming Activities
          </h3>

          <div className="flex flex-col gap-4">
            {eventsLoading && events.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ActivityCardSkeleton key={i} />
                ))
              : events.map((event) => {
                  const dt = new Date(event.date_time);
                  return (
                    <ActivityCard
                      key={event.guid}
                      day={String(dt.getUTCDate()).padStart(2, "0")}
                      month={dt
                        .toLocaleString("en-US", {
                          month: "short",
                          timeZone: "UTC",
                        })
                        .toUpperCase()}
                      title={event.name}
                      subtitle={event.description}
                      link={`/events/${event.guid}`}
                    />
                  );
                })}

            {/* Inline skeleton rows while fetching next page */}
            {eventsLoading && events.length > 0 && (
              <ActivityCardSkeleton />
            )}

            {/* Sentinel div — triggers next page load when scrolled into view */}
            {hasMoreEvents && <div ref={sentinelRef} className="h-1" />}
          </div>
        </div>}

        {/* FAB Button */}
        {club.is_joined && (
          <div className="fixed bottom-4 right-4 max-w-[448px] mx-auto">
            <button
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "#9FE870" }}
              onClick={() => setShowBottomSheet(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Bottom Sheet Overlay */}
      {showBottomSheet && (
        <ClubPopupMenu
          onClose={() => setShowBottomSheet(false)}
          clubGuid={club.guid}
          clubId={id}
        />
      )}

      {/* Club Members Bottom Sheet */}
      {showMembersSheet && (
        <ClubMembersBottomSheet
          clubGuid={club.guid}
          onClose={() => setShowMembersSheet(false)}
        />
      )}

      {/* Leave Confirmation Dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#151C27]">Leave Club</h3>
            <p className="text-sm text-[#41493A]">
              Are you sure you want to leave{" "}
              <span className="font-semibold">{club.name}</span>? You can rejoin
              later.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                disabled={isLeaving}
                className="flex-1 py-3 rounded-full text-base text-[#18181B] bg-[#F4F4F5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleLeave}
                disabled={isLeaving}
                className="flex-1 py-3 rounded-full text-base text-white bg-[#EF4444] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLeaving ? "Leaving..." : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
