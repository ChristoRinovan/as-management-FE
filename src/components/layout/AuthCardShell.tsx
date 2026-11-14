import type { ReactNode } from "react";
import { Building2 } from "lucide-react";

export function AuthCardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Building2 className="size-7" />
          </div>
          <p className="text-xs font-semibold tracking-wider text-primary uppercase">
            ArchiStudio Internal Office
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            Laporan Harian Lapangan
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Masuk menggunakan nomor HP atau username Anda.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
