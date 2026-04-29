"use client";

import { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export default function Modal({
  isOpen,
  onClose,
  title = "Error",
  message,
  fieldErrors,
}: ModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Small delay to trigger CSS transition
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Reset visible state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setVisible(false), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasFieldErrors = fieldErrors && Object.keys(fieldErrors).length > 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4 transition-all duration-300 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <h2 className="font-semibold text-[#151C27] text-base">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#151C27] transition-colors"
            aria-label="Close modal"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-[#5D5F5F]">{message}</p>

        {/* Field Errors */}
        {hasFieldErrors && (
          <ul className="flex flex-col gap-1">
            {Object.entries(fieldErrors!).map(([field, error]) => (
              <li
                key={field}
                className="text-sm text-red-500 flex items-start gap-1"
              >
                <span className="mt-0.5">•</span>
                <span>
                  <span className="font-medium capitalize">{field}</span>:{" "}
                  {error}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#151C27] text-[#9FE870] rounded-full py-3 font-semibold text-sm mt-1"
        >
          OK
        </button>
      </div>
    </div>
  );
}
