import { describe, it, expect } from "vitest";
import { getSidePlayers, type MatchWithSides } from "@/lib/matchSides";

describe("getSidePlayers (T21-AC4)", () => {
  it("returns 1 player per side for a singles match and drops null/missing player2", () => {
    const singlesMatch: MatchWithSides = {
      team_a_player1: { guid: "p1", name: "Alice" },
      team_a_player2: null,
      team_b_player1: { guid: "p2", name: "Bob" },
      team_b_player2: null,
    };

    const result = getSidePlayers(singlesMatch);
    expect(result.a).toHaveLength(1);
    expect(result.a[0].name).toBe("Alice");
    expect(result.b).toHaveLength(1);
    expect(result.b[0].name).toBe("Bob");
  });

  it("returns 2 players per side for a doubles match", () => {
    const doublesMatch: MatchWithSides = {
      team_a_player1: { guid: "p1", name: "Alice" },
      team_a_player2: { guid: "p2", name: "Amy" },
      team_b_player1: { guid: "p3", name: "Bob" },
      team_b_player2: { guid: "p4", name: "Bill" },
    };

    const result = getSidePlayers(doublesMatch);
    expect(result.a).toHaveLength(2);
    expect(result.a.map((p) => p.name)).toEqual(["Alice", "Amy"]);
    expect(result.b).toHaveLength(2);
    expect(result.b.map((p) => p.name)).toEqual(["Bob", "Bill"]);
  });

  it("never returns a null or undefined entry in the arrays", () => {
    const matchWithGaps: MatchWithSides = {
      team_a: {
        players: [{ guid: "p1", name: "Alice" }, null],
      },
      team_b: {
        player1: { guid: "p2", name: "Bob" },
        player2: null,
      },
    };

    const result = getSidePlayers(matchWithGaps);
    expect(result.a).toHaveLength(1);
    expect(result.b).toHaveLength(1);
    expect(result.a.every((p) => p != null)).toBe(true);
    expect(result.b.every((p) => p != null)).toBe(true);
  });
});
