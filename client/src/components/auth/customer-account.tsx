import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { useCustomerLogout } from "@/services/customer-auth";
import { GoogleSignInButton, useGoogleOneTap } from "./google-sign-in";
import { AppleSignInButton, EmailAuth, type EmailMode } from "./email-auth";
import { NotificationBell } from "@/components/account/notification-bell";

function Avatar({ name, src, size = 36 }: { name: string; src: string | null; size?: number }) {
  return src ? (
    <img src={src} alt="" width={size} height={size} referrerPolicy="no-referrer" className="rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span className="grid place-items-center rounded-full bg-linear-to-br from-[#ea4c89] to-[#8b5cf6] text-sm font-semibold text-white" style={{ width: size, height: size }}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

// Opened by "Sign in" or by requireCustomer() when a guest votes or comments.
export function LoginDialog() {
  const reason = useCustomerAuthStore((s) => s.loginReason);
  const closeLogin = useCustomerAuthStore((s) => s.closeLogin);
  const [mode, setMode] = useState<EmailMode>("signin");
  const confirming = mode === "sent-verify" || mode === "sent-reset";
  // Reopening always starts at sign-in.
  useEffect(() => {
    if (reason !== null) setMode("signin");
  }, [reason]);

  return (
    <Dialog.Root open={reason !== null} onOpenChange={(open) => !open && closeLogin()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0d0c22]/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-h-[92vh] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-8 text-center text-[#0d0c22] shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <Dialog.Close className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#6e6d7a] hover:bg-[#f3f3f4]" aria-label="Close">
            <X className="h-4 w-4" />
          </Dialog.Close>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-[#ea4c89] to-[#8b5cf6] font-display text-2xl font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
            N
          </span>
          <Dialog.Title className="mt-5 font-display text-2xl font-bold tracking-[-0.02em]">
            {mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset your password" : "Join Nexa Rankings"}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-[#6e6d7a]">
            {reason || "Vote for apps, join the discussion and launch your own."}
          </Dialog.Description>
          {!confirming && mode !== "forgot" && (
            <>
              <div className="mt-6 grid gap-3">
                <GoogleSignInButton />
                <AppleSignInButton />
              </div>
              <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-[#9e9ea7]">
                <span className="h-px flex-1 bg-[#e7e7e9]" /> or with email <span className="h-px flex-1 bg-[#e7e7e9]" />
              </div>
            </>
          )}
          <div className={confirming || mode === "forgot" ? "mt-6" : ""}>
            <EmailAuth mode={mode} setMode={setMode} />
          </div>
          <p className="mt-6 text-xs text-[#9e9ea7]">
            By continuing you agree to our{" "}
            <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Header slot: "Sign in" for guests, avatar menu for customers.
export function CustomerAccount() {
  const customer = useCustomerAuthStore((s) => s.customer);
  const requestLogin = useCustomerAuthStore((s) => s.requestLogin);
  const logout = useCustomerLogout();
  // The store rehydrates from localStorage on the client only; render the
  // guest state until mounted so prerendered HTML matches the first paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useGoogleOneTap(mounted && !customer);

  if (!mounted || !customer) {
    return (
      <button type="button" onClick={() => requestLogin("")} className="px-3 text-[15px] font-semibold">
        Sign in
      </button>
    );
  }

  return (
    <>
    <NotificationBell />
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="rounded-full ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#ea4c89]" aria-label="Account menu">
        <Avatar name={customer.displayName} src={customer.avatarUrl} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-64 rounded-2xl border border-[#e7e7e9] bg-white p-2 text-[#0d0c22] shadow-[0_10px_40px_rgba(13,12,34,0.12)]">
          <div className="flex items-center gap-3 p-2">
            <Avatar name={customer.displayName} src={customer.avatarUrl} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{customer.displayName}</p>
              <p className="truncate text-xs text-[#6e6d7a]">{customer.email}</p>
            </div>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-[#e7e7e9]" />
          {customer.makerSlug && (
            <DropdownMenu.Item asChild>
              <a href={`/makers/${customer.makerSlug}`} className="block rounded-xl px-3 py-2 text-sm font-medium outline-none data-[highlighted]:bg-[#f3f3f4]">My profile</a>
            </DropdownMenu.Item>
          )}
          {customer.makerSlug && (
            <DropdownMenu.Item asChild>
              <a href="/me?tab=apps" className="block rounded-xl px-3 py-2 text-sm font-medium outline-none data-[highlighted]:bg-[#f3f3f4]">My apps</a>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item asChild>
            <a href="/me" className="block rounded-xl px-3 py-2 text-sm font-medium outline-none data-[highlighted]:bg-[#f3f3f4]">Settings</a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a href="/me?tab=team" className="block rounded-xl px-3 py-2 text-sm font-medium outline-none data-[highlighted]:bg-[#f3f3f4]">Team</a>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <a href="/submit" className="block rounded-xl px-3 py-2 text-sm font-medium outline-none data-[highlighted]:bg-[#f3f3f4]">Submit an app</a>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={logout}
            className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 outline-none data-[highlighted]:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
    </>
  );
}

export { Avatar as CustomerAvatar };
