"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/hooks/auth.hooks";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/auth.validation";
import { getDefaultRouteForRole } from "@/stores/auth.store";

export function LoginFormCard() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    try {
      const result = await loginMutation.mutateAsync(values);
      router.replace(getDefaultRouteForRole(result.user.role));
    } catch {
      // Ditangani oleh state error & toast di useLoginMutation
    }
  }

  const errorMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : null;

  return (
    <Card className="border border-border bg-surface shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-text-primary">
          Masuk ke Akun
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-status-danger-fg/30 bg-status-danger-bg p-3 text-sm text-status-danger-fg"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="identifier" className="text-sm font-medium text-text-primary">
              Nomor HP atau Username
            </Label>
            <Input
              id="identifier"
              type="text"
              autoComplete="username"
              placeholder="Contoh: 08123456789 atau andi.pengawas"
              aria-invalid={Boolean(errors.identifier)}
              className="min-h-12 text-base"
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-sm font-medium text-status-danger-fg">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-text-primary">
              Kata Sandi
            </Label>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan kata sandi"
                aria-invalid={Boolean(errors.password)}
                className="min-h-12 pr-14 text-base"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
                className="absolute right-0.5 min-h-12 min-w-12 text-text-secondary"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-status-danger-fg">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="min-h-12 w-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Memeriksa akun...
              </>
            ) : (
              <>
                <LogIn className="mr-2 size-5" />
                Masuk
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter className="mt-4 justify-center border-t border-border bg-secondary/40 py-3 text-center text-sm text-text-secondary">
          Belum punya akun atau lupa kata sandi? Hubungi Owner atau Admin.
        </CardFooter>
      </form>
    </Card>
  );
}
