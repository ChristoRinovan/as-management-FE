/**
 * Kontrak envelope API (lihat `docs/architecture/coding-conventions.md` §7).
 * Envelope datang dari backend; jangan diubah sepihak dari frontend.
 */

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiErrorBody {
  /** Kode stabil dari registry `AppErrors` backend — dibandingkan, bukan pesannya. */
  code: string;
  message: string;
  /** Error per-field untuk form (opsional). */
  fields?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiFailureEnvelope {
  success: false;
  error: ApiErrorBody;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
