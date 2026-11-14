import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface ServerPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function ServerPagination({
  meta,
  onPageChange,
}: ServerPaginationProps) {
  const totalPages = Math.max(1, meta.totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-secondary">
        Menampilkan halaman{" "}
        <span className="font-mono font-semibold tabular-nums text-text-primary">
          {meta.page}
        </span>{" "}
        dari{" "}
        <span className="font-mono font-semibold tabular-nums text-text-primary">
          {totalPages}
        </span>{" "}
        (<span className="font-mono tabular-nums">{meta.totalItems}</span> data)
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!meta.hasPreviousPage}
          onClick={() => onPageChange(meta.page - 1)}
          className="min-h-11 px-3"
        >
          <ChevronLeft className="mr-1 size-4" />
          Sebelumnya
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
          className="min-h-11 px-3"
        >
          Berikutnya
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}
