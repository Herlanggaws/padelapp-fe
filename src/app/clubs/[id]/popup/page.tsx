"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ClubPopupMenuProps {
  onClose: () => void;
}

export default function ClubPopupMenu({ onClose }: ClubPopupMenuProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    // Wait for animation to finish before unmounting
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          opacity: visible ? 1 : 0,
        }}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-[448px] mx-auto flex flex-col gap-8 px-6 pt-4 pb-10 transition-transform duration-300 ease-out"
        style={{
          background: "#18181B",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "40px 40px 0 0",
          boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-2">
          <div
            className="w-12 h-1.5 rounded-full"
            style={{ background: "#3F3F46" }}
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-4">
          {/* Invite Friends */}
          <div
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer"
            style={{ background: "transparent" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(159,232,112,0.1)" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9FE870"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span
                className="text-lg text-white"
                style={{ lineHeight: "28px" }}
              >
                Invite Friends
              </span>
              <span
                className="text-sm text-[#A1A1AA]"
                style={{ lineHeight: "20px" }}
              >
                Share this club with your padel partners
              </span>
            </div>
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L1 11"
                stroke="#A1A1AA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Create Event */}
          <Link
            href="/events/new"
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "transparent" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "#9FE870" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <line x1="12" y1="14" x2="12" y2="18" />
                <line x1="10" y1="16" x2="14" y2="16" />
              </svg>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span
                className="text-lg text-white"
                style={{ lineHeight: "28px" }}
              >
                Create Event
              </span>
              <span
                className="text-sm text-[#A1A1AA]"
                style={{ lineHeight: "20px" }}
              >
                Organize a match or coaching session
              </span>
            </div>
            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L1 11"
                stroke="#A1A1AA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
