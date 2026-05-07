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
