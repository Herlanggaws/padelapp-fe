"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { fetchEventParticipants } from "@/services/eventService";
import {
  fetchEventMatchmakingPairs,
  saveEventMatchmakingPairs,
} from "@/services/matchmakingService";
import type { EventParticipant } from "@/types/event";
import type { SaveEventMatchmakingPairsErrorResponse } from "@/types/matchmaking";
import {
  apiTeamsToEventPairs,
  eventPairsToTeams,
  type EventPair,
  type EventPairPlayer,
} from "@/lib/eventPairsStorage";

interface BottomSheetSetPairsProps {
  eventGuid: string;
  onClose: () => void;
  onSaved: (pairs: EventPair[]) => void;
}

const PAGE_SIZE = 10;

function toPairPlayer(participant: EventParticipant): EventPairPlayer {
  return {
    participant_guid: participant.guid,
    user_guid: participant.user_guid,
    name: participant.user.name,
    profile_photo: participant.user.profile_photo,
  };
}

function defaultTeamName(index: number) {
  return `Team ${index + 1}`;
}

function PlayerChip({
  player,
  selected,
  onClick,
}: {
  player: EventPairPlayer;
  selected?: boolean;
  onClick?: () => void;
}) {
  const photo = player.profile_photo?.trim();
  const className = "flex items-center gap-2 px-3 py-1.5 bg-white border";
  const style = {
    borderRadius: "9999px",
    borderColor: selected ? "#9FE870" : "#E4E4E7",
    boxShadow: selected
      ? "0px 0px 0px 2px rgba(159,232,112,0.35)"
      : "0px 1px 2px 0px rgba(0,0,0,0.05)",
  } as const;

  const content = (
    <>
      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-gray-200 flex items-center justify-center">
        {photo ? (
          <Image
            src={photo}
            alt={player.name}
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[10px] font-semibold text-gray-600">
            {player.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-xs font-medium text-[#151C27]">{player.name}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} style={style}>
        {content}
      </button>
    );
  }

  return (
    <div className={className} style={style}>
      {content}
    </div>
  );
}

export default function BottomSheetSetPairs({
  eventGuid,
  onClose,
  onSaved,
}: BottomSheetSetPairsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [pairs, setPairs] = useState<EventPair[]>([]);
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const loadParticipantsAndPairs = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const first = await fetchEventParticipants({
        event_guid: eventGuidRef.current,
        page: 1,
        limit: PAGE_SIZE,
      });
      let all = [...first.data];
      if (first.paginate.total_page > 1) {
        const rest = await Promise.all(
          Array.from({ length: first.paginate.total_page - 1 }, (_, i) =>
            fetchEventParticipants({
              event_guid: eventGuidRef.current,
              page: i + 2,
              limit: PAGE_SIZE,
            }),
          ),
        );
        for (const res of rest) all.push(...res.data);
      }
      setParticipants(all);

      try {
        const pairsRes = await fetchEventMatchmakingPairs(eventGuidRef.current);
        setPairs(apiTeamsToEventPairs(pairsRes.data.teams ?? [], all));
      } catch {
        setPairs([]);
      }
    } catch (err) {
      const apiError = err as { message?: string };
      setParticipants([]);
      setPairs([]);
      setError(apiError?.message ?? "Could not load players.");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    eventGuidRef.current = eventGuid;
    isFetchingRef.current = false;
    loadParticipantsAndPairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventGuid]);

  const playerByGuid = useMemo(() => {
    const map = new Map<string, EventPairPlayer>();
    for (const p of participants) {
      map.set(p.guid, toPairPlayer(p));
    }
    return map;
  }, [participants]);

  const pairedGuids = useMemo(() => {
    const set = new Set<string>();
    for (const pair of pairs) {
      set.add(pair.player1.participant_guid);
      set.add(pair.player2.participant_guid);
    }
    return set;
  }, [pairs]);

  const unassigned = useMemo(
    () =>
      participants.filter((p) => !pairedGuids.has(p.guid)).map(toPairPlayer),
    [participants, pairedGuids],
  );

  const handleSelectUnassigned = (guid: string) => {
    setError(null);
    if (selectedGuid === guid) {
      setSelectedGuid(null);
      return;
    }
    if (!selectedGuid) {
      setSelectedGuid(guid);
      return;
    }

    const player1 = playerByGuid.get(selectedGuid);
    const player2 = playerByGuid.get(guid);
    if (!player1 || !player2) {
      setSelectedGuid(null);
      return;
    }

    setPairs((prev) => [
      ...prev,
      {
        id: `${player1.participant_guid}-${player2.participant_guid}-${Date.now()}`,
        team_name: defaultTeamName(prev.length),
        player1,
        player2,
      },
    ]);
    setSelectedGuid(null);
  };

  const handleRemovePair = (pairId: string) => {
    setError(null);
    setPairs((prev) => prev.filter((p) => p.id !== pairId));
  };

  const handleRenameTeam = (pairId: string, teamName: string) => {
    setPairs((prev) =>
      prev.map((pair) =>
        pair.id === pairId ? { ...pair, team_name: teamName } : pair,
      ),
    );
  };

  const handleSave = async () => {
    if (pairs.length === 0) {
      setError("Create at least one pair before saving.");
      return;
    }
    const blankName = pairs.some((p) => !p.team_name.trim());
    if (blankName) {
      setError("Every team needs a name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const normalized = pairs.map((pair) => ({
        ...pair,
        team_name: pair.team_name.trim(),
      }));
      await saveEventMatchmakingPairs({
        event_guid: eventGuid,
        teams: eventPairsToTeams(normalized),
      });
      setIsVisible(false);
      setTimeout(() => {
        onSaved(normalized);
        onClose();
      }, 300);
    } catch (err) {
      const apiError = err as SaveEventMatchmakingPairsErrorResponse;
      setError(apiError?.message ?? "Could not save pairs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[448px] mx-auto">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      <div
        className={`relative flex flex-col max-h-[85vh] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          background: "#F9F9FF",
          borderRadius: "48px 48px 0px 0px",
          boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="rounded-full"
            style={{ width: "48px", height: "6px", background: "#D4D4D8" }}
          />
        </div>

        <div className="px-6 pb-2 pt-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#151C27]">Set Pairs</h2>
          <span className="text-xs font-semibold text-[#71717A]">
            {pairs.length} pair{pairs.length !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="px-6 pb-3 text-xs text-[#71717A]">
          Tap two unassigned players to create a pair. Rename each team, or
          remove a pair.
        </p>

        <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-4">
          {isLoading ? (
            <p className="text-sm text-[#71717A] py-6 text-center">
              Loading players...
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[5%] text-[#71717A]">
                  Pairs ({pairs.length})
                </span>
                {pairs.length === 0 ? (
                  <p className="text-sm text-[#A1A1AA] py-2">No pairs yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {pairs.map((pair) => (
                      <div
                        key={pair.id}
                        className="flex flex-col gap-2 p-3 bg-white rounded-2xl border border-[#F4F4F5]"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pair.team_name}
                            onChange={(e) =>
                              handleRenameTeam(pair.id, e.target.value)
                            }
                            maxLength={40}
                            aria-label="Team name"
                            className="flex-1 min-w-0 text-sm font-semibold text-[#151C27] bg-[#F4F4F5] rounded-full px-3 py-2 outline-none focus:ring-2 focus:ring-[#9FE870]"
                            placeholder="Team name"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePair(pair.id)}
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              background: "#FFF0F0",
                              border: "1px solid #FECACA",
                            }}
                            aria-label={`Remove ${pair.team_name}`}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#BA1A1A"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <PlayerChip player={pair.player1} />
                          <span className="text-xs font-semibold text-[#A1A1AA]">
                            &
                          </span>
                          <PlayerChip player={pair.player2} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[5%] text-[#71717A]">
                  Unassigned ({unassigned.length})
                </span>
                {unassigned.length === 0 ? (
                  <p className="text-sm text-[#A1A1AA] py-2">
                    All players are paired
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {unassigned.map((player) => (
                      <PlayerChip
                        key={player.participant_guid}
                        player={player}
                        selected={selectedGuid === player.participant_guid}
                        onClick={() =>
                          handleSelectUnassigned(player.participant_guid)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {error && <p className="text-sm text-[#BA1A1A]">{error}</p>}
        </div>

        <div className="px-6 pb-8 pt-2 flex gap-3 border-t border-[#F4F4F5] bg-[#F9F9FF]">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-full text-base text-[#18181B] bg-[#F4F4F5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || isLoading}
            className="flex-1 py-3 rounded-full text-base font-semibold text-[#121212] bg-[#9FE870] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Pairs"}
          </button>
        </div>
      </div>
    </div>
  );
}
