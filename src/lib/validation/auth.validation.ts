import * as z from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Masukkan nomor HP atau username."),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
