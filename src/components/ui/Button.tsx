import { Button as MantineButton } from "@mantine/core";
import type { ButtonProps as MantineButtonProps } from "@mantine/core";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

// Nama varian proyek dipetakan ke varian Mantine; keputusan visual tetap di theme.
const VARIANT_MAP: Record<ButtonVariant, "filled" | "light" | "outline" | "subtle"> = {
  primary: "filled",
  secondary: "light",
  outline: "outline",
  ghost: "subtle",
};

// ButtonProps Mantine tidak memuat handler DOM (onClick dsb.) karena datang dari
// signature polimorfiknya; digabung dengan atribut native button supaya lengkap.
export type ButtonProps = Omit<
  MantineButtonProps & ButtonHTMLAttributes<HTMLButtonElement>,
  "variant" | "size"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant = "primary", size = "md", ...rest }: ButtonProps) {
  return <MantineButton variant={VARIANT_MAP[variant]} size={size} {...rest} />;
}
