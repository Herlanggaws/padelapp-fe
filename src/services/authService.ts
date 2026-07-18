import type {
  LoginPayload,
  LoginSuccessResponse,
  LoginErrorResponse,
  LogoutSuccessResponse,
  LogoutErrorResponse,
  RegisterPayload,
  RegisterSuccessResponse,
  RegisterErrorResponse,
  ForgotPasswordPayload,
  ForgotPasswordSuccessResponse,
  ForgotPasswordErrorResponse,
  ChangePasswordPayload,
  ChangePasswordSuccessResponse,
  ChangePasswordErrorResponse,
  GetUserProfileSuccessResponse,
  GetUserProfileErrorResponse,
  ValidateResetTokenSuccessResponse,
  ValidateResetTokenErrorResponse,
  ResetPasswordPayload,
  ResetPasswordSuccessResponse,
  ResetPasswordErrorResponse,
} from "@/types/auth";
import apiClient from "@/lib/apiClient";

export type {
  LoginPayload,
  LoginSuccessResponse,
  LoginErrorResponse,
  LogoutSuccessResponse,
  LogoutErrorResponse,
  RegisterPayload,
  RegisterSuccessResponse,
  RegisterErrorResponse,
  ForgotPasswordPayload,
  ForgotPasswordSuccessResponse,
  ForgotPasswordErrorResponse,
  ChangePasswordPayload,
  ChangePasswordSuccessResponse,
  ChangePasswordErrorResponse,
  GetUserProfileSuccessResponse,
  GetUserProfileErrorResponse,
  ValidateResetTokenSuccessResponse,
  ValidateResetTokenErrorResponse,
  ResetPasswordPayload,
  ResetPasswordSuccessResponse,
  ResetPasswordErrorResponse,
};

export async function loginUser(
  payload: LoginPayload,
): Promise<LoginSuccessResponse> {
  const { data } = await apiClient.post<LoginSuccessResponse>(
    "/auth/login",
    payload,
  );
  return data;
}

export async function logoutUser(): Promise<LogoutSuccessResponse> {
  const { data } = await apiClient.post<LogoutSuccessResponse>("/auth/logout");
  return data;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterSuccessResponse> {
  const { data } = await apiClient.post<RegisterSuccessResponse>(
    "/auth/register",
    payload,
  );
  return data;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordSuccessResponse> {
  const { data } = await apiClient.post<ForgotPasswordSuccessResponse>(
    "/auth/forgot-password",
    payload,
  );
  return data;
}

export async function validateResetToken(
  token: string,
): Promise<ValidateResetTokenSuccessResponse> {
  const { data } = await apiClient.get<ValidateResetTokenSuccessResponse>(
    "/auth/forgot-password/reset",
    { params: { token } },
  );
  return data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordSuccessResponse> {
  const { data } = await apiClient.post<ResetPasswordSuccessResponse>(
    "/auth/forgot-password/reset",
    payload,
  );
  return data;
}

export async function fetchUserProfile(): Promise<GetUserProfileSuccessResponse> {
  const { data } = await apiClient.get<GetUserProfileSuccessResponse>(
    "/auth/profile",
  );
  return data;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordSuccessResponse> {
  const { data } = await apiClient.put<ChangePasswordSuccessResponse>(
    "/auth/profile/change-password",
    payload,
  );
  return data;
}
