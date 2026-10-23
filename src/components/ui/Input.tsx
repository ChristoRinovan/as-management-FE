import { TextInput } from "@mantine/core";
import type { ComponentProps } from "react";

export type InputProps = Omit<ComponentProps<typeof TextInput>, "size"> & {
  size?: "sm" | "md" | "lg";
};

export function Input({ size = "md", ...rest }: InputProps) {
  return <TextInput size={size} {...rest} />;
}
