"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import ProfileJoinedClubsSectionClient from "@/components/ProfileJoinedClubsSectionClient";
import { fetchUserProfile } from "@/services/authService";
import {
  getUserProfileCache,
  setUserProfileCache,
} from "@/lib/userProfileCache";
import type { UserProfile } from "@/types/auth";

const DEFAULT_AVATAR = "https://i.pravatar.cc/128?img=3";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ProfileInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-[#F2F2F2] last:border-b-0">
      <span className="text-xs text-[#5F5E5E]">{label}</span>
      <span className="text-sm font-medium text-[#151C27] break-all">{value}</span>
    </div>
  );
}

export default function ProfilePageClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const cached = getUserProfileCache();
    if (cached) setProfile(cached);

    fetchUserProfile()
      .then((res) => {
        setUserProfileCache(res.data);
        setProfile(res.data);
      })
      .catch(() => {
        if (!cached) setProfile(null);
      });
  }, []);

  const avatarSrc =
    profile?.profile_photo?.trim() || DEFAULT_AVATAR;

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar showNotification={true} />

      <main className="flex flex-col gap-6 px-4 pt-20 pb-36">
        <section className="flex flex-col items-center gap-4 pb-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-[3px] border-[#9FE870] p-1 bg-white">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src={avatarSrc}
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#9FE870] rounded-full border-4 border-white flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2E6900"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1
              className="font-semibold text-[28px] text-[#151C27] text-center"
              style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
            >
              {profile?.name ?? "—"}
            </h1>
            <div className="flex items-center gap-2">
              <span className="bg-[#2F6C00] text-white text-xs font-semibold rounded-full px-3 py-1 tracking-[0.05em] uppercase">
                Rating {profile?.rank_points ?? "—"}
              </span>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="border border-[#F2F2F2] rounded-2xl overflow-hidden bg-white p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5F5E5E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              <span className="text-xs text-[#5F5E5E]">Matches Played</span>
            </div>
            <span className="font-semibold text-xl text-[#151C27]">
              {profile?.events_played ?? "—"}
            </span>
          </div>
        </section>

        {profile && (
          <section className="w-full">
            <div className="border border-[#F2F2F2] rounded-2xl overflow-hidden bg-white px-4 py-1">
              <ProfileInfoRow label="Email" value={profile.email} />
              <ProfileInfoRow
                label="Member since"
                value={formatDate(profile.created_at)}
              />
            </div>
          </section>
        )}

        <ProfileJoinedClubsSectionClient />
      </main>

      <BottomNavBar />
    </div>
  );
}
