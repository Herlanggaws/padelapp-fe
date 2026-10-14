export interface MatchSidePlayer {
  guid: string;
  name: string;
  profile_photo?: string | null;
  [key: string]: unknown;
}

export interface MatchWithSides {
  team_a_player1?: MatchSidePlayer | null;
  team_a_player2?: MatchSidePlayer | null;
  team_b_player1?: MatchSidePlayer | null;
  team_b_player2?: MatchSidePlayer | null;
  team_a_player1_guid?: string | null;
  team_a_player2_guid?: string | null;
  team_b_player1_guid?: string | null;
  team_b_player2_guid?: string | null;
  team_a?: {
    player1?: MatchSidePlayer | null;
    player2?: MatchSidePlayer | null;
    players?: (MatchSidePlayer | null)[];
  } | null;
  team_b?: {
    player1?: MatchSidePlayer | null;
    player2?: MatchSidePlayer | null;
    players?: (MatchSidePlayer | null)[];
  } | null;
  [key: string]: unknown;
}

/**
 * Extracts non-null players for side A and side B of a match.
 * For singles matches, returns 1 player per side.
 * For doubles matches, returns 2 players per side.
 * Never returns null or undefined entries.
 */
export function getSidePlayers(match: MatchWithSides): {
  a: MatchSidePlayer[];
  b: MatchSidePlayer[];
} {
  const getPlayers = (side: "a" | "b"): MatchSidePlayer[] => {
    const list: MatchSidePlayer[] = [];
    const teamObj = side === "a" ? match.team_a : match.team_b;

    if (teamObj) {
      if (Array.isArray(teamObj.players)) {
        for (const p of teamObj.players) {
          if (p && p.guid) list.push(p);
        }
      } else {
        if (teamObj.player1 && teamObj.player1.guid) list.push(teamObj.player1);
        if (teamObj.player2 && teamObj.player2.guid) list.push(teamObj.player2);
      }
    }

    if (list.length === 0) {
      const p1 = side === "a" ? match.team_a_player1 : match.team_b_player1;
      const p2 = side === "a" ? match.team_a_player2 : match.team_b_player2;
      const g1 = side === "a" ? match.team_a_player1_guid : match.team_b_player1_guid;
      const g2 = side === "a" ? match.team_a_player2_guid : match.team_b_player2_guid;

      if (p1 && p1.guid) {
        list.push(p1);
      } else if (g1) {
        list.push({ guid: g1, name: "Player" });
      }

      if (p2 && p2.guid) {
        list.push(p2);
      } else if (g2) {
        list.push({ guid: g2, name: "Player" });
      }
    }

    return list;
  };

  return {
    a: getPlayers("a"),
    b: getPlayers("b"),
  };
}
