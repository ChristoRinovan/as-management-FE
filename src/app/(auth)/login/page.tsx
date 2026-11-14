import type { Metadata } from "next";
import { LoginFormCard } from "@/components/auth/LoginFormCard";

export const metadata: Metadata = {
  title: "Masuk | ArchiStudio Internal Office",
};

export default function LoginPage() {
  return <LoginFormCard />;
}
