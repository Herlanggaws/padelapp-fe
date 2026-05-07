export interface CreateClubPayload {
  name: string;
  description?: string;
  cover_photo?: string;
  logo?: string;
}

export interface CreateClubSuccessResponse {
  data: null;
  message: string;
}

export interface CreateClubErrorResponse {
  message: string;
}

// Explore Clubs types
export interface Club {
  guid: string;
  name: string;
  description?: string;
  cover_photo?: string;
  logo?: string;
  is_active: boolean;
  member_count?: number;
  rating?: number;
  is_member?: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
}

export interface FetchClubsParams {
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface FetchClubsPaginate {
  current_page: number;
  per_page: number;
  total_page: number;
  total_data: number;
}

export interface FetchClubsSuccessResponse {
  data: Club[];
  message: string;
  total_data?: number;
  paginate?: FetchClubsPaginate;
}

export interface FetchClubsErrorResponse {
  message: string;
}

export interface JoinClubSuccessResponse {
  data: null;
  message: string;
}

export interface JoinClubErrorResponse {
  message: string;
}

export interface FetchClubDetailSuccessResponse {
  data: Club;
  message: string;
}

export interface FetchClubDetailErrorResponse {
  error: { error: string };
  message: string;
}

export interface ClubMemberUser {
  guid: string;
  name: string;
  email: string;
}

export interface ClubMember {
  guid: string;
  club_guid: string;
  user_guid: string;
  user: ClubMemberUser;
  joined_at: string;
  created_by: string;
}

export interface FetchClubMembersParams {
  club_guid: string;
  search?: string;
  sort?: string;
  direction?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface FetchClubMembersSuccessResponse {
  data: ClubMember[];
  message: string;
  total_data: number;
}

export interface FetchClubMembersErrorResponse {
  message: string;
}
