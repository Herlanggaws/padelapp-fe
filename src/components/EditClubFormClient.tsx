"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import CoverPhotoUpload from "@/components/CoverPhotoUpload";
import LogoUpload from "@/components/LogoUpload";
import { updateClub } from "@/services/clubService";
import type { Club, UpdateClubErrorResponse } from "@/types/club";
import { allowedClubSportTypes } from "@/lib/sport";
import type { SportScope } from "@/types/sport";
import { useSnackbar } from "@/context/SnackbarContext";

const SPORT_OPTIONS: { value: SportScope; label: string }[] = [
  { value: "padel", label: "Padel" },
  { value: "tennis", label: "Tennis" },
  { value: "both", label: "Both" },
];

interface EditClubFormClientProps {
  club: Club;
}

export default function EditClubFormClient({ club }: EditClubFormClientProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [coverUrl, setCoverUrl] = useState<string | null>(
    club.cover_photo ?? null,
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(club.logo ?? null);
  const [name, setName] = useState(club.name);
  const [description, setDescription] = useState(club.description ?? "");
  const [sportType, setSportType] = useState<SportScope>(
    club.sport_type ?? "padel",
  );
  const [nameError, setNameError] = useState("");
  const [sportTypeError, setSportTypeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allowedSports = allowedClubSportTypes(club.sport_type ?? "padel");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Club name is required");
      return;
    }
    setNameError("");
    setSportTypeError("");
    setIsSubmitting(true);

    try {
      const res = await updateClub(club.guid, {
        name: name.trim(),
        description: description.trim() || undefined,
        cover_photo: coverUrl ?? undefined,
        logo: logoUrl ?? undefined,
        sport_type: sportType,
      });
      showSnackbar(res.message || "Club updated successfully");
      router.push(`/clubs/${club.guid}`);
    } catch (err) {
      const error = err as UpdateClubErrorResponse;
      if (error?.error?.sport_type) {
        setSportTypeError(error.error.sport_type);
      }
      if (error?.error?.name) {
        setNameError(error.error.name);
      } else if (!error?.error?.sport_type) {
        setNameError(error?.message ?? "Failed to update club. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar
        showBack
        backFallback={`/clubs/${club.guid}`}
        title="Club Management"
        showSettings={false}
      />

      <main
        className="flex flex-col gap-10 px-4 pb-10"
        style={{ paddingTop: "88px" }}
      >
        <div className="flex flex-col gap-2">
          <h2
            className="font-semibold text-[28px] text-[#151C27]"
            style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
          >
            Edit Club
          </h2>
          <p className="text-sm text-[#41493A]" style={{ lineHeight: "21px" }}>
            Update your club details, cover photo, and logo.
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <span
              className="text-xs font-semibold text-[#41493A] uppercase tracking-[5%]"
              style={{ lineHeight: "12px" }}
            >
              VISUAL IDENTITY
            </span>

            <CoverPhotoUpload
              initialUrl={club.cover_photo}
              onUpload={setCoverUrl}
            />
            <LogoUpload initialUrl={club.logo} onUpload={setLogoUrl} />
          </div>

          <div className="flex flex-col gap-4">
            <span
              className="text-xs font-semibold text-[#41493A] uppercase tracking-[5%]"
              style={{ lineHeight: "12px" }}
            >
              SPORTS OFFERED
            </span>

            <div className="flex flex-col gap-2">
              <div
                role="radiogroup"
                aria-label="Sports Offered"
                className="grid grid-cols-3 gap-2"
              >
                {SPORT_OPTIONS.map((option) => {
                  const isSelected = sportType === option.value;
                  const isAllowed = allowedSports.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={!isAllowed}
                      onClick={() => {
                        if (isAllowed) {
                          setSportType(option.value);
                          setSportTypeError("");
                        }
                      }}
                      className={`flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                        !isAllowed
                          ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                          : isSelected
                            ? "bg-[#18181B] text-[#9FE870] border-[#18181B] shadow-sm"
                            : "bg-[#F0F3FF] text-[#151C27] border-[#C1CAB5] hover:border-[#18181B]"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#71717A]">
                Sports can be added but not removed
              </p>
              {sportTypeError && (
                <span className="text-xs text-red-500">{sportTypeError}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span
              className="text-xs font-semibold text-[#41493A] uppercase tracking-[5%]"
              style={{ lineHeight: "12px" }}
            >
              BASIC DETAILS
            </span>

            <div className="flex flex-col gap-1">
              <div
                className="w-full px-4 rounded-lg"
                style={{
                  background: "#F0F3FF",
                  border: nameError ? "1px solid #EF4444" : "1px solid #C1CAB5",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Club Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#6B7280] outline-none"
                  style={{ lineHeight: "21px" }}
                />
              </div>
              {nameError && (
                <span className="text-xs text-red-500">{nameError}</span>
              )}
            </div>

            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{
                background: "#F0F3FF",
                border: "1px solid #C1CAB5",
                minHeight: "120px",
              }}
            >
              <textarea
                placeholder="Club Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent text-sm text-[#6B7280] outline-none resize-none"
                style={{ lineHeight: "21px", minHeight: "96px" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 py-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-base font-normal text-[#121212] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#9FE870",
                height: "56px",
                lineHeight: "24px",
              }}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
