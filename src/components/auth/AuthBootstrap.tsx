"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMeQuery } from "@/hooks/auth.hooks";
import { ApiError } from "@/lib/api/api-error";
import { getDefaultRouteForRole, useAuthStore } from "@/stores/auth.store";
import type { UserRole } from "@/types/api/auth.types";

export type AuthScope = "guest" | "office" | "field" | "root";

function computeRedirectPath(
  scope: AuthScope,
  role: UserRole | null
): string | null {
  if (!role) {
    return scope === "office" || scope === "field" || scope === "root"
      ? "/login"
      : null;
  }
  if (scope === "guest" || scope === "root") {
    return getDefaultRouteForRole(role);
  }
  if (scope === "office" && role === "SUPERVISOR") {
    return "/field/tasks";
  }
  if (scope === "field" && role !== "SUPERVISOR") {
    return "/dashboard";
  }
  return null;
}

function SessionCheckingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-4 shadow-xs">
        <Loader2 className="size-5 animate-spin text-primary" />
        <span className="text-base font-medium text-text-primary">
          Memeriksa sesi akun...
        </span>
      </div>
    </div>
  );
}

export function AuthBootstrap({
  scope,
  children,
}: {
  scope: AuthScope;
  children: ReactNode;
}) {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const meQuery = useMeQuery(isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, isHydrated]);

  useEffect(() => {
    if (meQuery.isSuccess && meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, meQuery.isSuccess, setUser]);

  useEffect(() => {
    if (!meQuery.isError) return;
    const err = meQuery.error;
    if (
      err instanceof ApiError &&
      (err.statusCode === 401 || err.code === "ACCOUNT_INACTIVE")
    ) {
      clearSession();
    }
  }, [clearSession, meQuery.error, meQuery.isError]);

  const activeRole =
    accessToken ? (meQuery.data?.role ?? user?.role ?? null) : null;
  const redirectTarget = isHydrated
    ? computeRedirectPath(scope, activeRole)
    : null;

  useEffect(() => {
    if (redirectTarget) {
      router.replace(redirectTarget);
    }
  }, [redirectTarget, router]);

  if (!isHydrated || redirectTarget) {
    return <SessionCheckingScreen />;
  }

  return <>{children}</>;
}
