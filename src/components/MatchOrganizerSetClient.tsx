"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  clearMatchOrganizerSetDraft,
  getMatchOrganizerSetDraft,
  setMatchOrganizerSetDraft,
  setMatchOrganizerSetTeams,
} from "@/lib/matchOrganizerSetDraftStorage";
import { setMatchConfigPlayers } from "@/lib/matchConfigPlayersStorage";
import type {
  MatchConfigSelectedPlayer,
  MatchOrganizerSetCourtSlot,
  MatchOrganizerSetDraft,
} from "@/types/matchmaking";

type TeamSide = "teamA" | "teamB";
type SlotIndex = 0 | 1;

function formatLabel(format: MatchOrganizerSetDraft["format"]) {
  switch (format) {
    case "mexicano":
      return "Mexicano";
    case "americano":
      return "Americano";
    case "team_americano":
      return "Team Americano";
  }
}

function PlayerAvatar({
  player,
  size,
}: {
  player: MatchConfigSelectedPlayer;
  size: number;
}) {
  const photo = player.profile_photo?.trim();
  if (photo) {
    return (
      <Image
        src={photo}
        alt={player.name}
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <span
        className="font-semibold text-gray-600"
        style={{ fontSize: Math.max(10, size / 2.5) }}
      >
        {player.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function PlayerSlot({
  player,
  isTarget,
  onClick,
}: {
  player: MatchConfigSelectedPlayer | null;
  isTarget: boolean;
  onClick: () => void;
}) {
  if (!player) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center px-2 py-2 w-full"
        style={{
          border: isTarget ? "1px dashed #9FE870" : "1px dashed #E4E4E7",
          background: isTarget ? "rgba(159, 232, 112, 0.15)" : "transparent",
          borderRadius: "48px",
          minHeight: "44px",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase"
          style={{
            lineHeight: "15px",
            color: isTarget ? "#2E6900" : "#D4D4D8",
          }}
        >
          {isTarget ? "TAP TO PLACE" : "DROP PLAYER"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between px-2 py-2 w-full bg-white border border-[#F4F4F5]"
      style={{ borderRadius: "48px" }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
          style={{ border: "2px solid #9FE870" }}
        >
          <PlayerAvatar player={player} size={32} />
        </div>
        <span
          className="text-sm font-medium text-[#151C27] truncate"
          style={{ lineHeight: "20px" }}
        >
          {player.name}
        </span>
      </div>
      <span className="p-1 shrink-0" aria-hidden>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <circle cx="3" cy="3" r="1.5" fill="#A1A1AA" />
          <circle cx="7" cy="3" r="1.5" fill="#A1A1AA" />
          <circle cx="3" cy="8" r="1.5" fill="#A1A1AA" />
          <circle cx="7" cy="8" r="1.5" fill="#A1A1AA" />
          <circle cx="3" cy="13" r="1.5" fill="#A1A1AA" />
          <circle cx="7" cy="13" r="1.5" fill="#A1A1AA" />
        </svg>
      </span>
    </button>
  );
}

function CourtSection({
  court,
  playerByGuid,
  selectedGuid,
  onEmptySlotClick,
  onFilledSlotClick,
}: {
  court: MatchOrganizerSetCourtSlot;
  playerByGuid: Map<string, MatchConfigSelectedPlayer>;
  selectedGuid: string | null;
  onEmptySlotClick: (side: TeamSide, index: SlotIndex) => void;
  onFilledSlotClick: (side: TeamSide, index: SlotIndex) => void;
}) {
  const renderSlot = (side: TeamSide, index: SlotIndex) => {
    const guid = court[side][index];
    const player = guid ? (playerByGuid.get(guid) ?? null) : null;
    return (
      <PlayerSlot
        key={`${side}-${index}`}
        player={player}
        isTarget={!player && selectedGuid != null}
        onClick={() =>
          player
            ? onFilledSlotClick(side, index)
            : onEmptySlotClick(side, index)
        }
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="1"
              y="1"
              width="12"
              height="12"
              rx="2"
              stroke="#18181B"
              strokeWidth="1.5"
            />
            <line
              x1="7"
              y1="1"
              x2="7"
              y2="13"
              stroke="#18181B"
              strokeWidth="1.5"
            />
            <line
              x1="1"
              y1="7"
              x2="13"
              y2="7"
              stroke="#18181B"
              strokeWidth="1.5"
            />
          </svg>
          <span
            className="text-base font-bold text-[#18181B]"
            style={{ lineHeight: "24px" }}
          >
            Court {court.courtNumber}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <span
            className="text-[10px] font-bold uppercase text-[#A1A1AA] px-1"
            style={{ lineHeight: "15px" }}
          >
            TEAM A
          </span>
          <div className="flex flex-col gap-2">
            {renderSlot("teamA", 0)}
            {renderSlot("teamA", 1)}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <span
            className="text-[10px] font-bold uppercase text-[#A1A1AA] px-1"
            style={{ lineHeight: "15px" }}
          >
            TEAM B
          </span>
          <div className="flex flex-col gap-2">
            {renderSlot("teamB", 0)}
            {renderSlot("teamB", 1)}
          </div>
        </div>
      </div>
    </div>
  );
}

function deriveTeams(courts: MatchOrganizerSetCourtSlot[]) {
  const teams: { player1_guid: string; player2_guid: string }[] = [];
  for (const court of courts) {
    const [a0, a1] = court.teamA;
    const [b0, b1] = court.teamB;
    if (a0 && a1) teams.push({ player1_guid: a0, player2_guid: a1 });
    if (b0 && b1) teams.push({ player1_guid: b0, player2_guid: b1 });
  }
  return teams;
}

export default function MatchOrganizerSetClient({
  eventGuid,
}: {
  eventGuid: string;
}) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [draft, setDraft] = useState<MatchOrganizerSetDraft | null>(null);
  const [courts, setCourts] = useState<MatchOrganizerSetCourtSlot[]>([]);
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);
  const [unassignedOpen, setUnassignedOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!eventGuid.trim()) return;
    const stored = getMatchOrganizerSetDraft(eventGuid);
    if (!stored) {
      router.replace(
        `/matches/configure?event_guid=${encodeURIComponent(eventGuid)}`,
      );
      return;
    }
    setDraft(stored);
    setCourts(stored.courts);
  }, [eventGuid, router]);

  const playerByGuid = useMemo(() => {
    const map = new Map<string, MatchConfigSelectedPlayer>();
    for (const player of draft?.players ?? []) {
      map.set(player.participant_guid, player);
    }
    return map;
  }, [draft]);

  const assignedGuids = useMemo(() => {
    const set = new Set<string>();
    for (const court of courts) {
      for (const guid of [...court.teamA, ...court.teamB]) {
        if (guid) set.add(guid);
      }
    }
    return set;
  }, [courts]);

  const unassignedPlayers = useMemo(
    () =>
      (draft?.players ?? []).filter(
        (p) => !assignedGuids.has(p.participant_guid),
      ),
    [draft, assignedGuids],
  );

  const updateCourts = (
    updater: (prev: MatchOrganizerSetCourtSlot[]) => MatchOrganizerSetCourtSlot[],
  ) => {
    setCourts((prev) => {
      const next = updater(prev);
      if (draft) {
        setMatchOrganizerSetDraft({ ...draft, courts: next });
      }
      return next;
    });
  };

  const handleSelectUnassigned = (guid: string) => {
    setSelectedGuid((prev) => (prev === guid ? null : guid));
  };

  const handleEmptySlotClick = (
    courtNumber: number,
    side: TeamSide,
    index: SlotIndex,
  ) => {
    if (!selectedGuid) return;
    updateCourts((prev) =>
      prev.map((court) => {
        if (court.courtNumber !== courtNumber) return court;
        const nextSide: [string | null, string | null] = [...court[side]];
        nextSide[index] = selectedGuid;
        return { ...court, [side]: nextSide };
      }),
    );
    setSelectedGuid(null);
  };

  const handleFilledSlotClick = (
    courtNumber: number,
    side: TeamSide,
    index: SlotIndex,
  ) => {
    updateCourts((prev) =>
      prev.map((court) => {
        if (court.courtNumber !== courtNumber) return court;
        const nextSide: [string | null, string | null] = [...court[side]];
        nextSide[index] = null;
        return { ...court, [side]: nextSide };
      }),
    );
    setSelectedGuid(null);
  };

  const handleConfirmPairs = () => {
    if (!draft) return;

    const incompletePair = courts.some((court) => {
      const aFilled = court.teamA.filter(Boolean).length;
      const bFilled = court.teamB.filter(Boolean).length;
      return (
        (aFilled > 0 && aFilled < 2) || (bFilled > 0 && bFilled < 2)
      );
    });
    if (incompletePair) {
      setModalMessage(
        "Each team needs 2 players. Complete or clear incomplete pairs.",
      );
      setModalOpen(true);
      return;
    }

    const teams = deriveTeams(courts);
    if (teams.length === 0) {
      setModalMessage("Create at least one complete pair before confirming.");
      setModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      setMatchOrganizerSetDraft({ ...draft, courts });
      setMatchOrganizerSetTeams({
        event_guid: draft.event_guid,
        teams,
      });
      clearMatchOrganizerSetDraft();
      showSnackbar(
        `Saved ${teams.length} pair${teams.length !== 1 ? "s" : ""} locally`,
      );
      router.push(`/events/${encodeURIComponent(draft.event_guid)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!draft) {
    return (
      <main
        className="flex items-center justify-center pb-32"
        style={{ paddingTop: "80px" }}
      >
        <span className="text-sm text-[#71717A]">Loading...</span>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 pb-32" style={{ paddingTop: "80px" }}>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Set pairs"
        message={modalMessage}
      />

      <div className="flex gap-4 px-6">
        <div
          className="flex-1 flex flex-col gap-2 p-4 bg-white border border-[#F4F4F5]"
          style={{ borderRadius: "16px" }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
            style={{ lineHeight: "15px" }}
          >
            GAME FORMAT
          </span>
          <div className="flex items-center gap-2">
            <svg width="8" height="15" viewBox="0 0 8 15" fill="none">
              <path d="M4 0L8 7.5L4 15L0 7.5L4 0Z" fill="#18181B" />
            </svg>
            <span
              className="text-base font-semibold text-[#18181B]"
              style={{ lineHeight: "24px" }}
            >
              {formatLabel(draft.format)}
            </span>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col gap-2 p-4 bg-white border border-[#F4F4F5]"
          style={{ borderRadius: "16px" }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
            style={{ lineHeight: "15px" }}
          >
            COURTS
          </span>
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect
                x="0.75"
                y="0.75"
                width="13.5"
                height="13.5"
                rx="1.5"
                stroke="#18181B"
                strokeWidth="1.5"
              />
              <line
                x1="7.5"
                y1="0.75"
                x2="7.5"
                y2="14.25"
                stroke="#18181B"
                strokeWidth="1.5"
              />
              <line
                x1="0.75"
                y1="7.5"
                x2="14.25"
                y2="7.5"
                stroke="#18181B"
                strokeWidth="1.5"
              />
            </svg>
            <span
              className="text-base font-semibold text-[#18181B]"
              style={{ lineHeight: "24px" }}
            >
              {draft.number_of_courts} Court
              {draft.number_of_courts !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-6">
        <div className="px-1">
          <span
            className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
            style={{ lineHeight: "15px" }}
          >
            TEAM ASSIGNMENT
          </span>
        </div>
        <div
          className="flex items-center p-1"
          style={{ background: "#E5E2E1", borderRadius: "9999px" }}
        >
          <button
            type="button"
            onClick={() => {
              if (draft) {
                setMatchConfigPlayers({
                  event_guid: draft.event_guid,
                  players: draft.players,
                });
              }
              router.push(
                `/matches/configure?event_guid=${encodeURIComponent(eventGuid)}`,
              );
            }}
            className="flex-1 py-2 text-center"
            style={{
              borderRadius: "9999px",
              color: "#71717A",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          >
            Random
          </button>
          <button
            type="button"
            className="flex-1 py-2 text-center bg-white border border-[#F4F4F5]"
            style={{
              borderRadius: "9999px",
              color: "#18181B",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
            }}
          >
            Organizer Set
          </button>
        </div>
        <p className="text-xs text-[#71717A] px-1">
          Tap a player below, then tap an empty slot. Tap a filled slot to
          remove.
        </p>
      </div>

      <div className="flex flex-col gap-6 px-6">
        {courts.map((court) => (
          <CourtSection
            key={court.courtNumber}
            court={court}
            playerByGuid={playerByGuid}
            selectedGuid={selectedGuid}
            onEmptySlotClick={(side, index) =>
              handleEmptySlotClick(court.courtNumber, side, index)
            }
            onFilledSlotClick={(side, index) =>
              handleFilledSlotClick(court.courtNumber, side, index)
            }
          />
        ))}
      </div>

      <div
        className="mx-6 flex flex-col gap-4 p-4 border border-[#F4F4F5]"
        style={{
          background: "rgba(244, 244, 245, 0.5)",
          borderRadius: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => setUnassignedOpen((v) => !v)}
          className="flex items-center justify-between"
        >
          <div className="px-1">
            <span
              className="text-[10px] font-bold uppercase tracking-[10%] text-[#474646]"
              style={{ lineHeight: "15px" }}
            >
              UNASSIGNED PLAYERS ({unassignedPlayers.length})
            </span>
          </div>
          <svg
            width="14"
            height="7"
            viewBox="0 0 14 7"
            fill="none"
            style={{
              transform: unassignedOpen ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.2s",
            }}
          >
            <path
              d="M1 1L7 6L13 1"
              stroke="#A1A1AA"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {unassignedOpen && (
          <div className="flex flex-wrap gap-2">
            {unassignedPlayers.length === 0 ? (
              <span className="text-xs text-[#71717A] px-1">
                All players assigned
              </span>
            ) : (
              unassignedPlayers.map((player) => {
                const isSelected = selectedGuid === player.participant_guid;
                return (
                  <button
                    key={player.participant_guid}
                    type="button"
                    onClick={() =>
                      handleSelectUnassigned(player.participant_guid)
                    }
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border"
                    style={{
                      borderRadius: "9999px",
                      borderColor: isSelected ? "#9FE870" : "#E4E4E7",
                      boxShadow: isSelected
                        ? "0px 0px 0px 2px rgba(159,232,112,0.35)"
                        : "0px 1px 2px 0px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <PlayerAvatar player={player} size={24} />
                    </div>
                    <span
                      className="text-xs font-medium text-[#151C27]"
                      style={{ lineHeight: "18px" }}
                    >
                      {player.name}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[448px] mx-auto px-6 py-4 pb-8 bg-white border-t border-[#F4F4F5]">
        <button
          type="button"
          onClick={handleConfirmPairs}
          disabled={isSubmitting}
          className="w-full text-xl font-semibold text-[#9FE870] py-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "#18181B",
            lineHeight: "26px",
            boxShadow:
              "0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        >
          {isSubmitting ? "Saving..." : "Confirm Pairs"}
        </button>
      </div>
    </main>
  );
}
