/**
 * Tooltip — wrapper tipis atas Tooltip Mantine (`label`, `position`,
 * `openDelay`, dsb.). Ada di `ui/` agar penamaan primitif proyek konsisten.
 */
import { Tooltip as MantineTooltip } from "@mantine/core";
import type { TooltipProps as MantineTooltipProps } from "@mantine/core";
import type { ReactNode } from "react";

export type TooltipProps = MantineTooltipProps & { children?: ReactNode };

export function Tooltip({ ...rest }: TooltipProps) {
  return <MantineTooltip {...rest} />;
}
