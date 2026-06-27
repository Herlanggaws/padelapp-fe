"use client";

import { useState, useEffect, useRef } from "react";
import { fetchClubMembers } from "@/services/clubService";
import type { ClubMember } from "@/types/club";

interface ClubMembersBottomSheetProps {
  clubGuid: string;
  onClose: () => void;
}

const PAGE_SIZE = 5;

export default function ClubMembersBottomSheet({
  clubGuid,
  onClose,
}: ClubMembersBottomSheetProps) {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const clubGuidRef = useRef(clubGuid);

  // Animate in on mount + lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prev;
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const loadNextPage = async (reset = false) => {
    if (isFetchingRef.current) return;
    const currentPage = reset ? 1 : pageRef.current;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const res = await fetchClubMembers({
        club_guid: clubGuidRef.current,
        page: currentPage,
        limit: PAGE_SIZE,
      });
      const newMembers = res.data;
      if (reset) {
        setMembers(newMembers);
        pageRef.current = 2;
      } else {
        setMembers((prev) => [...prev, ...newMembers]);
        pageRef.current = currentPage + 1;
      }
      setHasMore(newMembers.length >= PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Initial load when clubGuid changes
  useEffect(() => {
    clubGuidRef.current = clubGuid;
    pageRef.current = 1;
    isFetchingRef.current = false;
    loadNextPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubGuid]);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
          loadNextPage(false);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[448px] mx-auto">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`relative bg-white rounded-t-[40px] flex flex-col transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxHeight: "80vh",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center py-4">
          <div className="w-12 h-[6px] rounded-full bg-[#E4E4E7]" />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pb-4"
          style={{ borderBottom: "1px solid #F4F4F5" }}
        >
          <h2
            className="font-semibold text-[28px] text-[#151C27]"
            style={{ lineHeight: "33.6px", letterSpacing: "-0.01em" }}
          >
            Club Members
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F5]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="#151C27"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Member List */}
        <div className="flex flex-col overflow-y-auto overscroll-contain px-6 py-4">
          {members.map((member) => (
            <div
              key={member.guid}
              className="flex items-center justify-between py-3"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full bg-[#F0F3FF] flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ border: "2px solid #E4E4E7" }}
                >
                  <svg
                    width="28"
                    height="28"
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
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className="font-bold text-base text-[#151C27]"
                    style={{ lineHeight: "24px" }}
                  >
                    {member.user.name}
                  </span>
                  <span
                    className="text-xs text-[#41493A]"
                    style={{ lineHeight: "12px" }}
                  >
                    {member.user.email}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Loading skeletons */}
          {isLoading &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex items-center gap-4 py-3 animate-pulse"
              >
                <div className="w-14 h-14 rounded-full bg-[#F4F4F5] flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-32 rounded bg-[#F4F4F5]" />
                  <div className="h-3 w-24 rounded bg-[#F4F4F5]" />
                </div>
              </div>
            ))}

          {/* Sentinel for infinite scroll — only shown when there are more items */}
          {hasMore && <div ref={sentinelRef} className="h-1" />}

          {/* Empty state */}
          {!isLoading && members.length === 0 && (
            <p className="text-center text-sm text-[#A1A1AA] py-8">
              No members found
            </p>
          )}

          {/* Bottom spacer */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
