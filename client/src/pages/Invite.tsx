import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Loader2, Users } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { useAcceptInvite, useInvitePreview } from "@/services/account";

export default function Invite() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  const { data: invite, isPending, error } = useInvitePreview(token);
  const accept = useAcceptInvite();
  const customer = useCustomerAuthStore((s) => s.customer);
  const requestLogin = useCustomerAuthStore((s) => s.requestLogin);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  let body;
  if (!mounted || isPending) body = <div className="h-56 animate-pulse rounded-3xl bg-[#f3f3f4]" />;
  else if (error || !invite) {
    body = (
      <div className="rounded-3xl border border-[#e7e7e9] p-8 text-center">
        <p className="font-semibold">This invite is no longer valid</p>
        <p className="mt-1 text-sm text-[#6e6d7a]">It may have been used or cancelled. Ask your teammate for a new one.</p>
      </div>
    );
  } else {
    body = (
      <div className="rounded-3xl border border-[#e7e7e9] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-[#ea4c89] to-[#8b5cf6] text-white">
          <Users className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-[-0.02em]">Join {invite.workspaceName}</h1>
        <p className="mt-2 text-[#6e6d7a]">
          {invite.invitedBy} invited <b className="text-[#0d0c22]">{invite.email}</b> as {invite.role === "admin" ? "an admin" : "a member"}.
        </p>
        {customer && customer.email.toLowerCase() !== invite.email.toLowerCase() && (
          <p className="mt-3 rounded-xl bg-[#fff7e6] px-3 py-2 text-sm text-[#b45309]">
            You're signed in as {customer.email}. You can still accept, or sign in with the invited address.
          </p>
        )}
        {customer ? (
          <button
            type="button"
            className="btn-dark mt-6"
            disabled={accept.isPending}
            onClick={() => accept.mutate(token, { onSuccess: () => navigate("/me?tab=team") })}
          >
            {accept.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Accept invite
          </button>
        ) : (
          <button type="button" className="btn-dark mt-6" onClick={() => requestLogin(`Sign in to join ${invite.workspaceName}.`)}>
            Sign in to accept
          </button>
        )}
        {accept.error && <p role="alert" className="mt-3 text-sm text-red-600">Couldn't join the team. Please try again.</p>}
      </div>
    );
  }

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo title="Team invite | Nexa Rankings" path="/invite" noindex />
      <SiteHeader />
      <main className="px-5 pb-24 pt-16 md:px-10">
        <div className="mx-auto max-w-[520px]">{body}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
