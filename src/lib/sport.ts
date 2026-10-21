import type { Sport, SportScope } from "@/types/sport";

export const SPORT_LABEL: Record<Sport, string> = {
  padel: "Padel",
  tennis: "Tennis",
};

/**
 * Returns allowed club sport types based on current club sport type.
 * When creating (current is null): all 3 are allowed.
 * When editing: sports can be added, but not removed (add-only rule).
 * - padel -> ["padel", "both"]
 * - tennis -> ["tennis", "both"]
 * - both -> ["both"]
 */
export function allowedClubSportTypes(
  current: SportScope | null,
): SportScope[] {
  if (current === null) {
    return ["padel", "tennis", "both"];
  }
  switch (current) {
    case "padel":
      return ["padel", "both"];
    case "tennis":
      return ["tennis", "both"];
    case "both":
      return ["both"];
    default:
      return ["padel", "tennis", "both"];
  }
}

/**
 * Returns allowed event sport options given the club's sport type.
 * - both -> ["padel", "tennis"]
 * - tennis -> ["tennis"]
 * - padel -> ["padel"]
 */
export function eventSportOptions(clubSportType: SportScope): Sport[] {
  if (clubSportType === "both") {
    return ["padel", "tennis"];
  }
  return [clubSportType];
}

/**
 * Default event filter based on user preferred sports:
 * - "both" or null -> "all"
 * - "padel" -> "padel"
 * - "tennis" -> "tennis"
 */
export function defaultEventFilter(
  preferred: SportScope | null,
): Sport | "all" {
  if (preferred === "padel" || preferred === "tennis") {
    return preferred;
  }
  return "all";
}

/**
 * Default club filter based on user preferred sports:
 * - "both" or null -> "all"
 * - "padel" -> "padel"
 * - "tennis" -> "tennis"
 */
export function defaultClubFilter(
  preferred: SportScope | null,
): SportScope | "all" {
  if (preferred === "padel" || preferred === "tennis") {
    return preferred;
  }
  return "all";
}

/**
 * Score unit label for display:
 * - tennis -> "games"
 * - padel -> "points"
 */
export function scoreUnitLabel(sport: Sport): "points" | "games" {
  return sport === "tennis" ? "games" : "points";
}
