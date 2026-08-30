"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type {
  MatchmakingSessionPlayer,
  MatchmakingSessionTeam,
} from "@/types/matchmaking";

interface BottomSheetSelectTeamsProps {
  teams: MatchmakingSessionTeam[];
  onClose: () => void;
  onConfirm: (teamGuids: string[]) => void;
  title?: string;
  confirmLabel?: string;
  minSelection?: number;
  isSubmitting?: boolean;
}

function playerName(player: MatchmakingSessionPlayer | null | undefined) {
  if (!player) return "—";
  return (
    player.name?.trim() ||
    player.user?.name?.trim() ||
    player.email?.trim() ||
    player.user?.email?.trim() ||
    "—"
  );
}

function playerPhoto(player: MatchmakingSessionPlayer | null | undefined) {
  return player?.profile_photo?.trim() || null;
}

function PlayerAvatar({
  player,
}: {
  player: MatchmakingSessionPlayer | null | undefined;
}) {
  const name = playerName(player);
  const photo = playerPhoto(player);

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[#F0F3FF] flex items-center justify-center">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-gray-600">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-[#151C27] truncate">{name}</span>
    </div>
  );
}

export default function BottomSheetSelectTeams({
  teams,
  onClose,
  onConfirm,
  title = "Select Teams",
  confirmLabel = "Generate",
  minSelection = 2,
  isSubmitting = false,
}: BottomSheetSelectTeamsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGuids, setSelectedGuids] = useState<Set<string>>(
    () => new Set(teams.map((team) => team.guid)),
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedGuids(new Set(teams.map((team) => team.guid)));
  }, [teams]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

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

  const handleConfirm = () => {
    const selected = teams
      .filter((team) => selectedGuids.has(team.guid))
      .map((team) => team.guid);
    if (selected.length < minSelection) return;
    onConfirm(selected);
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

        <div className="overflow-y-auto px-6 py-4 flex-1 min-h-0 flex flex-col gap-3">
          {teams.length === 0 ? (
            <p className="text-center text-sm text-[#A1A1AA] py-8">
              No teams yet
            </p>
          ) : (
            teams.map((team) => {
              const isSelected = selectedGuids.has(team.guid);
              const teamLabel =
                team.team_name?.trim() || `Team ${team.guid.slice(0, 4)}`;

              return (
                <button
                  key={team.guid}
                  type="button"
                  onClick={() => toggleSelection(team.guid)}
                  className="flex flex-col gap-2 p-3 rounded-2xl text-left border"
                  style={{
                    borderColor: isSelected ? "#2F6C00" : "#F4F4F5",
                    background: isSelected ? "#F7FFF0" : "#FFFFFF",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#151C27]">
                      {teamLabel}
                    </span>
                    {isSelected && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "#9FE870" }}
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
                  <div className="flex flex-col gap-2">
                    <PlayerAvatar player={team.player1} />
                    <PlayerAvatar player={team.player2} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div
          className="flex flex-col gap-3 px-6 py-4 pb-8"
          style={{ borderTop: "1px solid #F4F4F5" }}
        >
          {selectedCount < minSelection && (
            <p className="text-center text-xs text-[#71717A]">
              Select at least {minSelection} team
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
              onClick={handleConfirm}
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
