import Link from "next/link";
import { ReactNode } from "react";
import BackButtonClient from "@/components/BackButtonClient";
import BetaBadge from "@/components/BetaBadge";

interface TopAppBarProps {
  showBack?: boolean;
  backHref?: string;
  backFallback?: string;
  title?: string;
  showNotification?: boolean;
  showSettings?: boolean;
  rightAction?: ReactNode;
  transparent?: boolean;
}

export default function TopAppBar({
  showBack = false,
  backHref,
  backFallback,
  title,
  showNotification = false,
  showSettings = true,
  rightAction,
  transparent = false,
}: TopAppBarProps) {
  const headerStyle = transparent
    ? {
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #F4F4F5",
        boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
      }
    : {
        background: "#FFFFFF",
        borderBottom: "1px solid #F4F4F5",
      };

  const backLink = backHref ?? "javascript:history.back()";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 max-w-[448px] mx-auto w-full"
      style={headerStyle}
    >
      <div className="flex items-center gap-4">
        {showBack && (
          backFallback ? (
            <BackButtonClient fallbackHref={backFallback} />
          ) : (
            <Link href={backLink} className="p-2 rounded-full">
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
            </Link>
          )
        )}
        <div className="flex min-w-0 items-center gap-2">
          {title ? (
            <span className="truncate font-semibold text-lg tracking-tight text-[#18181B]">
              {title}
            </span>
          ) : (
            <span className="font-black text-2xl tracking-tight text-[#18181B]">
              RALLYRANK
            </span>
          )}
          <BetaBadge />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {showNotification && (
          <button className="p-1">
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
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        )}
        {rightAction}
        {showSettings && !rightAction && (
          <Link href="/settings" className="p-1">
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
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  );
}
