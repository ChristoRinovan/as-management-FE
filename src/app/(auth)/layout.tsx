import type { ReactNode } from "react";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { AuthCardShell } from "@/components/layout/AuthCardShell";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthBootstrap scope="guest">
      <AuthCardShell>{children}</AuthCardShell>
    </AuthBootstrap>
  );
}
