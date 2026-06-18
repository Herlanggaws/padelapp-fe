"use client";

import { useEffect, useState } from "react";

interface BottomSheetEventSettingsProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BottomSheetEventSettings({
  onClose,
  onEdit,
  onDelete,
}: BottomSheetEventSettingsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleEdit = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      onEdit();
    }, 300);
  };

  const handleDelete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      onDelete();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[448px] mx-auto">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      <div
        className={`relative flex flex-col transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          background: "#F9F9FF",
          borderRadius: "48px 48px 0px 0px",
          boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="rounded-full"
            style={{ width: "48px", height: "6px", background: "#D4D4D8" }}
          />
        </div>

        <div className="flex flex-col gap-3 px-6 pb-8 pt-4">
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-3 w-full rounded-2xl p-4 text-left"
            style={{
              background: "#FFFFFF",
              border: "1px solid #F4F4F5",
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#F4F4F5" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#18181B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-[#151C27]">Edit</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-3 w-full rounded-2xl p-4 text-left"
            style={{
              background: "#FFFFFF",
              border: "1px solid #F4F4F5",
              boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#FFF0F0" }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#BA1A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </div>
            <span className="text-base font-semibold text-[#BA1A1A]">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
