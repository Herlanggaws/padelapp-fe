import type { Sport, SportScope } from "@/types/sport";

export interface SportBadgeProps {
  sport?: Sport;
  sportType?: SportScope;
  className?: string;
}

export function formatSportBadgeLabel(
  sport?: Sport,
  sportType?: SportScope,
): string {
  const target = sportType ?? sport;

  switch (target) {
    case "tennis":
      return "Tennis";
    case "padel":
      return "Padel";
    case "both":
      return "Padel · Tennis";
    default:
      return "";
  }
}

/**
 * Padel Racket Icon: Tilted 45° solid teardrop paddle with prominent perforations
 */
export function PadelIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <g transform="rotate(45 12 12)">
        {/* Solid-filled paddle head */}
        <path
          d="M12 2C7.8 2 5 5.2 5 9.2C5 12.6 7.2 15.2 9.8 16.2L10.5 18.5H13.5L14.2 16.2C16.8 15.2 19 12.6 19 9.2C19 5.2 16.2 2 12 2Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Handle */}
        <path
          d="M11 18.5V22.5M13 18.5V22.5M10.2 22.5H13.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Prominent Padel Holes */}
        <circle cx="10" cy="7" r="1" fill="currentColor" />
        <circle cx="14" cy="7" r="1" fill="currentColor" />
        <circle cx="9.5" cy="10.2" r="1" fill="currentColor" />
        <circle cx="12" cy="9.5" r="1" fill="currentColor" />
        <circle cx="14.5" cy="10.2" r="1" fill="currentColor" />
        <circle cx="11" cy="12.5" r="1" fill="currentColor" />
        <circle cx="13" cy="12.5" r="1" fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * Tennis Icon: Classic tennis ball with the two iconic curved seams
 */
export function TennisIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {/* Ball outer circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {/* Left curved seam */}
      <path
        d="M5.6 5.6C8.2 7.5 9.5 9.6 9.5 12C9.5 14.4 8.2 16.5 5.6 18.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Right curved seam */}
      <path
        d="M18.4 5.6C15.8 7.5 14.5 9.6 14.5 12C14.5 14.4 15.8 16.5 18.4 18.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SportBadge({
  sport,
  sportType,
  className = "",
}: SportBadgeProps) {
  const target = sportType ?? sport;
  const label = formatSportBadgeLabel(sport, sportType);

  if (!target || !label) {
    return null;
  }

  if (target === "padel") {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 rounded-full bg-[#0284C7]/10 border border-[#0284C7]/25 p-1.5 text-[#0369A1] transition-colors ${className}`}
        title={label}
        aria-label={label}
      >
        <PadelIcon />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  if (target === "tennis") {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 rounded-full bg-[#65A30D]/15 border border-[#65A30D]/30 p-1.5 text-[#3F6212] transition-colors ${className}`}
        title={label}
        aria-label={label}
      >
        <TennisIcon />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  // target === "both"
  return (
    <span
      className={`inline-flex items-center gap-1 shrink-0 rounded-full bg-[#18181B]/5 border border-[#18181B]/15 px-2 py-1 transition-colors ${className}`}
      title={label}
      aria-label={label}
    >
      <span className="text-[#0369A1] inline-flex items-center">
        <PadelIcon />
      </span>
      <span className="w-[1px] h-3 bg-[#18181B]/15 mx-0.5" />
      <span className="text-[#3F6212] inline-flex items-center">
        <TennisIcon />
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
