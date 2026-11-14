import type { ReactNode } from "react";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { OfficeAppShell } from "@/components/layout/OfficeAppShell";

export default function OfficeGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AuthBootstrap scope="office">
      <OfficeAppShell>{children}</OfficeAppShell>
    </AuthBootstrap>
  );
}
