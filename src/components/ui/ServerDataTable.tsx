import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/api";
import { ServerPagination } from "./ServerPagination";

export interface DataColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface ServerDataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function ServerDataTable<T>({
  columns,
  data,
  getRowKey,
  meta,
  onPageChange,
  className,
}: ServerDataTableProps<T>) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <Table>
          <TableHeader className="bg-secondary/70">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-11 px-4 text-xs font-semibold tracking-wide text-text-secondary uppercase",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn("px-4 py-3 text-sm text-text-primary", column.cellClassName)}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && onPageChange && (
        <ServerPagination meta={meta} onPageChange={onPageChange} />
      )}
    </div>
  );
}
