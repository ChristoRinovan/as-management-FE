import { create } from "zustand";
import type { AuthUserProfile, UserRole } from "@/types/api/auth.types";

export const ARCHISTUDIO_AUTH_STORAGE_KEY = "archistudio.auth.v1";

interface StoredAuthPayload {
  accessToken: string;
  refreshToken: string;
  user: AuthUserProfile;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUserProfile | null;
  isHydrated: boolean;
  setSession: (payload: StoredAuthPayload) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUserProfile) => void;
  clearSession: () => void;
  hydrateFromStorage: () => void;
}

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function writeStorage(payload: StoredAuthPayload | null): void {
  const storage = getBrowserStorage();
  if (!storage) return;
  if (!payload) {
    storage.removeItem(ARCHISTUDIO_AUTH_STORAGE_KEY);
    return;
  }
  storage.setItem(ARCHISTUDIO_AUTH_STORAGE_KEY, JSON.stringify(payload));
}

function isValidStoredPayload(value: unknown): value is StoredAuthPayload {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.accessToken === "string" &&
    typeof data.refreshToken === "string" &&
    typeof data.user === "object" &&
    data.user !== null
  );
}

function readStorage(): StoredAuthPayload | null {
  const storage = getBrowserStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(ARCHISTUDIO_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidStoredPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getDefaultRouteForRole(role: UserRole): string {
  return role === "SUPERVISOR" ? "/field/tasks" : "/dashboard";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isHydrated: false,

  setSession: (payload) => {
    writeStorage(payload);
    set({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      user: payload.user,
      isHydrated: true,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    const currentUser = get().user;
    if (currentUser) {
      writeStorage({ accessToken, refreshToken, user: currentUser });
    }
    set({ accessToken, refreshToken });
  },

  setUser: (user) => {
    const { accessToken, refreshToken } = get();
    if (accessToken && refreshToken) {
      writeStorage({ accessToken, refreshToken, user });
    }
    set({ user });
  },

  clearSession: () => {
    writeStorage(null);
    set({ accessToken: null, refreshToken: null, user: null, isHydrated: true });
  },

  hydrateFromStorage: () => {
    const stored = readStorage();
    if (!stored) {
      set({ isHydrated: true });
      return;
    }
    set({
      accessToken: stored.accessToken,
      refreshToken: stored.refreshToken,
      user: stored.user,
      isHydrated: true,
    });
  },
}));
