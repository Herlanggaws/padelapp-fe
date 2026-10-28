import { describe, it, expect } from "vitest";
import {
  SPORT_LABEL,
  allowedClubSportTypes,
  eventSportOptions,
  defaultEventFilter,
  defaultClubFilter,
  scoreUnitLabel,
} from "../sport";

describe("sport lib helpers", () => {
  it("SPORT_LABEL defines human readable sport labels", () => {
    expect(SPORT_LABEL.padel).toBe("Padel");
    expect(SPORT_LABEL.tennis).toBe("Tennis");
  });

  it("allowedClubSportTypes respects add-only rule", () => {
    expect(allowedClubSportTypes(null)).toEqual(["padel", "tennis", "both"]);
    expect(allowedClubSportTypes("padel")).toEqual(["padel", "both"]);
    expect(allowedClubSportTypes("tennis")).toEqual(["tennis", "both"]);
    expect(allowedClubSportTypes("both")).toEqual(["both"]);
  });

  it("eventSportOptions restricts options based on club sports", () => {
    expect(eventSportOptions("both")).toEqual(["padel", "tennis"]);
    expect(eventSportOptions("tennis")).toEqual(["tennis"]);
    expect(eventSportOptions("padel")).toEqual(["padel"]);
  });

  it("defaultEventFilter defaults to all", () => {
    expect(defaultEventFilter(null)).toBe("all");
    expect(defaultEventFilter("both")).toBe("all");
    expect(defaultEventFilter("padel")).toBe("all");
    expect(defaultEventFilter("tennis")).toBe("all");
  });

  it("defaultClubFilter defaults to all", () => {
    expect(defaultClubFilter(null)).toBe("all");
    expect(defaultClubFilter("both")).toBe("all");
    expect(defaultClubFilter("padel")).toBe("all");
    expect(defaultClubFilter("tennis")).toBe("all");
  });

  it("scoreUnitLabel returns games for tennis and points for padel", () => {
    expect(scoreUnitLabel("tennis")).toBe("games");
    expect(scoreUnitLabel("padel")).toBe("points");
  });
});
