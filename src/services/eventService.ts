import type {
  CreateEventPayload,
  CreateEventSuccessResponse,
  CreateEventErrorResponse,
  FetchClubEventsParams,
  FetchClubEventsSuccessResponse,
  FetchClubEventsErrorResponse,
  FetchEventDetailSuccessResponse,
  FetchEventDetailErrorResponse,
} from "@/types/event";
import { fetchWithAuth } from "@/services/authService";

export type {
  CreateEventPayload,
  CreateEventSuccessResponse,
  CreateEventErrorResponse,
  FetchClubEventsParams,
  FetchClubEventsSuccessResponse,
  FetchClubEventsErrorResponse,
  FetchEventDetailSuccessResponse,
  FetchEventDetailErrorResponse,
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchClubEvents(
  params: FetchClubEventsParams,
): Promise<FetchClubEventsSuccessResponse> {
  const {
    club_guid,
    sort = "created_at",
    direction = "ASC",
    page = 1,
    limit = 10,
  } = params;

  const query = new URLSearchParams({
    club_guid,
    sort,
    direction,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetchWithAuth(
    `${BASE_URL}/padel/event?${query.toString()}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchClubEventsErrorResponse;
  }

  return data as FetchClubEventsSuccessResponse;
}

export async function fetchEventDetail(
  id: string,
): Promise<FetchEventDetailSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/event/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchEventDetailErrorResponse;
  }

  return data as FetchEventDetailSuccessResponse;
}

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
