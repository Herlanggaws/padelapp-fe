import type {
  CreateMatchmakingSessionPayload,
  CreateMatchmakingSessionSuccessResponse,
  CreateMatchmakingSessionErrorResponse,
  GetMatchmakingSessionSuccessResponse,
  GetMatchmakingSessionErrorResponse,
  SubmitMatchmakingMatchScorePayload,
  SubmitMatchmakingMatchScoreSuccessResponse,
  SubmitMatchmakingMatchScoreErrorResponse,
  EditMatchmakingMatchScorePayload,
  EditMatchmakingMatchScoreSuccessResponse,
  EditMatchmakingMatchScoreErrorResponse,
  StartMatchmakingRoundSuccessResponse,
  StartMatchmakingRoundErrorResponse,
  CancelMatchmakingRoundSuccessResponse,
  CancelMatchmakingRoundErrorResponse,
  GenerateMatchmakingRoundPayload,
  GenerateMatchmakingRoundSuccessResponse,
  GenerateMatchmakingRoundErrorResponse,
  FetchMatchmakingAvailablePairsSuccessResponse,
  FetchMatchmakingAvailablePairsErrorResponse,
  UpdateMatchmakingPairsPayload,
  UpdateMatchmakingPairsSuccessResponse,
  UpdateMatchmakingPairsErrorResponse,
} from "@/types/matchmaking";
import apiClient from "@/lib/apiClient";

export type {
  CreateMatchmakingSessionPayload,
  CreateMatchmakingSessionSuccessResponse,
  CreateMatchmakingSessionErrorResponse,
  GetMatchmakingSessionSuccessResponse,
  GetMatchmakingSessionErrorResponse,
  SubmitMatchmakingMatchScorePayload,
  SubmitMatchmakingMatchScoreSuccessResponse,
  SubmitMatchmakingMatchScoreErrorResponse,
  EditMatchmakingMatchScorePayload,
  EditMatchmakingMatchScoreSuccessResponse,
  EditMatchmakingMatchScoreErrorResponse,
  StartMatchmakingRoundSuccessResponse,
  StartMatchmakingRoundErrorResponse,
  CancelMatchmakingRoundSuccessResponse,
  CancelMatchmakingRoundErrorResponse,
  GenerateMatchmakingRoundPayload,
  GenerateMatchmakingRoundSuccessResponse,
  GenerateMatchmakingRoundErrorResponse,
  FetchMatchmakingAvailablePairsSuccessResponse,
  FetchMatchmakingAvailablePairsErrorResponse,
  UpdateMatchmakingPairsPayload,
  UpdateMatchmakingPairsSuccessResponse,
  UpdateMatchmakingPairsErrorResponse,
};

export async function createMatchmakingSession(
  payload: CreateMatchmakingSessionPayload,
): Promise<CreateMatchmakingSessionSuccessResponse> {
  const { data } = await apiClient.post<CreateMatchmakingSessionSuccessResponse>(
    "/padel/matchmaking/session",
    payload,
  );
  return data;
}

export async function fetchMatchmakingSession(
  sessionGuid: string,
): Promise<GetMatchmakingSessionSuccessResponse> {
  const { data } = await apiClient.get<GetMatchmakingSessionSuccessResponse>(
    `/padel/matchmaking/session/${sessionGuid}`,
  );
  return data;
}

export async function submitMatchmakingMatchScore(
  matchGuid: string,
  payload: SubmitMatchmakingMatchScorePayload,
): Promise<SubmitMatchmakingMatchScoreSuccessResponse> {
  const { data } =
    await apiClient.put<SubmitMatchmakingMatchScoreSuccessResponse>(
      `/padel/matchmaking/match/${matchGuid}/score`,
      payload,
    );
  return data;
}

export async function editMatchmakingMatchScore(
  matchGuid: string,
  payload: EditMatchmakingMatchScorePayload,
): Promise<EditMatchmakingMatchScoreSuccessResponse> {
  const { data } =
    await apiClient.put<EditMatchmakingMatchScoreSuccessResponse>(
      `/padel/matchmaking/match/${matchGuid}/score/edit`,
      payload,
    );
  return data;
}

export async function startMatchmakingRound(
  roundGuid: string,
): Promise<StartMatchmakingRoundSuccessResponse> {
  const { data } = await apiClient.put<StartMatchmakingRoundSuccessResponse>(
    `/padel/matchmaking/round/${roundGuid}/start`,
    {},
  );
  return data;
}

export async function cancelMatchmakingRound(
  roundGuid: string,
): Promise<CancelMatchmakingRoundSuccessResponse> {
  const { data } = await apiClient.put<CancelMatchmakingRoundSuccessResponse>(
    `/padel/matchmaking/round/${roundGuid}/cancel`,
    {},
  );
  return data;
}

export async function generateMatchmakingRound(
  sessionGuid: string,
  payload: GenerateMatchmakingRoundPayload,
): Promise<GenerateMatchmakingRoundSuccessResponse> {
  const { data } =
    await apiClient.post<GenerateMatchmakingRoundSuccessResponse>(
      `/padel/matchmaking/session/${sessionGuid}/generate-round`,
      payload,
    );
  return data;
}

export async function fetchMatchmakingAvailablePairs(
  matchGuid: string,
  userGuid: string,
): Promise<FetchMatchmakingAvailablePairsSuccessResponse> {
  const { data } =
    await apiClient.get<FetchMatchmakingAvailablePairsSuccessResponse>(
      `/padel/matchmaking/match/${matchGuid}/available-pairs/${userGuid}`,
    );
  return data;
}

export async function updateMatchmakingPairs(
  matchGuid: string,
  payload: UpdateMatchmakingPairsPayload,
): Promise<UpdateMatchmakingPairsSuccessResponse> {
  const { data } = await apiClient.put<UpdateMatchmakingPairsSuccessResponse>(
    `/padel/matchmaking/match/${matchGuid}/pairs`,
    payload,
  );
  return data;
}
