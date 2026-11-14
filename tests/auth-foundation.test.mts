import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { ApiError } from "@/lib/api/api-error";
import { api } from "@/lib/api/axios";
import { loginSchema } from "@/lib/validation/auth.validation";
import {
  ARCHISTUDIO_AUTH_STORAGE_KEY,
  getDefaultRouteForRole,
  useAuthStore,
} from "@/stores/auth.store";
import type { AuthUserProfile } from "@/types/api/auth.types";
import {
  createAxiosErrorResponse,
  createMemoryStorage,
} from "./helpers/http-mock.helper.mjs";

const SAMPLE_USER: AuthUserProfile = {
  id: "user-1",
  name: "Andi Pengawas",
  username: "andi.pengawas",
  phone: "08123456789",
  role: "SUPERVISOR",
  jobTitle: "Pengawas Lapangan",
};

describe("TASK-02 Frontend Auth Foundation", () => {
  const originalAdapter = api.defaults.adapter;

  beforeEach(() => {
    const memoryStorage = createMemoryStorage();
    Object.defineProperty(globalThis, "window", {
      value: { localStorage: memoryStorage },
      configurable: true,
    });
    useAuthStore.getState().clearSession();
  });

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
  });

  it("[AC-01.1] memvalidasi loginSchema (menolak identifier < 3 atau password < 6)", () => {
    const tooShort = loginSchema.safeParse({ identifier: "ab", password: "123" });
    assert.equal(tooShort.success, false);

    const valid = loginSchema.parse({
      identifier: "  08123456789 ",
      password: "secret123",
    });
    assert.equal(valid.identifier, "08123456789");
    assert.equal(valid.password, "secret123");
  });

  it("[BR-03] mengelola siklus useAuthStore (storage + hydrate) & default route per role", () => {
    useAuthStore.getState().setSession({
      accessToken: "token-a",
      refreshToken: "refresh-a",
      user: SAMPLE_USER,
    });

    const raw = globalThis.window.localStorage.getItem(ARCHISTUDIO_AUTH_STORAGE_KEY);
    assert.ok(raw && raw.includes("token-a"));

    useAuthStore.setState({ accessToken: null, refreshToken: null, user: null, isHydrated: false });
    useAuthStore.getState().hydrateFromStorage();
    assert.equal(useAuthStore.getState().accessToken, "token-a");
    assert.equal(useAuthStore.getState().user?.username, "andi.pengawas");
    assert.equal(getDefaultRouteForRole("SUPERVISOR"), "/field/tasks");
    assert.equal(getDefaultRouteForRole("OWNER"), "/dashboard");
    assert.equal(getDefaultRouteForRole("ADMIN"), "/dashboard");
  });

  it("[AC-01.2 / BR-05] menerjemahkan error API menjadi ApiError dan mengirim Bearer header", async () => {
    useAuthStore.getState().setSession({
      accessToken: "access-1",
      refreshToken: "refresh-1",
      user: SAMPLE_USER,
    });

    api.defaults.adapter = async (config) => {
      assert.equal(config.withCredentials, undefined);
      assert.equal(config.headers.Authorization, "Bearer access-1");
      throw createAxiosErrorResponse(
        403,
        {
          success: false,
          error: {
            code: "ACCOUNT_INACTIVE",
            message: "Akun Anda sedang dinonaktifkan. Hubungi Owner atau Admin.",
          },
        },
        config
      );
    };

    await assert.rejects(
      () => api.get("/auth/me"),
      (err: unknown) =>
        err instanceof ApiError &&
        err.statusCode === 403 &&
        err.code === "ACCOUNT_INACTIVE"
    );
  });

  it("[ADR-01] shared-promise auto-refresh memanggil /auth/refresh 1x untuk 2 request 401 paralel", async () => {
    let refreshCount = 0;
    useAuthStore.getState().setSession({
      accessToken: "expired-token",
      refreshToken: "valid-refresh",
      user: SAMPLE_USER,
    });

    api.defaults.adapter = async (config) => {
      if (config.url?.includes("/auth/refresh")) {
        refreshCount += 1;
        await new Promise((resolve) => setTimeout(resolve, 15));
        return {
          status: 200,
          statusText: "OK",
          headers: {},
          config,
          data: {
            success: true,
            message: "Sesi diperbarui.",
            data: { accessToken: "fresh-token", refreshToken: "fresh-refresh" },
          },
        };
      }

      if (config.headers.Authorization === "Bearer expired-token") {
        throw createAxiosErrorResponse(
          401,
          { success: false, error: { code: "ACCESS_TOKEN_EXPIRED", message: "Kedaluwarsa" } },
          config
        );
      }

      assert.equal(config.headers.Authorization, "Bearer fresh-token");
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: { success: true, message: "OK", data: { path: config.url } },
      };
    };

    const [resA, resB] = await Promise.all([api.get("/auth/me"), api.get("/projects")]);
    assert.equal(refreshCount, 1);
    assert.equal(resA.status, 200);
    assert.equal(resB.status, 200);
    assert.equal(useAuthStore.getState().accessToken, "fresh-token");
    assert.equal(useAuthStore.getState().refreshToken, "fresh-refresh");
  });

  it("membersihkan sesi bila /auth/refresh gagal (REFRESH_TOKEN_INVALID)", async () => {
    useAuthStore.getState().setSession({
      accessToken: "expired-token",
      refreshToken: "bad-refresh",
      user: SAMPLE_USER,
    });

    api.defaults.adapter = async (config) => {
      if (config.url?.includes("/auth/refresh")) {
        throw createAxiosErrorResponse(
          401,
          {
            success: false,
            error: { code: "REFRESH_TOKEN_INVALID", message: "Sesi tidak valid." },
          },
          config
        );
      }
      throw createAxiosErrorResponse(
        401,
        { success: false, error: { code: "ACCESS_TOKEN_EXPIRED", message: "Kedaluwarsa" } },
        config
      );
    };

    await assert.rejects(
      () => api.get("/auth/me"),
      (err: unknown) => err instanceof ApiError && err.code === "REFRESH_TOKEN_INVALID"
    );
    assert.equal(useAuthStore.getState().accessToken, null);
    assert.equal(useAuthStore.getState().user, null);
  });
});
