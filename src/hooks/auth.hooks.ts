import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginPayload } from "@/types/api/auth.types";

export const AUTH_QUERY_KEY = ["auth"] as const;

export function useMeQuery(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: [...AUTH_QUERY_KEY, "me"],
    queryFn: () => authApi.getMe(),
    enabled: enabled && Boolean(accessToken),
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: async (data) => {
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success(`Selamat datang, ${data.user.name}.`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Gagal masuk ke akun.");
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: async () => {
      const token = useAuthStore.getState().refreshToken;
      if (!token) return { loggedOut: true };
      return authApi.logout(token);
    },
    onSettled: async () => {
      clearSession();
      queryClient.clear();
    },
    onSuccess: () => {
      toast.success("Anda telah keluar dari sistem.");
    },
    onError: () => {
      toast.success("Sesi lokal telah dibersihkan.");
    },
  });
}
