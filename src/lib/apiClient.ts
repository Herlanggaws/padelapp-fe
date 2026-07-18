import axios from "axios";
import type { RefreshTokenSuccessResponse } from "@/types/auth";

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? ""
  );
}

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

function clearAuthCookies(): void {
  document.cookie =
    "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  document.cookie =
    "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

function forceLogout(): void {
  clearAuthCookies();
  window.location.href = "/login";
}

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  paramsSerializer: { indexes: null },
});

apiClient.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (error.response?.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (newToken) => {
              originalConfig.headers["Authorization"] = `Bearer ${newToken}`;
              resolve(apiClient(originalConfig));
            },
            reject,
          });
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) {
          forceLogout();
          return Promise.reject(error.response?.data ?? error);
        }

        const { data } = await axios.post<RefreshTokenSuccessResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          { refresh_token: refreshToken },
        );

        const { access_token, refresh_token } = data.data;
        setCookie("access_token", access_token);
        setCookie("refresh_token", refresh_token);

        refreshQueue.forEach(({ resolve }) => resolve(access_token));
        refreshQueue = [];

        originalConfig.headers["Authorization"] = `Bearer ${access_token}`;
        return apiClient(originalConfig);
      } catch (err) {
        refreshQueue.forEach(({ reject }) => reject(err));
        refreshQueue = [];
        forceLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data ?? error);
  },
);

export default apiClient;
