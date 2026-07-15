import type {
  CreateClubPayload,
  CreateClubSuccessResponse,
  CreateClubErrorResponse,
  UpdateClubPayload,
  UpdateClubSuccessResponse,
  UpdateClubErrorResponse,
  FetchClubsParams,
  FetchClubsSuccessResponse,
  FetchClubsErrorResponse,
  FetchClubDetailSuccessResponse,
  FetchClubDetailErrorResponse,
  JoinClubSuccessResponse,
  JoinClubErrorResponse,
  LeaveClubSuccessResponse,
  LeaveClubErrorResponse,
  Club,
  FetchClubMembersParams,
  FetchClubMembersSuccessResponse,
  FetchClubMembersErrorResponse,
  FetchJoinedClubsSuccessResponse,
  FetchJoinedClubsErrorResponse,
} from "@/types/club";
import { fetchWithAuth } from "@/services/authService";

export type {
  CreateClubPayload,
  CreateClubSuccessResponse,
  CreateClubErrorResponse,
  UpdateClubPayload,
  UpdateClubSuccessResponse,
  UpdateClubErrorResponse,
  FetchClubsParams,
  FetchClubsSuccessResponse,
  FetchClubsErrorResponse,
  FetchClubDetailSuccessResponse,
  FetchClubDetailErrorResponse,
  JoinClubSuccessResponse,
  JoinClubErrorResponse,
  LeaveClubSuccessResponse,
  LeaveClubErrorResponse,
  Club,
  FetchClubMembersParams,
  FetchClubMembersSuccessResponse,
  FetchClubMembersErrorResponse,
  FetchJoinedClubsSuccessResponse,
  FetchJoinedClubsErrorResponse,
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createClub(
  payload: CreateClubPayload,
): Promise<CreateClubSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/club`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as CreateClubErrorResponse;
  }

  return data as CreateClubSuccessResponse;
}

export async function updateClub(
  guid: string,
  payload: UpdateClubPayload,
): Promise<UpdateClubSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/club/${guid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as UpdateClubErrorResponse;
  }

  return data as UpdateClubSuccessResponse;
}

export async function fetchClubs(
  params?: FetchClubsParams,
): Promise<FetchClubsSuccessResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.direction) query.set("direction", params.direction);
  if (params?.page !== undefined) query.set("page", String(params.page));
  if (params?.limit !== undefined) query.set("limit", String(params.limit));

  const queryString = query.toString();
  const url = queryString
    ? `${BASE_URL}/padel/club?${queryString}`
    : `${BASE_URL}/padel/club`;

  const response = await fetchWithAuth(url);
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchClubsErrorResponse;
  }

  return data as FetchClubsSuccessResponse;
}

export async function fetchClubDetail(
  guid: string,
): Promise<FetchClubDetailSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/club/${guid}`);
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchClubDetailErrorResponse;
  }

  return data as FetchClubDetailSuccessResponse;
}

export async function fetchClubMembers(
  params: FetchClubMembersParams,
): Promise<FetchClubMembersSuccessResponse> {
  const query = new URLSearchParams({ club_guid: params.club_guid });
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);
  if (params.direction) query.set("direction", params.direction);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));

  const response = await fetchWithAuth(
    `${BASE_URL}/padel/club-member?${query.toString()}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchClubMembersErrorResponse;
  }

  return data as FetchClubMembersSuccessResponse;
}

export async function joinClub(
  clubGuid: string,
): Promise<JoinClubSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/club-member`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ club_guid: clubGuid }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as JoinClubErrorResponse;
  }

  return data as JoinClubSuccessResponse;
}

export async function fetchJoinedClubs(): Promise<FetchJoinedClubsSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/club/joined`);
  const data = await response.json();

  if (!response.ok) {
    throw data as FetchJoinedClubsErrorResponse;
  }

  return data as FetchJoinedClubsSuccessResponse;
}

export async function leaveClub(
  guid: string,
): Promise<LeaveClubSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/padel/club-member/${guid}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as LeaveClubErrorResponse;
  }

  return data as LeaveClubSuccessResponse;
}
