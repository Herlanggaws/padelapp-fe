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
import apiClient from "@/lib/apiClient";

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

export async function createClub(
  payload: CreateClubPayload,
): Promise<CreateClubSuccessResponse> {
  const { data } = await apiClient.post<CreateClubSuccessResponse>(
    "/padel/club",
    payload,
  );
  return data;
}

export async function updateClub(
  guid: string,
  payload: UpdateClubPayload,
): Promise<UpdateClubSuccessResponse> {
  const { data } = await apiClient.put<UpdateClubSuccessResponse>(
    `/padel/club/${guid}`,
    payload,
  );
  return data;
}

export async function fetchClubs(
  params?: FetchClubsParams,
): Promise<FetchClubsSuccessResponse> {
  const { data } = await apiClient.get<FetchClubsSuccessResponse>(
    "/padel/club",
    { params },
  );
  return data;
}

export async function fetchClubDetail(
  guid: string,
): Promise<FetchClubDetailSuccessResponse> {
  const { data } = await apiClient.get<FetchClubDetailSuccessResponse>(
    `/padel/club/${guid}`,
  );
  return data;
}

export async function fetchClubMembers(
  params: FetchClubMembersParams,
): Promise<FetchClubMembersSuccessResponse> {
  const { data } = await apiClient.get<FetchClubMembersSuccessResponse>(
    "/padel/club-member",
    { params },
  );
  return data;
}

export async function joinClub(
  clubGuid: string,
): Promise<JoinClubSuccessResponse> {
  const { data } = await apiClient.post<JoinClubSuccessResponse>(
    "/padel/club-member",
    { club_guid: clubGuid },
  );
  return data;
}

export async function fetchJoinedClubs(): Promise<FetchJoinedClubsSuccessResponse> {
  const { data } = await apiClient.get<FetchJoinedClubsSuccessResponse>(
    "/padel/club/joined",
  );
  return data;
}

export async function leaveClub(
  guid: string,
): Promise<LeaveClubSuccessResponse> {
  const { data } = await apiClient.delete<LeaveClubSuccessResponse>(
    `/padel/club-member/${guid}`,
  );
  return data;
}
