import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "muted";

const TONE_CLASS_MAP: Record<StatusTone, string> = {
  success: "border-status-success-fg/20 bg-status-success-bg text-status-success-fg",
  warning: "border-status-warning-fg/20 bg-status-warning-bg text-status-warning-fg",
  danger: "border-status-danger-fg/20 bg-status-danger-bg text-status-danger-fg",
  info: "border-status-info-fg/20 bg-status-info-bg text-status-info-fg",
  muted: "border-status-muted-fg/20 bg-status-muted-bg text-status-muted-fg",
};

interface StatusBadgeProps {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-md px-2.5 text-xs font-semibold",
        TONE_CLASS_MAP[tone],
        className
      )}
    >
      {children}
    </Badge>
  );
}
