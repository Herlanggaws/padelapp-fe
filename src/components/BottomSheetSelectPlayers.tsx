"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchEventParticipants } from "@/services/eventService";
import type { EventParticipant } from "@/types/event";
import type { MatchConfigSelectedPlayer } from "@/types/matchmaking";

interface BottomSheetSelectPlayersProps {
  eventGuid: string;
  onClose: () => void;
  onNext: (players: MatchConfigSelectedPlayer[]) => void;
  title?: string;
  confirmLabel?: string;
  minSelection?: number;
  isSubmitting?: boolean;
}

const PAGE_SIZE = 10;

function toSelectedPlayer(participant: EventParticipant): MatchConfigSelectedPlayer {
  return {
    participant_guid: participant.guid,
    user_guid: participant.user_guid,
    name: participant.user.name,
    email: participant.user.email,
    profile_photo: participant.user.profile_photo,
  };
}

export default function BottomSheetSelectPlayers({
  eventGuid,
  onClose,
  onNext,
  title = "Select Players",
  confirmLabel = "Next",
  minSelection = 1,
  isSubmitting = false,
}: BottomSheetSelectPlayersProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [selectedGuids, setSelectedGuids] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const eventGuidRef = useRef(eventGuid);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
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
      const res = await fetchEventParticipants({
        event_guid: eventGuidRef.current,
        page: currentPage,
        limit: PAGE_SIZE,
      });
      const newParticipants = res.data;
      if (reset) {
        setParticipants(newParticipants);
        setSelectedGuids(new Set(newParticipants.map((p) => p.guid)));
        pageRef.current = 2;
      } else {
        setParticipants((prev) => [...prev, ...newParticipants]);
        setSelectedGuids((prev) => {
          const next = new Set(prev);
          for (const p of newParticipants) {
            next.add(p.guid);
          }
          return next;
        });
        pageRef.current = currentPage + 1;
      }
      setHasMore(newParticipants.length >= PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    eventGuidRef.current = eventGuid;
    pageRef.current = 1;
    isFetchingRef.current = false;
    loadNextPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventGuid]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current && hasMore) {
          loadNextPage(false);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore]);

  const toggleSelection = (guid: string) => {
    setSelectedGuids((prev) => {
      const next = new Set(prev);
      if (next.has(guid)) {
        next.delete(guid);
      } else {
        next.add(guid);
      }
      return next;
    });
  };

  const handleNext = () => {
    const selected = participants
      .filter((p) => selectedGuids.has(p.guid))
      .map(toSelectedPlayer);
    if (selected.length < minSelection) return;
    onNext(selected);
  };

  const selectedCount = selectedGuids.size;
  const canConfirm = selectedCount >= minSelection && !isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[448px] mx-auto">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      <div
        className={`relative bg-white flex flex-col transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          borderRadius: "40px 40px 0px 0px",
          boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxHeight: "80vh",
        }}
      >
        <div className="flex justify-center py-4">
          <div className="w-12 h-[6px] rounded-full bg-[#E4E4E7]" />
        </div>

        <div
          className="flex items-center justify-between px-6 pb-4"
          style={{ borderBottom: "1px solid #F4F4F5" }}
        >
          <h2
            className="font-semibold text-[28px] text-[#151C27]"
            style={{ lineHeight: "33.6px", letterSpacing: "-0.01em" }}
          >
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F5]"
            aria-label="Close"
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

        <div className="flex flex-col overflow-y-auto px-6 py-4 gap-6 flex-1 min-h-0">
          {participants.map((participant) => {
            const isSelected = selectedGuids.has(participant.guid);
            return (
              <button
                key={participant.guid}
                type="button"
                onClick={() => toggleSelection(participant.guid)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{
                      border: isSelected
                        ? "2px solid #2F6C00"
                        : "2px solid #E4E4E7",
                    }}
                  >
                    {participant.user.profile_photo ? (
                      <Image
                        src={participant.user.profile_photo}
                        alt={participant.user.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F0F3FF] flex items-center justify-center">
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
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-bold text-base text-[#151C27]"
                      style={{ lineHeight: "24px" }}
                    >
                      {participant.user.name}
                    </span>
                    <span
                      className="text-xs text-[#41493A]"
                      style={{ lineHeight: "12px" }}
                    >
                      {participant.user.email}
                    </span>
                  </div>
                </div>

                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    border: isSelected
                      ? "2px solid #9FE870"
                      : "2px solid #C1CAB5",
                    background: isSelected ? "#9FE870" : "transparent",
                  }}
                >
                  {isSelected && (
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5L4.5 8.5L11 1.5"
                        stroke="#121212"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}

          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex items-center gap-4 animate-pulse"
              >
                <div className="w-14 h-14 rounded-full bg-[#F4F4F5] flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-32 rounded bg-[#F4F4F5]" />
                  <div className="h-3 w-24 rounded bg-[#F4F4F5]" />
                </div>
              </div>
            ))}

          {hasMore && <div ref={sentinelRef} className="h-1" />}

          {!isLoading && participants.length === 0 && (
            <p className="text-center text-sm text-[#A1A1AA] py-8">
              No players yet
            </p>
          )}
        </div>

        <div
          className="flex flex-col gap-3 px-6 py-4 pb-8"
          style={{ borderTop: "1px solid #F4F4F5" }}
        >
          {selectedCount < minSelection && (
            <p className="text-center text-xs text-[#71717A]">
              Select at least {minSelection} player
              {minSelection !== 1 ? "s" : ""} to continue
            </p>
          )}
          <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 text-base font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#F4F4F5",
              color: "#121212",
              height: "56px",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canConfirm}
            className="flex-1 text-base font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#9FE870",
              color: "#121212",
              height: "56px",
            }}
          >
            {isSubmitting ? "Generating…" : confirmLabel}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
