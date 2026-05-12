import type {
  CreateMatchmakingSessionPayload,
  CreateMatchmakingSessionSuccessResponse,
  CreateMatchmakingSessionErrorResponse,
} from "@/types/matchmaking";
import { fetchWithAuth } from "@/services/authService";

export type {
  CreateMatchmakingSessionPayload,
  CreateMatchmakingSessionSuccessResponse,
  CreateMatchmakingSessionErrorResponse,
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
