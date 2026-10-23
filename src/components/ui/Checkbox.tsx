import { Checkbox as MantineCheckbox } from "@mantine/core";
import type { ComponentProps } from "react";

export type CheckboxProps = Omit<ComponentProps<typeof MantineCheckbox>, "size"> & {
  size?: "sm" | "md" | "lg";
};

export function Checkbox({ size = "md", ...rest }: CheckboxProps) {
  return <MantineCheckbox size={size} {...rest} />;
}
