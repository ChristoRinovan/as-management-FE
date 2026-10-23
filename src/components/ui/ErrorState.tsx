import { Stack, Text, Title } from "@mantine/core";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  /** Pesan kesalahan; preferensi pesan dari server (Bahasa Indonesia). */
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Gagal memuat data",
  message = "Terjadi kesalahan saat mengambil data. Silakan coba lagi.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl" className="text-center" role="alert">
      <Title order={4}>{title}</Title>
      <Text size="sm" c="dimmed">
        {message}
      </Text>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </Stack>
  );
}
