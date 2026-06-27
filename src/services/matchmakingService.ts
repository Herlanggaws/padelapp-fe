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
} from "@/types/matchmaking";
import { fetchWithAuth } from "@/services/authService";

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
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createMatchmakingSession(
  payload: CreateMatchmakingSessionPayload,
): Promise<CreateMatchmakingSessionSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/matchmaking/session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as CreateMatchmakingSessionErrorResponse;
  }

  return data as CreateMatchmakingSessionSuccessResponse;
}

export async function fetchMatchmakingSession(
  sessionGuid: string,
): Promise<GetMatchmakingSessionSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/matchmaking/session/${sessionGuid}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as GetMatchmakingSessionErrorResponse;
  }

  return data as GetMatchmakingSessionSuccessResponse;
}

export async function submitMatchmakingMatchScore(
  matchGuid: string,
  payload: SubmitMatchmakingMatchScorePayload,
): Promise<SubmitMatchmakingMatchScoreSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/matchmaking/match/${matchGuid}/score`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as SubmitMatchmakingMatchScoreErrorResponse;
  }

  return data as SubmitMatchmakingMatchScoreSuccessResponse;
}

export async function editMatchmakingMatchScore(
  matchGuid: string,
  payload: EditMatchmakingMatchScorePayload,
): Promise<EditMatchmakingMatchScoreSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/matchmaking/match/${matchGuid}/score/edit`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as EditMatchmakingMatchScoreErrorResponse;
  }

  return data as EditMatchmakingMatchScoreSuccessResponse;
}

export async function startMatchmakingRound(
  roundGuid: string,
): Promise<StartMatchmakingRoundSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/matchmaking/round/${roundGuid}/start`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as StartMatchmakingRoundErrorResponse;
  }

  return data as StartMatchmakingRoundSuccessResponse;
}

export async function cancelMatchmakingRound(
  roundGuid: string,
): Promise<CancelMatchmakingRoundSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/matchmaking/round/${roundGuid}/cancel`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as CancelMatchmakingRoundErrorResponse;
  }

  return data as CancelMatchmakingRoundSuccessResponse;
}

export async function generateMatchmakingRound(
  sessionGuid: string,
  payload: GenerateMatchmakingRoundPayload,
): Promise<GenerateMatchmakingRoundSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/matchmaking/session/${sessionGuid}/generate-round`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as GenerateMatchmakingRoundErrorResponse;
  }

  return data as GenerateMatchmakingRoundSuccessResponse;
}
