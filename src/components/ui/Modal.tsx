import { Modal as MantineModal } from "@mantine/core";
import type { ModalProps as MantineModalProps } from "@mantine/core";

export type ModalProps = Omit<MantineModalProps, "opened" | "onClose"> & {
  opened: boolean;
  onClose: () => void;
};

/** Modal dialog default proyek: selalu terpusat; radius/shadow dari theme. */
export function Modal({ centered = true, ...rest }: ModalProps) {
  return <MantineModal centered={centered} {...rest} />;
}
