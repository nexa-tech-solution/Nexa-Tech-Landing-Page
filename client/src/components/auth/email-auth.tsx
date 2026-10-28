import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { useAppleLogin, useEmailSignIn, useEmailSignUp, useForgotPassword, useResendVerification } from "@/services/customer-auth";

export type EmailMode = "signin" | "signup" | "forgot" | "sent-verify" | "sent-reset";

export const authInputClass =
  "w-full rounded-xl border border-[#e7e7e9] bg-white px-4 py-2.5 text-left text-[15px] outline-none transition focus:border-[#ea4c89] focus:ring-4 focus:ring-[#ea4c89]/10";

export const MIN_PASSWORD = 8;

export function PasswordInput({ name = "password", autoComplete, placeholder = "Password" }: { name?: string; autoComplete: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        required
        minLength={MIN_PASSWORD}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${authInputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#9e9ea7] hover:text-[#0d0c22]"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.17-1.53 2.65-.39 6.58 1.1 8.73.73 1.05 1.6 2.23 2.73 2.19 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.3-3.48zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z" />
    </svg>
  );
}

// TODO: load Sign in with Apple JS (appleid.auth) once a Services ID exists;
// the mock signs in a placeholder Apple account.
export function AppleSignInButton() {
  const apple = useAppleLogin();
  return (
    <div className="grid justify-items-center gap-2">
      <button
        type="button"
        onClick={() => apple.mutate("demo")}
        disabled={apple.isPending}
        className="flex w-[320px] max-w-full items-center justify-center gap-3 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f1f1f]"
      >
        {apple.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <AppleMark />} Continue with Apple
      </button>
      {apple.error && <p role="alert" className="text-sm text-red-600">Apple sign-in failed. Please try again.</p>}
    </div>
  );
}

function Back({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="mx-auto mt-5 flex items-center gap-1 text-sm font-semibold text-[#6e6d7a] hover:text-[#0d0c22]">
      <ArrowLeft className="h-4 w-4" /> {children}
    </button>
  );
}

function Sent({ email, kind, onBack }: { email: string; kind: "verify" | "reset"; onBack: () => void }) {
  const resend = useResendVerification();
  const forgot = useForgotPassword();
  const again = kind === "verify" ? resend : forgot;
  return (
    <div className="text-center" role="status">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
        <MailCheck className="h-6 w-6" />
      </span>
      <p className="mt-4 font-semibold">Check your inbox</p>
      <p className="mt-1 text-sm text-[#6e6d7a]">
        {kind === "verify"
          ? <>We sent a verification link to <b className="text-[#0d0c22]">{email}</b>. Click it to activate your account.</>
          : <>If an account exists for <b className="text-[#0d0c22]">{email}</b>, a password reset link is on its way.</>}
      </p>
      <button
        type="button"
        onClick={() => again.mutate(email)}
        disabled={again.isPending || again.isSuccess}
        className="mt-4 text-sm font-semibold text-[#ea4c89] disabled:text-[#9e9ea7]"
      >
        {again.isSuccess ? "Sent again" : again.isPending ? "Sending…" : "Resend email"}
      </button>
      <Back onClick={onBack}>Back to sign in</Back>
    </div>
  );
}

// Email/password flows inside the login dialog. The parent owns `mode` so it
// can hide the social buttons on the confirmation screens.
export function EmailAuth({ mode, setMode }: { mode: EmailMode; setMode: (m: EmailMode) => void }) {
  const signIn = useEmailSignIn();
  const signUp = useEmailSignUp();
  const forgot = useForgotPassword();
  const [email, setEmail] = useState("");

  if (mode === "sent-verify" || mode === "sent-reset") {
    return <Sent email={email} kind={mode === "sent-verify" ? "verify" : "reset"} onBack={() => setMode("signin")} />;
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => data.get(key)?.toString().trim() ?? "";
    const address = value("email");
    setEmail(address);
    if (mode === "signin") signIn.mutate({ email: address, password: value("password") });
    else if (mode === "signup") {
      signUp.mutate({ email: address, password: value("password"), displayName: value("name") }, { onSuccess: () => setMode("sent-verify") });
    } else forgot.mutate(address, { onSuccess: () => setMode("sent-reset") });
  };

  const pending = signIn.isPending || signUp.isPending || forgot.isPending;
  const error =
    mode === "signin" && signIn.error ? "Wrong email or password." :
    mode === "signup" && signUp.error ? (signUp.error.status === 409 ? "An account with this email already exists." : "Couldn't create your account.") :
    mode === "forgot" && forgot.error ? "Couldn't send the reset email." : null;

  return (
    <form onSubmit={onSubmit} className="grid gap-3" noValidate={false}>
      {mode === "forgot" && <p className="text-sm text-[#6e6d7a]">Enter your email and we'll send you a link to reset your password.</p>}
      {mode === "signup" && <input name="name" required maxLength={60} autoComplete="name" placeholder="Your name" className={authInputClass} />}
      <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" defaultValue={email} className={authInputClass} />
      {mode !== "forgot" && (
        <PasswordInput autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder={mode === "signup" ? `Password (${MIN_PASSWORD}+ characters)` : "Password"} />
      )}
      {mode === "signin" && (
        <button type="button" onClick={() => setMode("forgot")} className="justify-self-end text-sm font-semibold text-[#6e6d7a] hover:text-[#0d0c22]">
          Forgot password?
        </button>
      )}
      {error && <p role="alert" className="text-left text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-dark mt-1 justify-center" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
      </button>
      <p className="mt-2 text-sm text-[#6e6d7a]">
        {mode === "signin" ? (
          <>New here? <button type="button" onClick={() => setMode("signup")} className="font-semibold text-[#ea4c89]">Create an account</button></>
        ) : (
          <button type="button" onClick={() => setMode("signin")} className="font-semibold text-[#ea4c89]">
            {mode === "signup" ? "Already have an account? Sign in" : "Back to sign in"}
          </button>
        )}
      </p>
    </form>
  );
}
