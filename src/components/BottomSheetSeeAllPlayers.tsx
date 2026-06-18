"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  fetchEventParticipants,
  removeOutsiderParticipant,
} from "@/services/eventService";
import type { EventParticipant } from "@/types/event";
import { useSnackbar } from "@/context/SnackbarContext";

interface BottomSheetSeeAllPlayersProps {
  eventGuid: string;
  isHost: boolean;
  onClose: () => void;
  onRemoved?: () => void;
}

const PAGE_SIZE = 10;

export default function BottomSheetSeeAllPlayers({
  eventGuid,
  isHost,
  onClose,
  onRemoved,
}: BottomSheetSeeAllPlayersProps) {
  const { showSnackbar } = useSnackbar();
  const [isVisible, setIsVisible] = useState(false);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [participantToRemove, setParticipantToRemove] =
    useState<EventParticipant | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
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
        pageRef.current = 2;
      } else {
        setParticipants((prev) => [...prev, ...newParticipants]);
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

  // Infinite scroll observer
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

  const handleConfirmRemove = async () => {
    if (!participantToRemove || isRemoving) return;
    setIsRemoving(true);
    try {
      const res = await removeOutsiderParticipant(participantToRemove.guid);
      setParticipants((prev) =>
        prev.filter((p) => p.guid !== participantToRemove.guid),
      );
      setParticipantToRemove(null);
      showSnackbar(res.message);
      onRemoved?.();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to remove player";
      showSnackbar(msg);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[448px] mx-auto">
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
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
            Players
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

        {/* Scrollable Player List */}
        <div className="flex flex-col overflow-y-auto px-6 py-4 gap-6">
          {participants.map((participant) => (
            <div
              key={participant.guid}
              className="flex items-center justify-between"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ border: "2px solid #2F6C00" }}
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

              {/* Action Buttons (host only) */}
              {isHost && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setParticipantToRemove(participant)}
                    disabled={isRemoving}
                    className="flex items-center justify-center rounded-full text-xs font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "#BA1A1A",
                      border: "2px solid #BA1A1A",
                      color: "#F0F3FF",
                      padding: "8px 16px",
                      lineHeight: "12px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Loading skeletons */}
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

          {/* Sentinel for infinite scroll */}
          {hasMore && <div ref={sentinelRef} className="h-1" />}

          {/* Empty state */}
          {!isLoading && participants.length === 0 && (
            <p className="text-center text-sm text-[#A1A1AA] py-8">
              No players yet
            </p>
          )}

          {/* Bottom spacer */}
          <div className="h-6" />
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      {participantToRemove && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#151C27]">
              Remove Player
            </h3>
            <p className="text-sm text-[#41493A]">
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {participantToRemove.user.name}
              </span>{" "}
              from this event?
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setParticipantToRemove(null)}
                disabled={isRemoving}
                className="flex-1 py-3 rounded-full text-base text-[#18181B] bg-[#F4F4F5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                disabled={isRemoving}
                className="flex-1 py-3 rounded-full text-base text-white bg-[#BA1A1A] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
