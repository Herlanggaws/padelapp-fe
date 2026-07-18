import type {
  CreateEventPayload,
  CreateEventSuccessResponse,
  CreateEventErrorResponse,
  FetchUpcomingEventsParams,
  FetchUpcomingEventsSuccessResponse,
  FetchUpcomingEventsErrorResponse,
  FetchEventsParams,
  FetchEventsSuccessResponse,
  FetchEventsErrorResponse,
  FetchClubEventsParams,
  FetchClubEventsSuccessResponse,
  FetchClubEventsErrorResponse,
  FetchEventDetailSuccessResponse,
  FetchEventDetailErrorResponse,
  FetchEventStandingsParams,
  FetchEventStandingsSuccessResponse,
  FetchEventStandingsErrorResponse,
  FetchPlayerEventSummarySuccessResponse,
  FetchPlayerEventSummaryErrorResponse,
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
  RemoveOutsiderParticipantSuccessResponse,
  RemoveOutsiderParticipantErrorResponse,
  FinishEventSuccessResponse,
  FinishEventErrorResponse,
  UpdateEventPayload,
  UpdateEventSuccessResponse,
  UpdateEventErrorResponse,
  DeleteEventSuccessResponse,
  DeleteEventErrorResponse,
} from "@/types/event";
import apiClient from "@/lib/apiClient";

export type {
  CreateEventPayload,
  CreateEventSuccessResponse,
  CreateEventErrorResponse,
  FetchUpcomingEventsParams,
  FetchUpcomingEventsSuccessResponse,
  FetchUpcomingEventsErrorResponse,
  FetchEventsParams,
  FetchEventsSuccessResponse,
  FetchEventsErrorResponse,
  FetchClubEventsParams,
  FetchClubEventsSuccessResponse,
  FetchClubEventsErrorResponse,
  FetchEventDetailSuccessResponse,
  FetchEventDetailErrorResponse,
  FetchEventStandingsParams,
  FetchEventStandingsSuccessResponse,
  FetchEventStandingsErrorResponse,
  FetchPlayerEventSummarySuccessResponse,
  FetchPlayerEventSummaryErrorResponse,
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
  RemoveOutsiderParticipantSuccessResponse,
  RemoveOutsiderParticipantErrorResponse,
  FinishEventSuccessResponse,
  FinishEventErrorResponse,
  UpdateEventPayload,
  UpdateEventSuccessResponse,
  UpdateEventErrorResponse,
  DeleteEventSuccessResponse,
  DeleteEventErrorResponse,
};

export async function fetchUpcomingEvents(
  params: FetchUpcomingEventsParams = {},
): Promise<FetchUpcomingEventsSuccessResponse> {
  const { page = 1, limit = 10 } = params;
  const { data } = await apiClient.get<FetchUpcomingEventsSuccessResponse>(
    "/padel/event/upcoming",
    { params: { page, limit } },
  );
  return data;
}

export async function fetchEvents(
  params: FetchEventsParams = {},
): Promise<FetchEventsSuccessResponse> {
  const { page = 1, limit = 10 } = params;
  const { data } = await apiClient.get<FetchEventsSuccessResponse>(
    "/padel/event",
    { params: { page, limit } },
  );
  return data;
}

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
  const { data } = await apiClient.get<FetchClubEventsSuccessResponse>(
    "/padel/event",
    { params: { club_guid, sort, direction, page, limit } },
  );
  return data;
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
  const { data } = await apiClient.get<FetchEventParticipantsSuccessResponse>(
    "/padel/event-participant",
    { params: { event_guid, sort, direction, page, limit } },
  );
  return data;
}

export async function fetchEventDetail(
  id: string,
): Promise<FetchEventDetailSuccessResponse> {
  const { data } = await apiClient.get<FetchEventDetailSuccessResponse>(
    `/padel/event/${id}`,
  );
  return data;
}

export async function fetchEventStandings(
  params: FetchEventStandingsParams,
): Promise<FetchEventStandingsSuccessResponse> {
  const { data } = await apiClient.get<FetchEventStandingsSuccessResponse>(
    `/padel/event/${params.event_guid}/standings`,
    { params: { type: params.type } },
  );
  return data;
}

export async function fetchPlayerEventSummary(
  eventGuid: string,
): Promise<FetchPlayerEventSummarySuccessResponse> {
  const { data } = await apiClient.get<FetchPlayerEventSummarySuccessResponse>(
    `/padel/event/${eventGuid}/standings/me`,
  );
  return data;
}

export async function joinEvent(
  payload: JoinEventPayload,
): Promise<JoinEventSuccessResponse> {
  const { data } = await apiClient.post<JoinEventSuccessResponse>(
    "/padel/event-participant",
    payload,
  );
  return data;
}

export async function leaveEvent(
  guid: string,
): Promise<LeaveEventSuccessResponse> {
  const { data } = await apiClient.delete<LeaveEventSuccessResponse>(
    `/padel/event-participant/${guid}`,
  );
  return data;
}

export async function approveParticipant(
  participantGuid: string,
): Promise<ParticipantActionSuccessResponse> {
  const { data } = await apiClient.put<ParticipantActionSuccessResponse>(
    `/padel/event-participant/${participantGuid}/approve`,
  );
  return data;
}

export async function rejectParticipant(
  participantGuid: string,
): Promise<ParticipantActionSuccessResponse> {
  const { data } = await apiClient.put<ParticipantActionSuccessResponse>(
    `/padel/event-participant/${participantGuid}/reject`,
  );
  return data;
}

export async function createEvent(
  payload: CreateEventPayload,
): Promise<CreateEventSuccessResponse> {
  const { data } = await apiClient.post<CreateEventSuccessResponse>(
    "/padel/event",
    payload,
  );
  return data;
}

export async function updateEvent(
  guid: string,
  payload: UpdateEventPayload,
): Promise<UpdateEventSuccessResponse> {
  const { data } = await apiClient.put<UpdateEventSuccessResponse>(
    `/padel/event/${guid}`,
    payload,
  );
  return data;
}

export async function addOutsiderParticipant(
  payload: AddOutsiderParticipantPayload,
): Promise<AddOutsiderParticipantSuccessResponse> {
  const { data } = await apiClient.post<AddOutsiderParticipantSuccessResponse>(
    "/padel/event-participant/outsider",
    payload,
  );
  return data;
}

export async function removeOutsiderParticipant(
  participantGuid: string,
): Promise<RemoveOutsiderParticipantSuccessResponse> {
  const { data } =
    await apiClient.delete<RemoveOutsiderParticipantSuccessResponse>(
      `/padel/event-participant/outsider/${participantGuid}`,
    );
  return data;
}

export async function deleteEvent(
  guid: string,
): Promise<DeleteEventSuccessResponse> {
  const { data } = await apiClient.delete<DeleteEventSuccessResponse>(
    `/padel/event/${guid}`,
  );
  return data;
}

export async function finishEvent(
  eventGuid: string,
): Promise<FinishEventSuccessResponse> {
  const { data } = await apiClient.put<FinishEventSuccessResponse>(
    `/padel/event/${eventGuid}/finish`,
  );
  return data;
}
