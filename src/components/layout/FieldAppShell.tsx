"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, History, LogOut, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLogoutMutation } from "@/hooks/auth.hooks";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

function subscribeOnlineStatus(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribeOnlineStatus,
    () => navigator.onLine,
    () => true
  );
}

const FIELD_TABS = [
  { href: "/field/tasks", label: "Tugas Lapor", icon: ClipboardList },
  { href: "/field/history", label: "Riwayat Saya", icon: History },
] as const;

export function FieldAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();

  async function handleLogout(): Promise<void> {
    await logoutMutation.mutateAsync();
    router.replace("/login");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-canvas shadow-xs">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-text-primary">
            ArchiStudio Lapangan
          </p>
          <p className="truncate text-sm text-text-secondary">
            {user?.name ?? "Pengawas Lapangan"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge tone={isOnline ? "success" : "danger"}>
            {isOnline ? (
              <Wifi className="size-3.5" />
            ) : (
              <WifiOff className="size-3.5" />
            )}
            <span>{isOnline ? "Online" : "Koneksi Terputus"}</span>
          </StatusBadge>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="min-h-12 px-3 text-sm font-medium"
            aria-label="Keluar akun"
          >
            <LogOut className="size-4" />
            <span>Keluar</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-24 text-base text-text-primary">
        {children}
      </main>

      <nav
        aria-label="Navigasi lapangan"
        className="fixed bottom-0 left-1/2 z-30 grid w-full max-w-md -translate-x-1/2 grid-cols-2 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        {FIELD_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-text-secondary hover:bg-secondary"
              )}
            >
              <Icon className="size-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
