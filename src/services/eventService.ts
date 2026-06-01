import type {
  CreateEventPayload,
  CreateEventSuccessResponse,
  CreateEventErrorResponse,
  FetchClubEventsParams,
  FetchClubEventsSuccessResponse,
  FetchClubEventsErrorResponse,
  FetchEventDetailSuccessResponse,
  FetchEventDetailErrorResponse,
  FetchEventStandingsParams,
  FetchEventStandingsSuccessResponse,
  FetchEventStandingsErrorResponse,
  JoinEventPayload,
  JoinEventSuccessResponse,
  JoinEventErrorResponse,
  LeaveEventSuccessResponse,
  LeaveEventErrorResponse,
  ParticipantActionSuccessResponse,
  ParticipantActionErrorResponse,
  FetchEventParticipantsParams,
  FetchEventParticipantsSuccessResponse,
  FetchEventParticipantsErrorResponse,
  AddOutsiderParticipantPayload,
  AddOutsiderParticipantSuccessResponse,
  AddOutsiderParticipantErrorResponse,
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
  FetchEventStandingsParams,
  FetchEventStandingsSuccessResponse,
  FetchEventStandingsErrorResponse,
  JoinEventPayload,
  JoinEventSuccessResponse,
  JoinEventErrorResponse,
  LeaveEventSuccessResponse,
  LeaveEventErrorResponse,
  ParticipantActionSuccessResponse,
  ParticipantActionErrorResponse,
  FetchEventParticipantsParams,
  FetchEventParticipantsSuccessResponse,
  FetchEventParticipantsErrorResponse,
  AddOutsiderParticipantPayload,
  AddOutsiderParticipantSuccessResponse,
  AddOutsiderParticipantErrorResponse,
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

export async function fetchEventParticipants(
  params: FetchEventParticipantsParams,
): Promise<FetchEventParticipantsSuccessResponse> {
  const {
    event_guid,
    sort = "created_at",
    direction = "ASC",
    page = 1,
    limit = 10,
  } = params;

  const query = new URLSearchParams({
    event_guid,
    sort,
    direction,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetchWithAuth(
    `${BASE_URL}/padel/event-participant?${query.toString()}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchEventParticipantsErrorResponse;
  }

  return data as FetchEventParticipantsSuccessResponse;
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

export async function fetchEventStandings(
  params: FetchEventStandingsParams,
): Promise<FetchEventStandingsSuccessResponse> {
  const query = new URLSearchParams({ type: params.type });
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/event/${params.event_guid}/standings?${query.toString()}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchEventStandingsErrorResponse;
  }

  return data as FetchEventStandingsSuccessResponse;
}

export async function joinEvent(
  payload: JoinEventPayload,
): Promise<JoinEventSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/event-participant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as JoinEventErrorResponse;
  }

  return data as JoinEventSuccessResponse;
}

export async function leaveEvent(
  guid: string,
): Promise<LeaveEventSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/event-participant/${guid}`,
    { method: "DELETE" },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as LeaveEventErrorResponse;
  }

  return data as LeaveEventSuccessResponse;
}

export async function approveParticipant(
  participantGuid: string,
): Promise<ParticipantActionSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/event-participant/${participantGuid}/approve`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as ParticipantActionErrorResponse;
  }

  return data as ParticipantActionSuccessResponse;
}

export async function rejectParticipant(
  participantGuid: string,
): Promise<ParticipantActionSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/event-participant/${participantGuid}/reject`,
    { method: "PUT" },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as ParticipantActionErrorResponse;
  }

  return data as ParticipantActionSuccessResponse;
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

export async function addOutsiderParticipant(
  payload: AddOutsiderParticipantPayload,
): Promise<AddOutsiderParticipantSuccessResponse> {
  const response = await fetchWithAuth(
    `${BASE_URL}/padel/event-participant/outsider`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data as AddOutsiderParticipantErrorResponse;
  }

  return data as AddOutsiderParticipantSuccessResponse;
}
