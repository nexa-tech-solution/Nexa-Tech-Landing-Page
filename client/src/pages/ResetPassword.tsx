import { useState, type FormEvent } from "react";
import { useSearch } from "wouter";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { PasswordInput } from "@/components/auth/email-auth";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { useResetPassword } from "@/services/customer-auth";

// Landing page for the emailed link: /reset-password?token=…
export default function ResetPassword() {
  const token = new URLSearchParams(useSearch()).get("token") ?? "";
  const reset = useResetPassword();
  const requestLogin = useCustomerAuthStore((s) => s.requestLogin);
  const [mismatch, setMismatch] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get("password")!.toString();
    if (password !== data.get("confirm")!.toString()) return setMismatch(true);
    setMismatch(false);
    reset.mutate({ token, password });
  };

  let body;
  if (!token) {
    body = <p className="text-center text-[#6e6d7a]">This reset link is missing its token. Request a new one from the sign-in dialog.</p>;
  } else if (reset.isSuccess) {
    body = (
      <div className="text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <p className="mt-4 font-semibold">Password updated</p>
        <button type="button" className="btn-dark mt-5" onClick={() => requestLogin("Sign in with your new password.")}>Sign in</button>
      </div>
    );
  } else {
    body = (
      <form onSubmit={onSubmit} className="grid gap-3">
        <PasswordInput autoComplete="new-password" placeholder="New password (8+ characters)" />
        <PasswordInput name="confirm" autoComplete="new-password" placeholder="Confirm new password" />
        {mismatch && <p role="alert" className="text-sm text-red-600">Passwords don't match.</p>}
        {reset.error && <p role="alert" className="text-sm text-red-600">This link has expired. Request a new one.</p>}
        <button type="submit" className="btn-dark mt-1 justify-center" disabled={reset.isPending}>
          {reset.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Update password
        </button>
      </form>
    );
  }

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo title="Reset password | Nexa Rankings" path="/reset-password" noindex />
      <SiteHeader />
      <main className="px-5 pb-24 pt-16 md:px-10">
        <div className="mx-auto max-w-[420px] rounded-3xl border border-[#e7e7e9] p-8">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-[#ea4c89] to-[#8b5cf6] text-white">
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-center font-display text-2xl font-bold tracking-[-0.02em]">Choose a new password</h1>
          <div className="mt-6">{body}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
