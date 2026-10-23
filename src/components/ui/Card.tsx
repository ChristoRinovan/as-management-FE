import { Card as MantineCard } from "@mantine/core";
import type { CardProps as MantineCardProps } from "@mantine/core";
import type { HTMLAttributes } from "react";

export type CardProps = MantineCardProps & HTMLAttributes<HTMLDivElement>;

/** Kartu permukaan default: border halus + shadow kecil dari token desain. */
export function Card({ padding = "lg", ...rest }: CardProps) {
  return <MantineCard padding={padding} radius="md" withBorder shadow="sm" {...rest} />;
}
