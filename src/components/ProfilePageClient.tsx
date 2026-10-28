"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import ProfileJoinedClubsSectionClient from "@/components/ProfileJoinedClubsSectionClient";
import { fetchUserProfile, updateUserProfile } from "@/services/authService";
import { uploadFile } from "@/services/storageService";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  getUserProfileCache,
  setUserProfileCache,
} from "@/lib/userProfileCache";
import type { UserProfile } from "@/types/auth";

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

function getInitials(name: string | undefined | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

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
      <span className="text-sm font-medium text-[#151C27] break-all">
        {value}
      </span>
    </div>
  );
}

export default function ProfilePageClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setProfile(getUserProfileCache() ?? null);
    fetchUserProfile()
      .then((res) => {
        setUserProfileCache(res.data);
        setProfile(res.data);
      })
      .catch(() => {});
  }, []);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      showSnackbar("Only JPG, PNG, or WebP files are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      showSnackbar("File size must be less than 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const uploadRes = await uploadFile(file);
      const photoUrl = uploadRes.data.file.url;
      await updateUserProfile({ profile_photo: photoUrl });

      setProfile((prev) => (prev ? { ...prev, profile_photo: photoUrl } : prev));
      const cached = getUserProfileCache();
      if (cached) {
        setUserProfileCache({ ...cached, profile_photo: photoUrl });
      }
      showSnackbar("Profile picture updated successfully!");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to update profile picture. Please try again.";
      showSnackbar(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const avatarSrc = profile?.profile_photo?.trim() || null;

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar showNotification={true} />

      <main className="flex flex-col gap-6 px-4 pt-20 pb-36">
        <section className="flex flex-col items-center gap-4 pb-4">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              data-testid="profile-photo-input"
              aria-label="Upload profile picture"
              onChange={handlePhotoSelect}
              disabled={isUploading}
            />
            <div className="w-32 h-32 rounded-full border-[3px] border-[#9FE870] p-1 bg-white relative">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#9FE870] flex items-center justify-center">
                    <span className="text-[#2E6900] font-bold text-3xl select-none">
                      {getInitials(profile?.name)}
                    </span>
                  </div>
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                    <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Change profile photo"
              title="Change profile photo"
              className="absolute bottom-1 right-1 w-9 h-9 bg-[#9FE870] hover:bg-[#8fd860] active:scale-95 rounded-full border-4 border-white flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="w-3.5 h-3.5 border-2 border-[#2E6900] border-t-transparent rounded-full animate-spin" />
              ) : (
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
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1
              className="font-semibold text-[28px] text-[#151C27] text-center"
              style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
            >
              {profile?.name ?? "—"}
            </h1>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {profile?.rank_points_by_sport ? (
                (() => {
                  const sportsToShow = new Set<"padel" | "tennis">();
                  const pref = profile.preferred_sports;
                  if (pref === "padel" || pref === "both") sportsToShow.add("padel");
                  if (pref === "tennis" || pref === "both") sportsToShow.add("tennis");
                  if (profile.rank_points_by_sport.padel?.events_played > 0) sportsToShow.add("padel");
                  if (profile.rank_points_by_sport.tennis?.events_played > 0) sportsToShow.add("tennis");
                  if (sportsToShow.size === 0) sportsToShow.add("padel");

                  return Array.from(sportsToShow).map((sport) => {
                    const stats = profile.rank_points_by_sport?.[sport];
                    const label = sport === "tennis" ? "Tennis" : "Padel";
                    return (
                      <span
                        key={sport}
                        className="bg-[#2F6C00] text-white text-xs font-semibold rounded-full px-3 py-1 tracking-[0.05em] uppercase"
                      >
                        {label} {stats?.rank_points ?? 1.0}
                      </span>
                    );
                  });
                })()
              ) : (
                <span className="bg-[#2F6C00] text-white text-xs font-semibold rounded-full px-3 py-1 tracking-[0.05em] uppercase">
                  Padel {profile?.rank_points ?? "—"}
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="w-full">
          <Link
            href="/profile/matches"
            className="border border-[#F2F2F2] rounded-2xl overflow-hidden bg-white p-4 flex flex-col gap-2"
          >
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
          </Link>
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
