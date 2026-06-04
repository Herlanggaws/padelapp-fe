export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface RefreshTokenSuccessData {
  access_token: string;
  access_token_expired_at: string;
  refresh_token: string;
  refresh_token_expired_at: string;
}

export interface RefreshTokenSuccessResponse {
  data: RefreshTokenSuccessData;
  message: string;
}

export interface RefreshTokenErrorResponse {
  message: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  user_agent: string;
}

export interface RegisterErrorResponse {
  error: Record<string, string>;
  message: string;
}

export interface RegisterSuccessData {
  access_token: string;
  access_token_expired_at: string;
  refresh_token: string;
  refresh_token_expired_at: string;
}

export interface RegisterSuccessResponse {
  data: RegisterSuccessData;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  user_agent: string;
}

export interface LoginSuccessData {
  access_token: string;
  access_token_expired_at: string;
  refresh_token: string;
  refresh_token_expired_at: string;
}

export interface LoginSuccessResponse {
  data: LoginSuccessData;
  message: string;
}

export interface LoginErrorResponse {
  message: string;
}

export interface LogoutSuccessResponse {
  message: string;
}

export interface LogoutErrorResponse {
  message: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordSuccessResponse {
  data: null;
  message: string;
}

export interface ForgotPasswordErrorResponse {
  message: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordSuccessResponse {
  data: null;
  message: string;
}

export interface ChangePasswordErrorResponse {
  message: string;
  error?: Record<string, string>;
}

export interface UserProfile {
  guid: string;
  name: string;
  email: string;
  profile_photo: string;
  verified_at: string;
  is_active: boolean;
  active_at: string;
  active_by: string | null;
  rank_points: number;
  events_played: number;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

export interface GetUserProfileSuccessResponse {
  data: UserProfile;
  message: string;
}

export interface GetUserProfileErrorResponse {
  message: string;
}
