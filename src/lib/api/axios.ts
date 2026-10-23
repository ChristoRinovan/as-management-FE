import axios from "axios";
import type { ApiFailureEnvelope } from "@/types/api";

/**
 * Error yang diterjemahkan dari envelope gagal backend:
 * `{ success: false, error: { code, message[, fields] } }`.
 * Komponen/hook membandingkan `code`, bukan pesan teks.
 */
export class ApiError extends Error {
  readonly code: string;
  readonly fields?: Record<string, string[]>;

  constructor(code: string, message: string, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.fields = fields;
  }
}

/**
 * Axios singleton untuk seluruh API. Cookie httpOnly dipakai untuk auth
 * (`withCredentials`); token tidak pernah disimpan di localStorage/Zustand.
 * Client per-domain (`<domain>.api.ts`) dibuat di atas instance ini —
 * komponen tidak memanggil axios secara langsung.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiFailureEnvelope>(error)) {
      const body = error.response?.data;
      if (body && body.success === false && body.error) {
        const { code, message, fields } = body.error;
        return Promise.reject(new ApiError(code, message, fields));
      }
      // Jaringan/Gateway tanpa envelope — pakai pesan axios sebagai fallback.
      return Promise.reject(new ApiError("NETWORK_ERROR", error.message));
    }
    return Promise.reject(error);
  },
);
