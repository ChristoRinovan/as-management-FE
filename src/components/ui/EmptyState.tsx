import { Stack, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title = "Belum ada data",
  description = "Data akan muncul di sini begitu tersedia.",
  action,
}: EmptyStateProps) {
  return (
    <Stack align="center" gap="xs" py="xl" className="text-center">
      <Title order={4}>{title}</Title>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
      {action}
    </Stack>
  );
}
