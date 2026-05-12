export interface PendingRequestUser {
  guid: string;
  name: string;
  email: string;
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
