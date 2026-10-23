import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";

// Judul/deskripsi netral — identitas produk menyusul setelah PRD disepakati.
export const metadata: Metadata = {
  title: "Aplikasi Laporan Keuangan",
  description: "Aplikasi pelaporan pengeluaran terpusat (fondasi frontend).",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
