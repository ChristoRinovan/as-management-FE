import { Radio as MantineRadio } from "@mantine/core";
import type { ComponentProps } from "react";

export type RadioProps = Omit<ComponentProps<typeof MantineRadio>, "size"> & {
  size?: "sm" | "md" | "lg";
};

/** Untuk sekumpulan radio, pakai `Radio.Group` bawaan Mantine: `<MantineRadio.Group>`. */
export function Radio({ size = "md", ...rest }: RadioProps) {
  return <MantineRadio size={size} {...rest} />;
}
