import type { ReactNode } from "react";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { FieldAppShell } from "@/components/layout/FieldAppShell";

export default function FieldGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthBootstrap scope="field">
      <FieldAppShell>{children}</FieldAppShell>
    </AuthBootstrap>
  );
}
