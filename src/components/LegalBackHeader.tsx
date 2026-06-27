"use client";

import { useRouter } from "next/navigation";
import BetaBadge from "@/components/BetaBadge";

interface LegalBackHeaderProps {
  title: string;
}

export default function LegalBackHeader({ title }: LegalBackHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center px-6 py-0 bg-white border-b border-[#F4F4F5] h-16 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full"
          aria-label="Go back"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="truncate font-semibold text-lg text-[#18181B]"
            style={{ letterSpacing: "-2.5%" }}
          >
            {title}
          </span>
          <BetaBadge />
        </div>
      </div>
    </header>
  );
}
