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

/** Padel Racket Icon (perforated solid teardrop racquet) */
export function PadelIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Racket Head (solid padel blade) */}
      <circle cx="12" cy="9.5" r="7.5" />
      {/* Holes in padel racket */}
      <circle cx="12" cy="7.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="10" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11.5" r="0.75" fill="currentColor" stroke="none" />
      {/* Handle */}
      <path d="M12 17v5" strokeWidth="2.2" />
      <path d="M10.5 22h3" strokeWidth="2" />
    </svg>
  );
}

/** Tennis Racket Icon (strung head with grip) */
export function TennisIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Racket Oval Head */}
      <ellipse cx="12" cy="9" rx="6.5" ry="7.5" />
      {/* Strings pattern */}
      <path d="M12 1.5v15" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <path d="M6 9h12" strokeWidth="1" strokeDasharray="1.5 1.5" />
      {/* Throat and Shaft */}
      <path d="M9.5 15.5L12 18l2.5-2.5" />
      <path d="M12 18v4.5" strokeWidth="2.2" />
      <path d="M10.5 22.5h3" strokeWidth="2" />
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

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full bg-[#18181B]/5 border border-[#18181B]/10 p-1 text-[#151C27] hover:bg-[#18181B]/10 transition-colors ${className}`}
      title={label}
      aria-label={label}
    >
      {target === "padel" && <PadelIcon />}
      {target === "tennis" && <TennisIcon />}
      {target === "both" && (
        <span className="inline-flex items-center gap-1 px-1">
          <PadelIcon />
          <span className="text-[10px] text-[#A1A1AA] leading-none">/</span>
          <TennisIcon />
        </span>
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
}
