import type { ApiResponse } from "@/types/api";
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  MeProfile,
  RefreshResponse,
} from "@/types/api/auth.types";
import { api } from "./axios";

export class AuthApi {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", payload);
    return res.data.data;
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const res = await api.post<ApiResponse<RefreshResponse>>("/auth/refresh", {
      refreshToken,
    });
    return res.data.data;
  }

  async logout(refreshToken: string): Promise<LogoutResponse> {
    const res = await api.post<ApiResponse<LogoutResponse>>("/auth/logout", {
      refreshToken,
    });
    return res.data.data;
  }

  async getMe(): Promise<MeProfile> {
    const res = await api.get<ApiResponse<MeProfile>>("/auth/me");
    return res.data.data;
  }
}

export const authApi = new AuthApi();
