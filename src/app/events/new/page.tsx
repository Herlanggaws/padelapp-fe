"use client";

import Link from "next/link";
import { useState } from "react";

// Event Form - Create Event
export default function EventFormPage() {
  const [minLevel, setMinLevel] = useState(1.5);
  const [maxLevel, setMaxLevel] = useState(4.5);

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      {/* Top App Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 max-w-[448px] mx-auto w-full"
        style={{
          height: "64px",
          background: "#FFFFFF",
          borderBottom: "1px solid #F4F4F5",
        }}
      >
        <Link href="/dashboard" className="p-2 rounded-full">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="pl-2">
          <span
            className="text-lg text-[#151C27]"
            style={{ lineHeight: "28px", letterSpacing: "-2.5%" }}
          >
            Create Event
          </span>
        </div>

        <div
          className="flex items-center px-3 py-1 rounded-full"
          style={{ background: "#E2E8F8" }}
        >
          <span
            className="text-xs font-semibold text-[#41493A]"
            style={{ lineHeight: "12px" }}
          >
            Step 2 of 3
          </span>
        </div>
      </header>

      <main
        className="flex flex-col gap-6 pb-32"
        style={{ paddingTop: "84px" }}
      >
        {/* Header Section */}
        <div className="flex flex-col gap-2 px-4 pt-6">
          <h2
            className="font-semibold text-[28px] text-[#151C27]"
            style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
          >
            Event Details
          </h2>
          <p className="text-sm text-[#41493A]" style={{ lineHeight: "21px" }}>
            Tell players what to expect. High-quality details attract
            competitive players.
          </p>
        </div>

        {/* Form Content */}
        <div className="flex flex-col gap-6 px-4">
          {/* Name & Description Group */}
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
                  style={{
                    background: "#F0F3FF",
                    border: "1px solid #C1CAB5",
                  }}
                >
                  <input
                    type="text"
                    placeholder="e.g. Friday Morning Smash"
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
                    className="w-full bg-transparent text-base text-[#6B7280] outline-none resize-none"
                    style={{ lineHeight: "24px", minHeight: "80px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date, Time & Players Group */}
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
                  style={{
                    background: "#F0F3FF",
                    border: "1px solid #C1CAB5",
                  }}
                >
                  <input
                    type="datetime-local"
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
                  style={{
                    background: "#F0F3FF",
                    border: "1px solid #C1CAB5",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Input Number of Players"
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
            style={{
              background: "#F0F3FF",
              border: "1px solid #C1CAB5",
            }}
          >
            {/* Header */}
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

            {/* Slider Track */}
            <div className="flex flex-col gap-4 py-4">
              {/* Level markers */}
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

            {/* Min/Max inputs */}
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
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #C1CAB5",
                    }}
                  >
                    <input
                      type="number"
                      value={minLevel}
                      onChange={(e) => setMinLevel(parseFloat(e.target.value))}
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
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #C1CAB5",
                    }}
                  >
                    <input
                      type="number"
                      value={maxLevel}
                      onChange={(e) => setMaxLevel(parseFloat(e.target.value))}
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

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-[448px] mx-auto px-6 py-6"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #F4F4F5",
          boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
        }}
      >
        <button
          className="w-full text-base font-normal text-[#9FE870] rounded-full"
          style={{
            background: "#121212",
            height: "56px",
            lineHeight: "24px",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
