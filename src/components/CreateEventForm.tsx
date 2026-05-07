"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import { createEvent } from "@/services/eventService";
import type { CreateEventErrorResponse } from "@/types/event";
import { useSnackbar } from "@/context/SnackbarContext";

interface CreateEventFormProps {
  clubGuid: string;
  clubId: string;
}

export default function CreateEventForm({
  clubGuid,
  clubId,
}: CreateEventFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [minLevel, setMinLevel] = useState(1.5);
  const [maxLevel, setMaxLevel] = useState(4.5);
  const [minInput, setMinInput] = useState("1.5");
  const [maxInput, setMaxInput] = useState("4.5");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !dateTime || !numberOfPlayers) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await createEvent({
        club_guid: clubGuid,
        name,
        description,
        date_time: new Date(dateTime).toISOString(),
        number_of_players: Number(numberOfPlayers),
        min_level: minLevel,
        max_level: maxLevel,
      });
      showSnackbar("Event created successfully");
      router.push(`/clubs/${clubId}`);
    } catch (err) {
      const e = err as CreateEventErrorResponse;
      setErrorMessage(e?.message ?? "Failed to create event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backHref={`/clubs/${clubId}`}
        title="Create Event"
        showSettings={false}
      />

      <main className="flex flex-col gap-6 pb-32" style={{ paddingTop: "84px" }}>
        <div className="flex flex-col gap-2 px-4 pt-6">
          <h2
            className="font-semibold text-[28px] text-[#151C27]"
            style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
          >
            Event Details
          </h2>
          <p className="text-sm text-[#41493A]" style={{ lineHeight: "21px" }}>
            Tell players what to expect. High-quality details attract competitive
            players.
          </p>
        </div>

        <div className="flex flex-col gap-6 px-4">
          <div className="flex flex-col gap-4">
            {/* Event Name */}
            <div className="flex flex-col gap-2">
              <div className="pl-1">
                <label
                  className="text-xs text-[#151C27]"
                  style={{ lineHeight: "12px" }}
                >
                  Event Name
                </label>
              </div>
              <div className="pt-2">
                <div
                  className="w-full px-4 py-[18px] rounded-lg"
                  style={{ background: "#F0F3FF", border: "1px solid #C1CAB5" }}
                >
                  <input
                    type="text"
                    placeholder="e.g. Friday Morning Smash"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-base text-[#6B7280] outline-none"
                    style={{ lineHeight: "24px" }}
                  />
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="flex flex-col gap-2">
              <div className="pl-1">
                <label
                  className="text-xs text-[#151C27]"
                  style={{ lineHeight: "12px" }}
                >
                  Event Description
                </label>
              </div>
              <div className="pt-2">
                <div
                  className="w-full px-4 py-4 rounded-lg"
                  style={{
                    background: "#F0F3FF",
                    border: "1px solid #C1CAB5",
                    minHeight: "100px",
                  }}
                >
                  <textarea
                    placeholder="Describe the vibe, level expectations, or court fees..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent text-base text-[#6B7280] outline-none resize-none"
                    style={{ lineHeight: "24px", minHeight: "80px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Date & Time */}
            <div className="flex flex-col gap-2">
              <div className="pl-1">
                <label
                  className="text-xs text-[#151C27]"
                  style={{ lineHeight: "12px" }}
                >
                  Date &amp; Time
                </label>
              </div>
              <div className="pt-2">
                <div
                  className="w-full px-4 py-4 rounded-lg flex items-center justify-between"
                  style={{ background: "#F0F3FF", border: "1px solid #C1CAB5" }}
                >
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full bg-transparent text-base text-[#151C27] outline-none"
                    style={{ lineHeight: "24px" }}
                  />
                </div>
              </div>
            </div>

            {/* Number of Players */}
            <div className="flex flex-col gap-2">
              <div className="pl-1">
                <label
                  className="text-xs text-[#151C27]"
                  style={{ lineHeight: "12px" }}
                >
                  Number of Players
                </label>
              </div>
              <div className="pt-2">
                <div
                  className="w-full px-4 py-[18px] rounded-lg"
                  style={{ background: "#F0F3FF", border: "1px solid #C1CAB5" }}
                >
                  <input
                    type="number"
                    placeholder="Input Number of Players"
                    value={numberOfPlayers}
                    onChange={(e) => setNumberOfPlayers(e.target.value)}
                    className="w-full bg-transparent text-base text-[#6B7280] outline-none"
                    style={{ lineHeight: "24px" }}
                    min={2}
                    max={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Level Range Selection */}
          <div
            className="flex flex-col gap-4 p-4 rounded-lg"
            style={{ background: "#F0F3FF", border: "1px solid #C1CAB5" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold text-[#151C27]"
                style={{ lineHeight: "12px" }}
              >
                Level Range
              </span>
              <div
                className="px-3 py-1 rounded-full"
                style={{ background: "#9FE870" }}
              >
                <span
                  className="text-xs font-semibold text-[#2E6900]"
                  style={{ lineHeight: "12px" }}
                >
                  {minLevel.toFixed(1)} - {maxLevel.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-4">
              <div
                className="w-full h-2 rounded-full relative"
                style={{ background: "#DCE2F3" }}
              >
                <div
                  className="absolute top-0 h-2 rounded-full"
                  style={{
                    background: "#9FE870",
                    left: `${((minLevel - 1.0) / 6.0) * 100}%`,
                    right: `${100 - ((maxLevel - 1.0) / 6.0) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between">
                {[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0].map((level) => (
                  <span
                    key={level}
                    className="text-xs text-[#41493A]"
                    style={{ lineHeight: "12px" }}
                  >
                    {level.toFixed(1)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <span
                  className="text-[10px] font-normal text-[#41493A] uppercase tracking-[5%]"
                  style={{ lineHeight: "15px" }}
                >
                  MIN LEVEL
                </span>
                <div className="pt-1">
                  <div
                    className="w-full px-3 py-3 rounded-lg text-center"
                    style={{ background: "#FFFFFF", border: "1px solid #C1CAB5" }}
                  >
                    <input
                      type="number"
                      value={minInput}
                      onChange={(e) => setMinInput(e.target.value)}
                      onBlur={() => {
                        const v = parseFloat(minInput);
                        const clamped = isNaN(v)
                          ? minLevel
                          : Math.min(Math.max(v, 1.0), maxLevel);
                        setMinLevel(clamped);
                        setMinInput(clamped.toString());
                      }}
                      step={0.5}
                      min={1.0}
                      max={maxLevel}
                      className="w-full bg-transparent text-base font-normal text-[#151C27] outline-none text-center"
                      style={{ lineHeight: "24px" }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span
                  className="text-[10px] font-normal text-[#41493A] uppercase tracking-[5%]"
                  style={{ lineHeight: "15px" }}
                >
                  MAX LEVEL
                </span>
                <div className="pt-1">
                  <div
                    className="w-full px-3 py-3 rounded-lg text-center"
                    style={{ background: "#FFFFFF", border: "1px solid #C1CAB5" }}
                  >
                    <input
                      type="number"
                      value={maxInput}
                      onChange={(e) => setMaxInput(e.target.value)}
                      onBlur={() => {
                        const v = parseFloat(maxInput);
                        const clamped = isNaN(v)
                          ? maxLevel
                          : Math.min(Math.max(v, minLevel), 7.0);
                        setMaxLevel(clamped);
                        setMaxInput(clamped.toString());
                      }}
                      step={0.5}
                      min={minLevel}
                      max={7.0}
                      className="w-full bg-transparent text-base font-normal text-[#151C27] outline-none text-center"
                      style={{ lineHeight: "24px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-[448px] mx-auto px-6 py-6"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #F4F4F5",
          boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
        }}
      >
        {errorMessage && (
          <p className="text-xs text-red-500 text-center mb-3">{errorMessage}</p>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full text-base font-normal text-[#9FE870] rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: "#121212", height: "56px", lineHeight: "24px" }}
        >
          {isSubmitting && (
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9FE870"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          )}
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
