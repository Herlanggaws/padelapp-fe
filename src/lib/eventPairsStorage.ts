import type { EventParticipant } from "@/types/event";
import type { EventMatchmakingPairTeam } from "@/types/matchmaking";

export interface EventPairPlayer {
  participant_guid: string;
  user_guid: string;
  name: string;
  profile_photo: string | null;
}

export interface EventPair {
  id: string;
  team_name: string;
  player1: EventPairPlayer;
  player2: EventPairPlayer;
}

function defaultTeamName(index: number) {
  return `Team ${index + 1}`;
}

function toPairPlayer(participant: EventParticipant): EventPairPlayer {
  return {
    participant_guid: participant.guid,
    user_guid: participant.user_guid,
    name: participant.user.name,
    profile_photo: participant.user.profile_photo,
  };
}

export function apiTeamsToEventPairs(
  teams: EventMatchmakingPairTeam[],
  participants: EventParticipant[],
): EventPair[] {
  const playerByGuid = new Map<string, EventPairPlayer>();
  for (const participant of participants) {
    playerByGuid.set(participant.guid, toPairPlayer(participant));
  }

  return teams
    .map((team, index) => {
      const player1 = playerByGuid.get(team.player1_guid);
      const player2 = playerByGuid.get(team.player2_guid);
      if (!player1 || !player2) return null;

      return {
        id: `${team.player1_guid}-${team.player2_guid}-${index}`,
        team_name: team.team_name?.trim() || defaultTeamName(index),
        player1,
        player2,
      } satisfies EventPair;
    })
    .filter((pair): pair is EventPair => pair !== null);
}

export function eventPairsToTeams(
  pairs: EventPair[],
): EventMatchmakingPairTeam[] {
  return pairs.map((pair) => ({
    player1_guid: pair.player1.participant_guid,
    player2_guid: pair.player2.participant_guid,
    team_name: pair.team_name.trim(),
  }));
}
