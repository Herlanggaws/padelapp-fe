"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CoverPhotoUpload from "@/components/CoverPhotoUpload";
import LogoUpload from "@/components/LogoUpload";
import { createClub } from "@/services/clubService";
import type { CreateClubErrorResponse } from "@/types/club";
import type { SportScope } from "@/types/sport";
import { useSnackbar } from "@/context/SnackbarContext";

const SPORT_OPTIONS: { value: SportScope; label: string }[] = [
  { value: "padel", label: "Padel" },
  { value: "tennis", label: "Tennis" },
  { value: "both", label: "Both" },
];

export default function ClubFormClient() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sportType, setSportType] = useState<SportScope>("padel");
  const [nameError, setNameError] = useState("");
  const [sportTypeError, setSportTypeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createClub({
        name: name.trim(),
        description: description.trim() || undefined,
        cover_photo: coverUrl ?? undefined,
        logo: logoUrl ?? undefined,
        sport_type: sportType,
      });
      showSnackbar("Club created successfully");
      router.push("/dashboard");
    } catch (err) {
      const error = err as CreateClubErrorResponse;
      if (error?.error?.sport_type) {
        setSportTypeError(error.error.sport_type);
      }
      if (error?.error?.name) {
        setNameError(error.error.name);
      } else if (!error?.error?.sport_type) {
        setNameError(error?.message ?? "Failed to create club. Please try again.");
      }
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

      {/* Sports Offered Section */}
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
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    setSportType(option.value);
                    setSportTypeError("");
                  }}
                  className={`flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                    isSelected
                      ? "bg-[#18181B] text-[#9FE870] border-[#18181B] shadow-sm"
                      : "bg-[#F0F3FF] text-[#151C27] border-[#C1CAB5] hover:border-[#18181B]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {sportTypeError && (
            <span className="text-xs text-red-500">{sportTypeError}</span>
          )}
        </div>
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
