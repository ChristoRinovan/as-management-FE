import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth.store";
import type { ApiResponse } from "@/types/api";
import type { RefreshResponse } from "@/types/api/auth.types";
import { ApiError } from "./api-error";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

let activeRefreshPromise: Promise<RefreshResponse> | null = null;

function isAuthBypassPath(url?: string): boolean {
  if (!url) return false;
  return url.includes("/auth/login") || url.includes("/auth/refresh");
}

function attachBearerHeader(
  config: InternalAxiosRequestConfig,
  token: string | null
): InternalAxiosRequestConfig {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

async function performTokenRefresh(): Promise<RefreshResponse> {
  const { refreshToken, setTokens } = useAuthStore.getState();
  if (!refreshToken) {
    throw new ApiError("REFRESH_TOKEN_INVALID", "Sesi tidak ditemukan.", 401);
  }
  const response = await api.post<ApiResponse<RefreshResponse>>(
    "/auth/refresh",
    { refreshToken }
  );
  const tokens = response.data.data;
  setTokens(tokens.accessToken, tokens.refreshToken);
  return tokens;
}

function getSharedRefreshPromise(): Promise<RefreshResponse> {
  if (!activeRefreshPromise) {
    activeRefreshPromise = performTokenRefresh().finally(() => {
      activeRefreshPromise = null;
    });
  }
  return activeRefreshPromise;
}

async function handleResponseError(error: AxiosError): Promise<unknown> {
  const originalRequest = error.config as RetryableRequestConfig | undefined;
  const parsedError = ApiError.fromAxiosError(error);
  const shouldRefresh =
    parsedError.statusCode === 401 &&
    parsedError.code === "ACCESS_TOKEN_EXPIRED" &&
    originalRequest !== undefined &&
    !originalRequest._retry &&
    !isAuthBypassPath(originalRequest.url);

  if (!shouldRefresh) {
    return Promise.reject(parsedError);
  }

  originalRequest._retry = true;
  try {
    const tokens = await getSharedRefreshPromise();
    attachBearerHeader(originalRequest, tokens.accessToken);
    return api.request(originalRequest as AxiosRequestConfig);
  } catch (refreshError) {
    useAuthStore.getState().clearSession();
    return Promise.reject(ApiError.fromAxiosError(refreshError));
  }
}

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  return attachBearerHeader(config, accessToken);
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => handleResponseError(error)
);
