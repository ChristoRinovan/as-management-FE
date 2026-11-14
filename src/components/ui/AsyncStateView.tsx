import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { Skeleton } from "./skeleton";

interface AsyncStateViewProps<T> {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  data: T | undefined;
  isEmpty?: (data: T) => boolean;
  onRetry?: () => void;
  loadingFallback?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  children: (data: T) => ReactNode;
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Memuat data">
      <Skeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "Terjadi gangguan jaringan atau server. Silakan coba lagi.";
}

export function AsyncStateView<T>({
  isLoading,
  isError,
  error,
  data,
  isEmpty,
  onRetry,
  loadingFallback,
  emptyTitle = "Belum ada data",
  emptyDescription,
  emptyAction,
  children,
}: AsyncStateViewProps<T>) {
  if (isLoading) {
    return <>{loadingFallback ?? <TableSkeleton />}</>;
  }

  if (isError) {
    return (
      <ErrorState
        description={resolveErrorMessage(error)}
        onRetry={onRetry}
      />
    );
  }

  if (data === undefined || (isEmpty && isEmpty(data))) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return <>{children(data)}</>;
}
