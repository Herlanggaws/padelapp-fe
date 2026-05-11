"use client";

import { useRef, useCallback } from "react";

const MIN = 1.0;
const MAX = 7.0;
const STEP = 0.5;

interface LevelRangeSliderProps {
  minLevel: number;
  maxLevel: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export default function LevelRangeSlider({
  minLevel,
  maxLevel,
  onMinChange,
  onMaxChange,
}: LevelRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const snap = (value: number) => Math.round(value / STEP) * STEP;

  const clamp = (value: number, lo: number, hi: number) =>
    Math.min(Math.max(value, lo), hi);

  const valueFromPointer = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track) return MIN;
    const { left, width } = track.getBoundingClientRect();
    const ratio = clamp((clientX - left) / width, 0, 1);
    return snap(MIN + ratio * (MAX - MIN));
  }, []);

  const handleMinPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const v = clamp(valueFromPointer(ev.clientX), MIN, maxLevel - STEP);
      onMinChange(parseFloat(v.toFixed(1)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const handleMaxPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const v = clamp(valueFromPointer(ev.clientX), minLevel + STEP, MAX);
      onMaxChange(parseFloat(v.toFixed(1)));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const toPercent = (value: number) => ((value - MIN) / (MAX - MIN)) * 100;

  const levels = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0];

  return (
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
        {/* Track */}
        <div
          ref={trackRef}
          className="w-full h-2 rounded-full relative"
          style={{ background: "#DCE2F3" }}
        >
          {/* Active range fill */}
          <div
            className="absolute top-0 h-2 rounded-full pointer-events-none"
            style={{
              background: "#9FE870",
              left: `${toPercent(minLevel)}%`,
              right: `${100 - toPercent(maxLevel)}%`,
            }}
          />
          {/* Min thumb */}
          <div
            className="absolute top-[14px] -translate-y-1/2 w-5 h-5 rounded-full cursor-grab active:cursor-grabbing shadow-md"
            style={{
              background: "#18181B",
              border: "2px solid #9FE870",
              left: `${toPercent(minLevel)}%`,
              transform: "translate(-50%, -50%)",
              touchAction: "none",
            }}
            onPointerDown={handleMinPointerDown}
          />
          {/* Max thumb */}
          <div
            className="absolute top-[14px] -translate-y-1/2 w-5 h-5 rounded-full cursor-grab active:cursor-grabbing shadow-md"
            style={{
              background: "#18181B",
              border: "2px solid #9FE870",
              left: `${toPercent(maxLevel)}%`,
              transform: "translate(-50%, -50%)",
              touchAction: "none",
            }}
            onPointerDown={handleMaxPointerDown}
          />
        </div>

        {/* Tick labels */}
        <div className="flex justify-between">
          {levels.map((level) => (
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

      {/* Read-only display inputs */}
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
                value={minLevel.toFixed(1)}
                readOnly
                className="w-full bg-transparent text-base font-normal text-[#151C27] outline-none text-center cursor-default"
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
                value={maxLevel.toFixed(1)}
                readOnly
                className="w-full bg-transparent text-base font-normal text-[#151C27] outline-none text-center cursor-default"
                style={{ lineHeight: "24px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
