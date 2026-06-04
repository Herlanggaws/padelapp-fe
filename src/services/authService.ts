import type {
  RefreshTokenPayload,
  RefreshTokenSuccessResponse,
  RefreshTokenErrorResponse,
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
} from "@/types/auth";

export type {
  RefreshTokenPayload,
  RefreshTokenSuccessResponse,
  RefreshTokenErrorResponse,
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
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function forceLogout() {
  document.cookie =
    "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  document.cookie =
    "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  window.location.href = "/login";
}

async function attemptTokenRefresh(): Promise<string> {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) {
    forceLogout();
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    forceLogout();
    throw new Error("Refresh token invalid or expired");
  }

  const result: RefreshTokenSuccessResponse = await response.json();
  setCookie("access_token", result.data.access_token);
  setCookie("refresh_token", result.data.refresh_token);

  return result.data.access_token;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = getCookie("access_token");

  const doFetch = (token: string) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  const response = await doFetch(accessToken);

  if (response.status !== 401) {
    return response;
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({
        resolve: (newToken) => resolve(doFetch(newToken)),
        reject,
      });
    });
  }

  isRefreshing = true;
  try {
    const newToken = await attemptTokenRefresh();
    refreshQueue.forEach(({ resolve }) => resolve(newToken));
    refreshQueue = [];
    return doFetch(newToken);
  } catch (err) {
    refreshQueue.forEach(({ reject }) => reject(err));
    refreshQueue = [];
    throw err;
  } finally {
    isRefreshing = false;
  }
}

export async function refreshAccessToken(
  payload: RefreshTokenPayload,
): Promise<RefreshTokenSuccessResponse> {
  const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as RefreshTokenErrorResponse;
  }

  return data as RefreshTokenSuccessResponse;
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

export async function fetchUserProfile(): Promise<GetUserProfileSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/auth/profile`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as GetUserProfileErrorResponse;
  }

  return data as GetUserProfileSuccessResponse;
}

export async function logoutUser(accessToken: string): Promise<LogoutSuccessResponse> {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as LogoutErrorResponse;
  }

  return data as LogoutSuccessResponse;
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

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordSuccessResponse> {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ForgotPasswordErrorResponse;
  }

  return data as ForgotPasswordSuccessResponse;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordSuccessResponse> {
  const response = await fetchWithAuth(`${BASE_URL}/auth/profile/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ChangePasswordErrorResponse;
  }

  return data as ChangePasswordSuccessResponse;
}
