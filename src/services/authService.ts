const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export async function loginUser(
  payload: LoginPayload,
): Promise<LoginSuccessResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as LoginErrorResponse;
  }

  return data as LoginSuccessResponse;
}

export async function logoutUser(): Promise<void> {
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterSuccessResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as RegisterErrorResponse;
  }

  return data as RegisterSuccessResponse;
}
