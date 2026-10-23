import { Loader, Stack, Text } from "@mantine/core";

export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Memuat data…" }: LoadingStateProps) {
  return (
    <Stack align="center" justify="center" gap="xs" py="xl" role="status" aria-live="polite">
      <Loader size="sm" />
      <Text size="sm" c="dimmed">
        {message}
      </Text>
    </Stack>
  );
}
