"use client";

import { useEffect, useRef, useState } from "react";
import type { SportScope } from "@/types/sport";
import { updatePreferredSports } from "@/services/authService";
import { useSnackbar } from "@/context/SnackbarContext";

export interface PreferredSportsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (value: SportScope) => void;
  initialValue?: SportScope | null;
}

interface SportOption {
  value: SportScope;
  title: string;
  description: string;
}

const SPORT_OPTIONS: SportOption[] = [
  {
    value: "padel",
    title: "Padel",
    description: "Play and compete in padel events & ratings",
  },
  {
    value: "tennis",
    title: "Tennis",
    description: "Play and compete in tennis events & ratings",
  },
  {
    value: "both",
    title: "Both",
    description: "Follow both sports with dedicated ratings for each",
  },
];

export default function PreferredSportsSheet({
  isOpen,
  onClose,
  onSaved,
  initialValue = "padel",
}: PreferredSportsSheetProps) {
  const { showSnackbar } = useSnackbar();
  const [selectedSport, setSelectedSport] = useState<SportScope>(
    initialValue ?? "padel",
  );
  const [prevInitialValue, setPrevInitialValue] = useState<SportScope | null | undefined>(
    initialValue,
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Sync selectedSport when sheet opens or initialValue changes
  if (isOpen !== prevIsOpen || initialValue !== prevInitialValue) {
    setPrevIsOpen(isOpen);
    setPrevInitialValue(initialValue);
    if (isOpen) {
      setSelectedSport(initialValue ?? "padel");
    }
  }

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled])',
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus sheet or first element on mount
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      const firstFocusable = sheetRef.current.querySelector<HTMLElement>(
        'button:not([disabled])',
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updatePreferredSports({ preferred_sports: selectedSport });
      onSaved(selectedSport);
      onClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to update preferred sports";
      showSnackbar(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preferred-sports-title"
      className="fixed inset-0 z-50 flex flex-col justify-end max-w-[448px] mx-auto"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        ref={sheetRef}
        className="relative bg-[#F9F9FF] rounded-t-[48px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#D4D4D8] rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 pb-8 pt-4">
          <div className="flex flex-col gap-1">
            <h2
              id="preferred-sports-title"
              className="text-xl font-bold text-[#151C27]"
            >
              Choose your preferred sports
            </h2>
            <p className="text-sm text-[#5D5F5F]">
              Select which sports you play or want to follow. You can change this anytime in settings.
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {SPORT_OPTIONS.map((option) => {
              const isSelected = selectedSport === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedSport(option.value)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-white border-[#18181B] shadow-sm"
                      : "bg-white border-[#F4F4F5] hover:border-[#E4E4E7]"
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[#18181B] bg-[#18181B]"
                          : "border-[#D4D4D8] bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-[#9FE870]" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-[#151C27]">
                      {option.title}
                    </span>
                    <span className="text-xs text-[#5D5F5F]">
                      {option.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center rounded-full text-base font-medium h-14 bg-[#18181B] text-[#9FE870] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "Saving..." : "Save Preferences"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center rounded-full text-sm font-medium h-12 text-[#5D5F5F] hover:text-[#151C27] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
