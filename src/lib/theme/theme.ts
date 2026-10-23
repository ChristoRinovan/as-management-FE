import { createTheme } from "@mantine/core";

/**
 * Tema Mantine proyek. Hanya berisi keputusan default yang bisa dikonfigurasi;
 * identitas visual final (warna brand, radius, font) menunggu keputusan desain.
 * `primaryColor: "blue"` memakai palet biru bawaan Mantine yang sudah
 * diselaraskan dengan token `--color-primary` di `src/app/globals.css`.
 */
export const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
  fontFamily: "inherit",
});
