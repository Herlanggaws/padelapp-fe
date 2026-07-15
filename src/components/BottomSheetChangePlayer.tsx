"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { fetchMatchmakingAvailablePairs } from "@/services/matchmakingService";
import type {
  FetchMatchmakingAvailablePairsErrorResponse,
  MatchmakingAvailableParticipant,
} from "@/types/matchmaking";

interface BottomSheetChangePlayerProps {
  matchGuid: string;
  currentParticipantGuid: string;
  playerName?: string;
  onClose: () => void;
  onConfirm: (newParticipantGuid: string) => void;
  isSubmitting?: boolean;
}

export default function BottomSheetChangePlayer({
  matchGuid,
  currentParticipantGuid,
  playerName,
  onClose,
  onConfirm,
  isSubmitting = false,
}: BottomSheetChangePlayerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [participants, setParticipants] = useState<
    MatchmakingAvailableParticipant[]
  >([]);
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const matchGuidRef = useRef(matchGuid);

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
    if (isSubmitting) return;
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const loadParticipants = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetchMatchmakingAvailablePairs(matchGuidRef.current);
      const available = (res.data.participants ?? []).filter(
        (p) => p.guid !== currentParticipantGuid,
      );
      setParticipants(available);
      setSelectedGuid(null);
    } catch (e) {
      const err = e as FetchMatchmakingAvailablePairsErrorResponse;
      setParticipants([]);
      setSelectedGuid(null);
      setLoadError(err?.message ?? "Could not load available players.");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    matchGuidRef.current = matchGuid;
    isFetchingRef.current = false;
    loadParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchGuid, currentParticipantGuid]);

  const canConfirm = Boolean(selectedGuid) && !isSubmitting && !isLoading;

  const handleConfirm = () => {
    if (!selectedGuid || !canConfirm) return;
    onConfirm(selectedGuid);
  };

  const title = playerName
    ? `Replace ${playerName}`
    : "Change Player";

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
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F4F5] disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="overflow-y-auto px-6 py-4 flex-1 min-h-0">
          {loadError ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-center text-sm text-[#BA1A1A]">{loadError}</p>
              <button
                type="button"
                onClick={loadParticipants}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-[#F4F4F5] text-[#151C27]"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-x-3 gap-y-5">
              {participants.map((participant) => {
                const isSelected = selectedGuid === participant.guid;
                return (
                  <button
                    key={participant.guid}
                    type="button"
                    onClick={() => setSelectedGuid(participant.guid)}
                    disabled={isSubmitting}
                    className="flex flex-col items-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                          border: isSelected
                            ? "2px solid #2F6C00"
                            : "2px solid #E4E4E7",
                        }}
                      >
                        {participant.profile_photo ? (
                          <Image
                            src={participant.profile_photo}
                            alt={participant.name}
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
                      {isSelected && (
                        <div
                          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            border: "2px solid #9FE870",
                            background: "#9FE870",
                          }}
                        >
                          <svg
                            width="10"
                            height="8"
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
                        </div>
                      )}
                    </div>
                    <span
                      className="font-semibold text-xs text-[#151C27] truncate max-w-full w-full"
                      style={{ lineHeight: "16px" }}
                    >
                      {participant.name}
                    </span>
                  </button>
                );
              })}

              {isLoading &&
                Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="flex flex-col items-center gap-2 animate-pulse"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#F4F4F5]" />
                    <div className="h-3 w-16 rounded bg-[#F4F4F5]" />
                  </div>
                ))}
            </div>
          )}

          {!isLoading && !loadError && participants.length === 0 && (
            <p className="text-center text-sm text-[#A1A1AA] py-8">
              No available players
            </p>
          )}
        </div>

        <div
          className="flex flex-col gap-3 px-6 py-4 pb-8"
          style={{ borderTop: "1px solid #F4F4F5" }}
        >
          {!selectedGuid && !isLoading && participants.length > 0 && (
            <p className="text-center text-xs text-[#71717A]">
              Select a player to continue
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
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="flex-1 text-base font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#9FE870",
                color: "#121212",
                height: "56px",
              }}
            >
              {isSubmitting ? "Updating…" : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
