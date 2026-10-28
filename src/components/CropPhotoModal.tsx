"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

export interface CropPhotoModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  fileName?: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => Promise<void> | void;
  isSaving?: boolean;
}

export default function CropPhotoModal({
  isOpen,
  imageSrc,
  fileName = "profile-photo.jpg",
  onClose,
  onCropComplete,
  isSaving = false,
}: CropPhotoModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropCompleteCallback = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  if (!isOpen || !imageSrc) return null;

  const handleSave = async () => {
    if (!croppedAreaPixels || isSaving) return;
    try {
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        fileName,
      );
      await onCropComplete(croppedFile);
    } catch (err) {
      console.error("Error cropping image:", err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative bg-white rounded-3xl max-w-[420px] w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F4F4F5]">
          <div className="flex flex-col">
            <h3
              id="crop-modal-title"
              className="text-lg font-semibold text-[#151C27]"
            >
              Crop Profile Picture
            </h3>
            <p className="text-xs text-[#717A68]">
              Drag to reposition, use slider to zoom
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#717A68] hover:text-[#151C27] hover:bg-[#F4F4F5] transition-colors disabled:opacity-50"
            aria-label="Close crop modal"
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

        {/* Cropper Container */}
        <div className="relative w-full h-72 bg-[#18181B] select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={handleCropCompleteCallback}
            onZoomChange={setZoom}
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3 px-6 py-4 bg-[#F9F9FF] border-t border-[#F4F4F5]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#717A68"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#2F6C00] cursor-pointer"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#717A68"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 p-4 border-t border-[#F4F4F5] bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 h-12 rounded-full border border-[#E4E4E7] text-sm font-medium text-[#5D5F5F] hover:bg-[#F4F4F5] hover:text-[#151C27] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !croppedAreaPixels}
            className="flex-1 h-12 rounded-full bg-[#9FE870] hover:bg-[#8fd860] active:scale-95 text-[#18181B] text-sm font-semibold flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Photo"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
