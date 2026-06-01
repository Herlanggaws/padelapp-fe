"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { createMatchmakingSession } from "@/services/matchmakingService";
import type {
  CreateMatchmakingSessionErrorResponse,
  MatchmakingSessionFormatApi,
  MatchmakingTeamAssignmentApi,
} from "@/types/matchmaking";

type GameFormat = "Mexicano" | "Americano" | "Team Americano";
type TeamAssignment = "Random" | "Organizer Set";
type SetPoints = 16 | 21 | 24 | 32;

function uiFormatToApi(value: GameFormat): MatchmakingSessionFormatApi {
  switch (value) {
    case "Mexicano":
      return "mexicano";
    case "Americano":
      return "americano";
    case "Team Americano":
      return "team_americano";
  }
}

function uiTeamAssignmentToApi(
  value: TeamAssignment,
): MatchmakingTeamAssignmentApi {
  return value === "Organizer Set" ? "organizer_set" : "random";
}

export default function MatchConfigClient({
  eventGuid,
}: {
  eventGuid: string;
}) {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<GameFormat>("Americano");
  const [courts, setCourts] = useState(2);
  const [teamAssignment, setTeamAssignment] =
    useState<TeamAssignment>("Random");
  const [selectedPoints, setSelectedPoints] = useState<SetPoints>(21);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Error");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  const formats: {
    value: GameFormat;
    description: string;
    disabled?: boolean;
  }[] = [
    {
      value: "Mexicano",
      description: "Individual performance focus",
      disabled: true,
    },
    { value: "Americano", description: "Round robin system" },
    {
      value: "Team Americano",
      description: "Fixed duo bracket",
      disabled: true,
    },
  ];

  const pointOptions: SetPoints[] = [16, 21, 24, 32];

  const handleGenerateMatch = async () => {
    if (!eventGuid.trim()) {
      showModal(
        "Missing event",
        "Open this screen from an event to generate a match.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createMatchmakingSession({
        event_guid: eventGuid,
        format: uiFormatToApi(selectedFormat),
        number_of_courts: courts,
        team_assignment: uiTeamAssignmentToApi(teamAssignment),
        total_set_points: selectedPoints,
        teams: [],
      });
      router.push(
        `/matches/${result.data.guid}?event_guid=${encodeURIComponent(eventGuid)}`,
      );
    } catch (err) {
      const apiError = err as CreateMatchmakingSessionErrorResponse;
      showModal("Error", apiError?.message ?? "Could not create match.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col gap-6 px-4 pt-6 pb-32">
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />
      {/* Game Format Section */}
      <section className="flex flex-col gap-2">
        <h2
          className="text-xl font-normal text-[#151C27]"
          style={{ lineHeight: "26px" }}
        >
          Game Format
        </h2>
        <div className="flex flex-col">
          {formats.map((format, index) => {
            const isSelected = selectedFormat === format.value;
            const isDisabled = format.disabled === true;
            return (
              <button
                key={format.value}
                type="button"
                disabled={isDisabled}
                aria-disabled={isDisabled}
                onClick={() => setSelectedFormat(format.value)}
                className="flex items-center justify-between px-4 py-4 border border-[#F4F4F5] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderRadius:
                    index === 0
                      ? "48px 48px 0 0"
                      : index === formats.length - 1
                        ? "0 0 48px 48px"
                        : "0",
                  borderTopWidth: index === 0 ? "1px" : "0",
                  marginTop: index === 0 ? "0" : "-1px",
                }}
              >
                <div className="flex flex-col gap-1 text-left">
                  <span
                    className={`text-xs font-semibold ${isDisabled ? "text-[#A1A1AA]" : "text-[#151C27]"}`}
                    style={{ lineHeight: "12px" }}
                  >
                    {format.value}
                  </span>
                  <span
                    className={`text-sm font-normal ${isDisabled ? "text-[#A1A1AA]" : "text-[#5F5E5E]"}`}
                    style={{ lineHeight: "21px" }}
                  >
                    {format.description}
                  </span>
                </div>
                {/* Radio indicator */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    border: isSelected
                      ? "2px solid #9FE870"
                      : isDisabled
                        ? "2px solid #E4E4E7"
                        : "2px solid #C1CAB5",
                    background: isSelected ? "#9FE870" : "transparent",
                  }}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Number of Courts Section */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-semibold text-[#151C27]"
            style={{ lineHeight: "26px" }}
          >
            Number of Courts
          </h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#A1A1AA" strokeWidth="2" />
            <path
              d="M12 16v-4M12 8h.01"
              stroke="#A1A1AA"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div
          className="flex items-center justify-between px-2 py-2 border border-[#F4F4F5] bg-white"
          style={{ borderRadius: "9999px" }}
        >
          <button
            onClick={() => setCourts(Math.max(1, courts - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#F0F3FF" }}
          >
            <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
              <path
                d="M1 1H13"
                stroke="#18181B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span
            className="text-xl font-semibold text-[#151C27]"
            style={{ lineHeight: "26px" }}
          >
            {courts}
          </span>
          <button
            onClick={() => setCourts(courts + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "#9FE870" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1V13M1 7H13"
                stroke="#2E6900"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Team Assignment Section */}
      <section className="flex flex-col gap-2">
        <h2
          className="text-xl font-normal text-[#151C27]"
          style={{ lineHeight: "26px" }}
        >
          Team Assignment
        </h2>
        <div
          className="flex items-center p-1 bg-[#F0F3FF]"
          style={{ borderRadius: "9999px" }}
        >
          {(["Random", "Organizer Set"] as TeamAssignment[]).map((option) => {
            const isActive = teamAssignment === option;
            const isDisabled = option === "Organizer Set";
            return (
              <button
                key={option}
                type="button"
                disabled={isDisabled}
                onClick={() => setTeamAssignment(option)}
                className="flex-1 py-3 text-center transition-all disabled:cursor-not-allowed"
                style={{
                  borderRadius: "9999px",
                  background: isActive ? "#FFFFFF" : "transparent",
                  boxShadow: isActive
                    ? "0px 1px 2px 0px rgba(0,0,0,0.05)"
                    : "none",
                  color: isDisabled
                    ? "#A1A1AA"
                    : isActive
                      ? "#151C27"
                      : "#71717A",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: "12px",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </section>

      {/* Total Set Points Section */}
      <section className="flex flex-col gap-2">
        <h2
          className="text-xl font-normal text-[#151C27]"
          style={{ lineHeight: "26px" }}
        >
          Total Set Points
        </h2>
        <div className="flex gap-2">
          {pointOptions.map((pts) => {
            const isSelected = selectedPoints === pts;
            return (
              <button
                key={pts}
                onClick={() => setSelectedPoints(pts)}
                className="flex-1 py-2 px-6 text-center transition-all"
                style={{
                  borderRadius: "9999px",
                  background: isSelected ? "#18181B" : "#FFFFFF",
                  border: isSelected
                    ? "1px solid #18181B"
                    : "1px solid #F4F4F5",
                  color: isSelected ? "#9FE870" : "#151C27",
                  fontSize: "12px",
                  fontWeight: 600,
                  lineHeight: "12px",
                }}
              >
                {pts}
              </button>
            );
          })}
        </div>
      </section>

      {/* Generate Match Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={handleGenerateMatch}
          disabled={isSubmitting}
          className="w-full relative overflow-hidden text-xl font-semibold text-[#9FE870] py-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "#18181B",
            lineHeight: "26px",
            boxShadow:
              "0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        >
          Generate Match
        </button>
      </div>
    </main>
  );
}
