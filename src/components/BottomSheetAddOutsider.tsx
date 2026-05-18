"use client";

import { useState, useEffect } from "react";

interface BottomSheetAddOutsiderProps {
  onClose: () => void;
  onAdd: (name: string) => Promise<void>;
}

export default function BottomSheetAddOutsider({
  onClose,
  onAdd,
}: BottomSheetAddOutsiderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onAdd(name.trim());
      handleClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to add outsider player";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[448px] mx-auto">
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
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
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="rounded-full"
            style={{ width: "48px", height: "6px", background: "#D4D4D8" }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 px-6 pb-8 pt-4">
          {/* Info Card */}
          <div
            className="flex flex-col gap-0 rounded-2xl p-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid #C1CAB5",
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    fill="#2F6C00"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-base text-[#151C27]"
                  style={{ lineHeight: "24px" }}
                >
                  External Player
                </span>
                <span
                  className="text-base text-[#41493A]"
                  style={{ lineHeight: "24px" }}
                >
                  Adding an outsider allows you to track scores for players not
                  currently registered in the system.
                </span>
              </div>
            </div>
          </div>

          {/* Full Name Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-base text-[#151C27]"
              style={{ lineHeight: "24px" }}
            >
              Full Name
            </label>
            <div className="relative">
              {/* Person icon inside input */}
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                    fill="#717A68"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="e.g. John Doe"
                className="w-full rounded-xl outline-none text-base text-[#151C27] placeholder-[#717A68]"
                style={{
                  background: "#F0F3FF",
                  border: errorMessage ? "1px solid #BA1A1A" : "1px solid #C1CAB5",
                  padding: "18px 16px 18px 48px",
                  lineHeight: "24px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>
            {errorMessage && (
              <span className="text-sm text-[#BA1A1A]">{errorMessage}</span>
            )}
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-4 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim()}
              className="relative w-full flex items-center justify-center gap-2 rounded-full text-base font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#18181B",
                color: "#9FE870",
                height: "64px",
                lineHeight: "24px",
              }}
            >
              {/* Add person icon */}
              <svg
                width="22"
                height="16"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8.33333V5.83333H13.5V4.16667H16V1.66667H17.6667V4.16667H20.1667V5.83333H17.6667V8.33333H16ZM8.33333 6.66667C7.41667 6.66667 6.63194 6.34028 5.97917 5.6875C5.32639 5.03472 5 4.25 5 3.33333C5 2.41667 5.32639 1.63194 5.97917 0.979167C6.63194 0.326389 7.41667 0 8.33333 0C9.25 0 10.0347 0.326389 10.6875 0.979167C11.3403 1.63194 11.6667 2.41667 11.6667 3.33333C11.6667 4.25 11.3403 5.03472 10.6875 5.6875C10.0347 6.34028 9.25 6.66667 8.33333 6.66667ZM1.66667 13.3333V11C1.66667 10.5278 1.78819 10.0938 2.03125 9.69792C2.27431 9.30208 2.59722 9 3 8.79167C3.86111 8.36111 4.73611 8.03819 5.625 7.82292C6.51389 7.60764 7.41667 7.5 8.33333 7.5C9.25 7.5 10.1528 7.60764 11.0417 7.82292C11.9306 8.03819 12.8056 8.36111 13.6667 8.79167C14.0694 9 14.3924 9.30208 14.6354 9.69792C14.8785 10.0938 15 10.5278 15 11V13.3333H1.66667Z"
                  fill="#9FE870"
                />
              </svg>
              {isSubmitting ? "Adding..." : "Add to List"}
            </button>
            <p
              className="text-center text-base text-[#717A68]"
              style={{ lineHeight: "24px" }}
            >
              The player will be added to this specific event only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
