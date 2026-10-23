import { Textarea as MantineTextarea } from "@mantine/core";
import type { ComponentProps } from "react";

export type TextareaProps = Omit<ComponentProps<typeof MantineTextarea>, "size"> & {
  size?: "sm" | "md" | "lg";
};

export function Textarea({ size = "md", ...rest }: TextareaProps) {
  return <MantineTextarea size={size} {...rest} />;
}
