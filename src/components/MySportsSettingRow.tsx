"use client";

import { useEffect, useState } from "react";
import PreferredSportsSheet from "@/components/PreferredSportsSheet";
import { getUserProfileCache, setUserProfileCache } from "@/lib/userProfileCache";
import { fetchUserProfile } from "@/services/authService";
import type { SportScope } from "@/types/sport";

export default function MySportsSettingRow() {
  const [preferred, setPreferred] = useState<SportScope | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const cached = getUserProfileCache();
    if (cached) {
      setPreferred(cached.preferred_sports ?? null);
    }
    fetchUserProfile()
      .then((res) => {
        setUserProfileCache(res.data);
        setPreferred(res.data.preferred_sports ?? null);
      })
      .catch(() => {});
  }, []);

  const displayLabel =
    preferred === "padel"
      ? "Padel"
      : preferred === "tennis"
      ? "Tennis"
      : preferred === "both"
      ? "Both (Padel & Tennis)"
      : "Not set";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-4 bg-white border border-[#F4F4F5] border-b-0 hover:bg-[#F9F9FF] transition-colors text-left"
      >
        <div className="flex items-center gap-4">
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <div className="flex flex-col">
            <span className="text-base font-normal text-[#18181B]">
              Prefered Sport
            </span>
            <span className="text-xs text-[#717A68]">
              {displayLabel}
            </span>
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A1A1AA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {isOpen && (
        <PreferredSportsSheet
          isOpen={isOpen}
          initialValue={preferred}
          onClose={() => setIsOpen(false)}
          onSaved={(newSport) => {
            setPreferred(newSport);
            setIsOpen(false);
            const cached = getUserProfileCache();
            if (cached) {
              setUserProfileCache({ ...cached, preferred_sports: newSport });
            } else {
              fetchUserProfile()
                .then((res) => {
                  if (res?.data) setUserProfileCache(res.data);
                })
                .catch(() => {});
            }
          }}
        />
      )}
    </>
  );
}
