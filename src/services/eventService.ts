import type {
  CreateEventPayload,
  CreateEventSuccessResponse,
  CreateEventErrorResponse,
} from "@/types/event";
import { fetchWithAuth } from "@/services/authService";

export type {
  CreateEventPayload,
  CreateEventSuccessResponse,
  CreateEventErrorResponse,
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createEvent(
  payload: CreateEventPayload,
): Promise<CreateEventSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as CreateEventErrorResponse;
  }

  return data as CreateEventSuccessResponse;
}
