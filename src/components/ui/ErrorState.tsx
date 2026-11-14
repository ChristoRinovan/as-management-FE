import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Gagal memuat data",
  description = "Terjadi kendala saat mengambil data dari server.",
  onRetry,
  retryLabel = "Coba Lagi",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-status-danger-fg/25 bg-status-danger-bg px-6 py-8 text-center",
        className
      )}
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface text-status-danger-fg shadow-xs">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-status-danger-fg">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-text-primary">{description}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-4 min-h-11 border-status-danger-fg/30 bg-surface px-4 text-status-danger-fg hover:bg-surface/90"
        >
          <RefreshCw className="mr-2 size-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
