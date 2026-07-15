"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { uploadFile } from "@/services/storageService";
import type { UploadFileErrorResponse } from "@/types/storage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface CoverPhotoUploadProps {
  onUpload?: (url: string | null) => void;
  initialUrl?: string | null;
}


export default function CoverPhotoUpload({ onUpload, initialUrl }: CoverPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function processFile(file: File) {
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading]);

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onUpload?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleClick() {
    if (!isUploading) inputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className="w-full h-40 rounded-[32px] flex flex-col items-center justify-center gap-2 relative overflow-hidden"
        style={{
          background: isUploading ? "#D6E4FE" : isDragging ? "#D6E4FE" : "#E7EEFE",
          border: `2px dashed ${isDragging ? "#5B8DEF" : "#C1CAB5"}`,
          transition: "background 0.2s, border-color 0.2s",
          cursor: isUploading ? "not-allowed" : "pointer",
          opacity: isUploading ? 0.7 : 1,
        }}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#5B8DEF" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-semibold text-[#151C27]" style={{ lineHeight: "12px" }}>
              Uploading…
            </span>
          </div>
        ) : preview ? (
          <>
            <Image
              src={preview}
              alt="Cover photo preview"
              fill
              className="object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow"
              aria-label="Remove cover photo"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="#151C27" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <svg width="28" height="25" viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.5 25C1.8125 25 1.22396 24.7552 0.734375 24.2656C0.244792 23.776 0 23.1875 0 22.5V7.5C0 6.8125 0.244792 6.22396 0.734375 5.73438C1.22396 5.24479 1.8125 5 2.5 5H6.4375L8.75 2.5H16.25V5H9.84375L7.5625 7.5H2.5V22.5H22.5V11.25H25V22.5C25 23.1875 24.7552 23.776 24.2656 24.2656C23.776 24.7552 23.1875 25 22.5 25H2.5ZM22.5 7.5V5H20V2.5H22.5V0H25V2.5H27.5V5H25V7.5H22.5ZM12.5 20.625C14.0625 20.625 15.3906 20.0781 16.4844 18.9844C17.5781 17.8906 18.125 16.5625 18.125 15C18.125 13.4375 17.5781 12.1094 16.4844 11.0156C15.3906 9.92188 14.0625 9.375 12.5 9.375C10.9375 9.375 9.60938 9.92188 8.51562 11.0156C7.42188 12.1094 6.875 13.4375 6.875 15C6.875 16.5625 7.42188 17.8906 8.51562 18.9844C9.60938 20.0781 10.9375 20.625 12.5 20.625ZM12.5 18.125C11.625 18.125 10.8854 17.8229 10.2812 17.2188C9.67708 16.6146 9.375 15.875 9.375 15C9.375 14.125 9.67708 13.3854 10.2812 12.7812C10.8854 12.1771 11.625 11.875 12.5 11.875C13.375 11.875 14.1146 12.1771 14.7188 12.7812C15.3229 13.3854 15.625 14.125 15.625 15C15.625 15.875 15.3229 16.6146 14.7188 17.2188C14.1146 17.8229 13.375 18.125 12.5 18.125Z"
                fill="#2F6C00"
              />
            </svg>
            <span className="text-xs font-semibold text-[#151C27]" style={{ lineHeight: "12px" }}>
              {isDragging ? "Drop photo here" : "Upload Cover Photo"}
            </span>
            <span className="text-xs text-[#41493A]" style={{ lineHeight: "12px" }}>
              Drag & drop or click to select
            </span>
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
      {error && (
        <span className="text-xs text-red-500" style={{ lineHeight: "16px" }}>
          {error}
        </span>
      )}
    </div>
  );
}
