import { Select as MantineSelect } from "@mantine/core";
import type { ComponentProps } from "react";

export type SelectProps = Omit<ComponentProps<typeof MantineSelect>, "size"> & {
  size?: "sm" | "md" | "lg";
};

export function Select({ size = "md", ...rest }: SelectProps) {
  return <MantineSelect size={size} {...rest} />;
}
