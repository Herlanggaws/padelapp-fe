"use client";

import { useEffect, useState } from "react";

interface SnackBarProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function SnackBar({
  message,
  duration = 4000,
  onClose,
}: SnackBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
      style={{ maxWidth: "calc(448px - 2rem)", width: "calc(100% - 2rem)" }}
    >
      <div className="bg-[#9FE870] text-[#2E6900] rounded-2xl px-5 py-4 flex items-center gap-3 shadow-lg">
        {/* Check icon */}
        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#2E6900]/10">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2E6900"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <p className="text-sm font-semibold flex-1">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-[#2E6900]/60 hover:text-[#2E6900] transition-colors"
          aria-label="Dismiss"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
