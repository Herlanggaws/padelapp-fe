"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadFile } from "@/services/storageService";
import type { UploadFileErrorResponse } from "@/types/storage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface LogoUploadProps {
  onUpload?: (url: string | null) => void;
  initialUrl?: string | null;
}

export default function LogoUpload({ onUpload, initialUrl }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, or WebP files are allowed.");
      return;
    }
    setError(null);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setIsUploading(true);
    try {
      const result = await uploadFile(file);
      onUpload?.(result.data.file.url);
    } catch (err) {
      const e = err as UploadFileErrorResponse;
      setError(e?.message ?? "Upload failed. Please try again.");
      setPreview(null);
      onUpload?.(null);
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onUpload?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 ">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden"
            style={{
              background: isUploading ? "#D6E4FE" : "#E2E8F8",
              border: "2px dashed #C1CAB5",
              cursor: isUploading ? "not-allowed" : "pointer",
              opacity: isUploading ? 0.7 : 1,
              transition: "background 0.2s, opacity 0.2s",
            }}
            onClick={() => {
              if (!isUploading) inputRef.current?.click();
            }}
          >
            {isUploading ? (
              <svg
                className="animate-spin"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#5B8DEF"
                  strokeWidth="3"
                  strokeDasharray="31.4 31.4"
                  strokeLinecap="round"
                />
              </svg>
            ) : preview ? (
              <>
                <Image
                  src={preview}
                  alt="Club logo preview"
                  fill
                  className="object-cover rounded-full"
                />
                <button
                  onClick={handleRemove}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity z-10"
                  aria-label="Remove logo"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M1 1L11 11M11 1L1 11"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 16C3.98333 16 2.6875 15.475 1.6125 14.425C0.5375 13.375 0 12.0917 0 10.575C0 9.275 0.391667 8.11667 1.175 7.1C1.95833 6.08333 2.98333 5.43333 4.25 5.15C4.66667 3.61667 5.5 2.375 6.75 1.425C8 0.475 9.41667 0 11 0C12.95 0 14.6042 0.679167 15.9625 2.0375C17.3208 3.39583 18 5.05 18 7C19.15 7.13333 20.1042 7.62917 20.8625 8.4875C21.6208 9.34583 22 10.35 22 11.5C22 12.75 21.5625 13.8125 20.6875 14.6875C19.8125 15.5625 18.75 16 17.5 16H12C11.45 16 10.9792 15.8042 10.5875 15.4125C10.1958 15.0208 10 14.55 10 14V8.85L8.4 10.4L7 9L11 5L15 9L13.6 10.4L12 8.85V14H17.5C18.2 14 18.7917 13.7583 19.275 13.275C19.7583 12.7917 20 12.2 20 11.5C20 10.8 19.7583 10.2083 19.275 9.725C18.7917 9.24167 18.2 9 17.5 9H16V7C16 5.61667 15.5125 4.4375 14.5375 3.4625C13.5625 2.4875 12.3833 2 11 2C9.61667 2 8.4375 2.4875 7.4625 3.4625C6.4875 4.4375 6 5.61667 6 7H5.5C4.53333 7 3.70833 7.34167 3.025 8.025C2.34167 8.70833 2 9.53333 2 10.5C2 11.4667 2.34167 12.2917 3.025 12.975C3.70833 13.6583 4.53333 14 5.5 14H8V16H5.5Z"
                    fill="#2F6C00"
                  />
                </svg>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileChange}
            />
          </div>
          <div className="absolute bottom-[-4px] right-[-1px] pointer-events-none">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_logo)">
                <rect
                  x="2"
                  y="1"
                  width="21"
                  height="21"
                  rx="10.5"
                  fill="#9FE870"
                  shapeRendering="crispEdges"
                />
                <rect
                  x="3"
                  y="2"
                  width="19"
                  height="19"
                  rx="9.5"
                  stroke="white"
                  strokeWidth="2"
                  shapeRendering="crispEdges"
                />
                <path
                  d="M8 16V13.875L14.6 7.2875C14.7 7.19583 14.8104 7.125 14.9313 7.075C15.0521 7.025 15.1792 7 15.3125 7C15.4458 7 15.575 7.025 15.7 7.075C15.825 7.125 15.9333 7.2 16.025 7.3L16.7125 8C16.8125 8.09167 16.8854 8.2 16.9312 8.325C16.9771 8.45 17 8.575 17 8.7C17 8.83333 16.9771 8.96042 16.9312 9.08125C16.8854 9.20208 16.8125 9.3125 16.7125 9.4125L10.125 16H8ZM15.3 9.4L16 8.7L15.3 8L14.6 8.7L15.3 9.4Z"
                  fill="#2E6900"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_logo"
                  x="0"
                  y="0"
                  width="25"
                  height="25"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="1" />
                  <feGaussianBlur stdDeviation="1" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_logo"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_logo"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span
            className="text-xs font-semibold text-[#151C27]"
            style={{ lineHeight: "12px" }}
          >
            Club Logo
          </span>
          <span
            className="text-xs text-[#41493A]"
            style={{ lineHeight: "12px" }}
          >
            PNG, JPG or WebP (min. 400x400px)
          </span>
        </div>
      </div>
      {error && (
        <span className="text-xs text-red-500" style={{ lineHeight: "16px" }}>
          {error}
        </span>
      )}
    </div>
  );
}
