"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import CoverPhotoUpload from "@/components/CoverPhotoUpload";
import LogoUpload from "@/components/LogoUpload";
import { updateClub } from "@/services/clubService";
import type { Club, UpdateClubErrorResponse } from "@/types/club";
import { useSnackbar } from "@/context/SnackbarContext";

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
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Club name is required");
      return;
    }
    setNameError("");
    setIsSubmitting(true);

    try {
      const res = await updateClub(club.guid, {
        name: name.trim(),
        description: description.trim() || undefined,
        cover_photo: coverUrl ?? undefined,
        logo: logoUrl ?? undefined,
      });
      showSnackbar(res.message || "Club updated successfully");
      router.push(`/clubs/${club.guid}`);
    } catch (err) {
      const error = err as UpdateClubErrorResponse;
      setNameError(error?.message ?? "Failed to update club. Please try again.");
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
