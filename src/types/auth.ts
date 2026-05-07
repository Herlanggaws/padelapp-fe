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
