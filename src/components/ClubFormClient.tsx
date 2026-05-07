"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CoverPhotoUpload from "@/components/CoverPhotoUpload";
import LogoUpload from "@/components/LogoUpload";
import { createClub } from "@/services/clubService";
import type { CreateClubErrorResponse } from "@/types/club";
import { useSnackbar } from "@/context/SnackbarContext";

export default function ClubFormClient() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
      await createClub({
        name: name.trim(),
        description: description.trim() || undefined,
        cover_photo: coverUrl ?? undefined,
        logo: logoUrl ?? undefined,
      });
      showSnackbar("Club created successfully");
      router.push("/dashboard");
    } catch (err) {
      const error = err as CreateClubErrorResponse;
      setNameError(error?.message ?? "Failed to create club. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Visual Identity Section */}
      <div className="flex flex-col gap-4">
        <span
          className="text-xs font-semibold text-[#41493A] uppercase tracking-[5%]"
          style={{ lineHeight: "12px" }}
        >
          VISUAL IDENTITY
        </span>

        <CoverPhotoUpload onUpload={setCoverUrl} />
        <LogoUpload onUpload={setLogoUrl} />
      </div>

      {/* Basic Details Section */}
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

      {/* Action Buttons */}
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
          {isSubmitting ? "Creating..." : "Create Club"}
        </button>
      </div>
    </form>
  );
}
