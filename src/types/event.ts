export interface PendingRequestUser {
  guid: string;
  name: string;
  email: string;
  profile_photo: string;
}

export interface PendingRequest {
  participant_guid: string;
  user: PendingRequestUser;
  requested_at: string;
}

export interface FetchEventDetailSuccessResponse {
  data: Event;
  message: string;
}

export interface FetchEventDetailErrorResponse {
  message: string;
}

export type EventStandingsType = "wins" | "points";

export interface EventStandingUser {
  guid: string;
  name: string;
  email: string;
  profile_photo: string | null;
}

export interface EventStandingRow {
  user: EventStandingUser;
  rank: number;
  wins: number;
  games_played: number;
  score_diff: number;
}

export interface EventStandingsData {
  event_guid: string;
  type: EventStandingsType;
  standings: EventStandingRow[];
}

export interface FetchEventStandingsParams {
  event_guid: string;
  type: EventStandingsType;
}

export interface FetchEventStandingsSuccessResponse {
  data: EventStandingsData;
  message: string;
}

export interface FetchEventStandingsErrorResponse {
  message: string;
}

export interface CreateEventPayload {
  club_guid: string;
  name: string;
  description: string;
  date_time: string;
  number_of_players: number;
  min_level: number;
  max_level: number;
}

export interface CreateEventSuccessResponse {
  data: null;
  message: string;
}

export interface CreateEventErrorResponse {
  message: string;
}

export interface UpdateEventPayload {
  club_guid: string;
  name: string;
  description: string;
  date_time: string;
  number_of_players: number;
  min_level: number;
  max_level: number;
}

export interface UpdateEventSuccessResponse {
  data: null;
  message: string;
}

export interface UpdateEventErrorResponse {
  message: string;
}

export interface Event {
  guid: string;
  club_guid: string;
  name: string;
  description: string;
  date_time: string;
  number_of_players: number;
  number_of_participants: number;
  min_level: number;
  max_level: number;
  is_active: boolean;
  is_finished: boolean;
  is_joined: boolean;
  is_host: boolean;
  is_locked: boolean;
  session_guid: string;
  join_status: string;
  pending_requests: PendingRequest[] | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
}

export interface UpcomingEvent {
  guid: string;
  club_guid: string;
  name: string;
  description: string;
  date_time: string;
  number_of_players: number;
  number_of_participants: number;
  min_level: number;
  max_level: number;
  is_active: boolean;
  is_joined: boolean;
  is_host: boolean;
  is_locked: boolean;
  join_status: string;
  created_at: string;
  created_by: string;
}

export interface FetchUpcomingEventsParams {
  page?: number;
  limit?: number;
}

export interface FetchUpcomingEventsSuccessResponse {
  data: UpcomingEvent[];
  message: string;
  paginate: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
  };
}

export interface FetchUpcomingEventsErrorResponse {
  message: string;
}

export interface FetchEventsParams {
  page?: number;
  limit?: number;
}

export interface FetchEventsSuccessResponse {
  data: UpcomingEvent[];
  message: string;
  paginate: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
  };
}

export interface FetchEventsErrorResponse {
  message: string;
}

export interface FetchClubEventsParams {
  club_guid: string;
  sort?: string;
  direction?: string;
  page?: number;
  limit?: number;
}

export interface FetchClubEventsSuccessResponse {
  data: Event[];
  message: string;
  paginate: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
  };
}

export interface FetchClubEventsErrorResponse {
  message: string;
}

export interface JoinEventPayload {
  event_guid: string;
}

export interface JoinEventSuccessResponse {
  data: null;
  message: string;
}

export interface JoinEventErrorResponse {
  message: string;
}

export interface LeaveEventSuccessResponse {
  data: null;
  message: string;
}

export interface LeaveEventErrorResponse {
  message: string;
}

export interface ParticipantActionSuccessResponse {
  data: null;
  message: string;
}

export interface ParticipantActionErrorResponse {
  message: string;
}

export interface EventParticipantUser {
  guid: string;
  name: string;
  email: string;
  profile_photo: string | null;
}

export interface EventParticipant {
  guid: string;
  event_guid: string;
  user_guid: string;
  user: EventParticipantUser;
  status: string;
  joined_at: string;
  created_by: string;
}

export interface FetchEventParticipantsParams {
  event_guid: string;
  sort?: string;
  direction?: string;
  page?: number;
  limit?: number;
}

export interface FetchEventParticipantsSuccessResponse {
  data: EventParticipant[];
  message: string;
  paginate: {
    current_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
  };
}

export interface FetchEventParticipantsErrorResponse {
  message: string;
}

export interface AddOutsiderParticipantPayload {
  event_guid: string;
  outsider_name: string;
}

export interface AddOutsiderParticipantSuccessResponse {
  data: null;
  message: string;
}

export interface AddOutsiderParticipantErrorResponse {
  message: string;
}

export interface FinishEventSuccessResponse {
  data: null;
  message: string;
}

export interface FinishEventErrorResponse {
  message: string;
}
