import { Badge as MantineBadge } from "@mantine/core";
import type { BadgeProps as MantineBadgeProps } from "@mantine/core";
import type { HTMLAttributes } from "react";

/**
 * Tone memakai palet warna bawaan Mantine agar konsisten dengan komponen lain.
 * Jika identitas visual nanti memakai warna khusus, tambahkan di `theme.ts`.
 */
export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

const TONE_COLOR: Record<BadgeTone, "gray" | "blue" | "green" | "orange" | "red"> = {
  neutral: "gray",
  info: "blue",
  success: "green",
  warning: "orange",
  danger: "red",
};

export type BadgeProps = Omit<
  MantineBadgeProps & HTMLAttributes<HTMLDivElement>,
  "color"
> & {
  tone?: BadgeTone;
};

export function Badge({ tone = "neutral", ...rest }: BadgeProps) {
  return <MantineBadge color={TONE_COLOR[tone]} {...rest} />;
}
