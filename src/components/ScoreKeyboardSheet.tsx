"use client";

import { useEffect, useState } from "react";

const NUMBER_BG = "#E8EF34";
const NUMBER_BORDER = "#18181B";
const SPECIAL_BG = "#F5F0E1";
const HEADER_BG = "#F4F4F5";
const DONE_COLOR = "#2563EB";

const ROWS: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
];

const ROW4_NUMS = [27, 28, 29, 30, 31, 32];

function numKeyStyle(isActive: boolean) {
  return {
    background: NUMBER_BG,
    border: `1px solid ${NUMBER_BORDER}`,
    borderRadius: "10px",
    color: NUMBER_BORDER,
    fontWeight: 700 as const,
    fontSize: "15px",
    lineHeight: "20px",
    boxShadow: isActive ? "inset 0 0 0 2px #18181B" : undefined,
  };
}

function specialKeyStyle() {
  return {
    background: SPECIAL_BG,
    border: `1px solid ${NUMBER_BORDER}`,
    borderRadius: "10px",
    color: NUMBER_BORDER,
  };
}

export interface ScoreKeyboardSheetProps {
  isOpen: boolean;
  /** Backdrop tap — cancel without applying. */
  onRequestClose: () => void;
  /** Done — apply score (null clears). */
  onConfirm: (value: number | null) => void;
  initialValue: number | null;
}

export default function ScoreKeyboardSheet({
  isOpen,
  onRequestClose,
  onConfirm,
  initialValue,
}: ScoreKeyboardSheetProps) {
  const [draft, setDraft] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) setDraft(initialValue);
  }, [isOpen, initialValue]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDone = () => {
    onConfirm(draft);
  };

  const handleBackdrop = () => {
    onRequestClose();
  };

  const handleSystemKeyboard = () => {
    const el = document.getElementById("score-keyboard-fallback-input");
    if (el instanceof HTMLInputElement) {
      el.focus();
      el.click();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/35 border-0 cursor-default"
        aria-label="Close score keyboard"
        onClick={handleBackdrop}
      />

      <div
        className="relative z-[61] w-full max-w-[448px] mx-auto bg-white rounded-t-2xl overflow-hidden shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          id="score-keyboard-fallback-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="absolute opacity-0 w-0 h-0 pointer-events-none overflow-hidden"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
            if (raw === "") {
              setDraft(null);
              return;
            }
            const n = parseInt(raw, 10);
            if (!Number.isNaN(n) && n >= 0 && n <= 32) setDraft(n);
          }}
        />

        <div
          className="flex items-center justify-end px-4 py-3"
          style={{ background: HEADER_BG }}
        >
          <button
            type="button"
            className="text-base font-semibold bg-transparent border-0 cursor-pointer"
            style={{ color: DONE_COLOR }}
            onClick={handleDone}
          >
            Done
          </button>
        </div>

        <div className="px-3 pt-2 pb-3 flex flex-col gap-1.5">
          {ROWS.map((row) => (
            <div key={row[0]} className="grid grid-cols-9 gap-1">
              {row.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="h-11 flex items-center justify-center min-w-0 active:scale-[0.98] transition-transform"
                  style={numKeyStyle(draft === n)}
                  onClick={() => setDraft(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          ))}

          <div className="flex gap-1 items-stretch">
            <button
              type="button"
              className="h-11 w-[18%] shrink-0 flex items-center justify-center active:scale-[0.98]"
              style={specialKeyStyle()}
              aria-label="Use system keyboard"
              onClick={handleSystemKeyboard}
            >
              <svg
                width="22"
                height="14"
                viewBox="0 0 22 14"
                fill="none"
                aria-hidden
              >
                <rect
                  x="1"
                  y="1"
                  width="20"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 4h2M8 4h2M12 4h2M16 4h2M4 7h2M8 7h2M12 7h2M16 7h2M6 10h10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="flex-1 flex gap-1 min-w-0">
              {ROW4_NUMS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className="h-11 flex-1 min-w-0 flex items-center justify-center active:scale-[0.98]"
                  style={numKeyStyle(draft === n)}
                  onClick={() => setDraft(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="h-11 w-[18%] shrink-0 flex items-center justify-center active:scale-[0.98]"
              style={specialKeyStyle()}
              aria-label="Clear score"
              onClick={() => setDraft(null)}
            >
              <svg
                width="24"
                height="18"
                viewBox="0 0 24 18"
                fill="none"
                aria-hidden
              >
                <path
                  d="M8 2h14a2 2 0 012 2v10a2 2 0 01-2 2H8l-6-7 6-7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 6l-4 4m0-4l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
