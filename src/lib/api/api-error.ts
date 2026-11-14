import axios from "axios";
import type { ApiErrorEnvelope, ApiErrorField } from "@/types/api";

const DEFAULT_ERROR_MESSAGE = "Terjadi kesalahan saat menghubungi server.";

function isApiErrorEnvelope(value: unknown): value is ApiErrorEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.success !== false || typeof candidate.error !== "object" || candidate.error === null) {
    return false;
  }
  const err = candidate.error as Record<string, unknown>;
  return typeof err.code === "string" && typeof err.message === "string";
}

export class ApiError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly fields?: ApiErrorField[];

  constructor(
    code: string,
    message: string,
    statusCode: number,
    fields?: ApiErrorField[]
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
  }

  static fromAxiosError(error: unknown): ApiError {
    if (error instanceof ApiError) return error;
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const data: unknown = error.response?.data;
      if (isApiErrorEnvelope(data)) {
        return new ApiError(data.error.code, data.error.message, status, data.error.fields);
      }
      if (!error.response) {
        return new ApiError(
          "NETWORK_ERROR",
          "Koneksi terputus. Periksa jaringan internet Anda.",
          0
        );
      }
      return new ApiError("UNKNOWN_ERROR", error.message || DEFAULT_ERROR_MESSAGE, status);
    }
    return new ApiError("UNKNOWN_ERROR", DEFAULT_ERROR_MESSAGE, 500);
  }
}
