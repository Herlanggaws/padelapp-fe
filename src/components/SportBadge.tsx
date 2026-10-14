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

export default function SportBadge({
  sport,
  sportType,
  className = "",
}: SportBadgeProps) {
  const label = formatSportBadgeLabel(sport, sportType);

  if (!label) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center shrink-0 rounded-full bg-[#18181B]/5 border border-[#18181B]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#151C27] ${className}`}
    >
      {label}
    </span>
  );
}
