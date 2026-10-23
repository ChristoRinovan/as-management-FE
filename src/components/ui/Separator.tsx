/**
 * Pemisah garis — alias tipis atas Divider Mantine (prop `orientation`,
 * `label`, dsb. tetap tersedia). Ada di `ui/` agar penamaan primitif proyek
 * konsisten; jangan implementasi ulang garis sendiri.
 */
export { Divider as Separator, type DividerProps as SeparatorProps } from "@mantine/core";
