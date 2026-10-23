import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

export interface AsyncStateViewProps<T> {
  data: T | undefined | null;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  /** Cara menilai "kosong". Default: array dengan panjang 0. */
  isEmpty?: (data: T) => boolean;
  /** Skeleton kustom saat loading; default `LoadingState`. */
  skeleton?: ReactNode;
  empty?: { title?: string; description?: string; action?: ReactNode };
  /** Override pesan error (mis. hasil `err.message` yang sudah spesifik). */
  errorMessage?: string;
  children: (data: T) => ReactNode;
}

/**
 * Satu gerbang untuk semua tampilan async: loading → error → kosong → konten.
 * Konvensi wajib (lihat `docs/architecture/frontend-coding-conventions.md` §5):
 * setiap list/detail melewati komponen ini supaya state-nya konsisten.
 */
export function AsyncStateView<T>({
  data,
  isLoading,
  error,
  onRetry,
  isEmpty,
  skeleton,
  empty,
  errorMessage,
  children,
}: AsyncStateViewProps<T>) {
  if (isLoading) {
    return <>{skeleton ?? <LoadingState />}</>;
  }
  if (error) {
    return (
      <ErrorState
        message={errorMessage ?? (error.message || undefined)}
        onRetry={onRetry}
      />
    );
  }
  const isDataEmpty =
    isEmpty ?? ((value: T): boolean => Array.isArray(value) && value.length === 0);
  if (data === undefined || data === null || isDataEmpty(data)) {
    return <EmptyState {...empty} />;
  }
  return <>{children(data)}</>;
}
