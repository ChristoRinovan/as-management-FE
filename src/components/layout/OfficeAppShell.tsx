"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLogoutMutation } from "@/hooks/auth.hooks";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { OFFICE_NAV_ITEMS } from "./office-nav.config";

function OfficeNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5" aria-label="Menu utama office">
      {OFFICE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-soft font-semibold text-primary"
                : "text-text-secondary hover:bg-secondary hover:text-text-primary"
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function OfficeAppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();

  async function handleLogout(): Promise<void> {
    await logoutMutation.mutateAsync();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-dvh bg-canvas">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">ArchiStudio</p>
            <p className="text-xs text-text-secondary">Internal Office</p>
          </div>
        </div>
        <div className="flex-1 p-4">
          <OfficeNavList />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="min-h-11 min-w-11 lg:hidden"
                    aria-label="Buka menu navigasi"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="border-b border-border px-5 py-4">
                  <SheetTitle>ArchiStudio Office</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                  <OfficeNavList onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold text-text-primary lg:hidden">
              ArchiStudio Office
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-sm font-medium text-text-primary">
                  {user.name}
                </span>
                <StatusBadge tone="info">{user.role}</StatusBadge>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="min-h-11 px-3"
            >
              <LogOut className="mr-1.5 size-4" />
              Keluar
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
