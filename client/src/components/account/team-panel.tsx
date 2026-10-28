import { useState, type FormEvent } from "react";
import { Check, Copy, Loader2, LogOut, Mail, Trash2, UserPlus } from "lucide-react";
import { env } from "@/config/env";
import { API_ERROR_CODES } from "@/lib/http";
import { CustomerAvatar } from "@/components/auth/customer-account";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import {
  accountApi,
  useInviteMember,
  useRemoveMember,
  useRenameWorkspace,
  useWorkspace,
  type InviteInput,
  type WorkspaceMember,
  type WorkspaceRole,
} from "@/services/account";

const inputClass =
  "w-full rounded-xl border border-[#e7e7e9] bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-[#ea4c89] focus:ring-4 focus:ring-[#ea4c89]/10";

const roleLabel: Record<WorkspaceRole, string> = { owner: "Owner", admin: "Admin", member: "Member" };
const roleHelp = "Admins can invite and remove people. Members can edit apps and the maker profile.";

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          window.prompt("Copy the invite link", url);
        }
      }}
      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#ea4c89] hover:bg-[#fdf0f5]"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy invite link"}
    </button>
  );
}

function MemberRow({ member, canManage, isMe }: { member: WorkspaceMember; canManage: boolean; isMe: boolean }) {
  const remove = useRemoveMember();
  const invited = member.status === "invited";
  // Mock mode has no email delivery, so surface the link to share by hand.
  const link = env.customerApiMock && invited ? accountApi.inviteLink(member.id) : null;
  const canRemove = member.role !== "owner" && (canManage || isMe);

  return (
    <li className="flex flex-wrap items-center gap-3 py-3">
      {invited ? (
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f3f3f4] text-[#9e9ea7]"><Mail className="h-4 w-4" /></span>
      ) : (
        <CustomerAvatar name={member.name ?? member.email} src={member.avatarUrl} size={40} />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {member.name ?? member.email} {isMe && <span className="font-normal text-[#9e9ea7]">(you)</span>}
        </p>
        <p className="truncate text-xs text-[#6e6d7a]">{invited ? "Invite pending" : member.email}</p>
      </div>
      {link && <CopyLink url={link} />}
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${member.role === "owner" ? "bg-[#0d0c22] text-white" : "bg-[#f3f3f4] text-[#3d3d4e]"}`}>
        {roleLabel[member.role]}
      </span>
      {canRemove && (
        <button
          type="button"
          onClick={() => {
            const what = isMe ? "Leave this team?" : invited ? `Cancel the invite to ${member.email}?` : `Remove ${member.name} from the team?`;
            if (window.confirm(what)) remove.mutate(member.id);
          }}
          disabled={remove.isPending}
          aria-label={isMe ? "Leave team" : invited ? "Cancel invite" : `Remove ${member.name}`}
          className="grid h-8 w-8 place-items-center rounded-full text-[#9e9ea7] transition hover:bg-red-50 hover:text-red-600"
        >
          {isMe ? <LogOut className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        </button>
      )}
    </li>
  );
}

function InviteForm() {
  const invite = useInviteMember();
  const [sent, setSent] = useState<string | null>(null);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input: InviteInput = { email: data.get("email")!.toString(), role: data.get("role") as InviteInput["role"] };
    invite.mutate(input, {
      onSuccess: ({ member }) => {
        setSent(member.email);
        form.reset();
      },
    });
  };
  const error = invite.error
    ? invite.error.errorCode === API_ERROR_CODES.INVITE_DUPLICATE
      ? "That person is already on the team or invited."
      : "Couldn't send the invite. Please try again."
    : null;

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-[#f8f7f4] p-5">
      <p className="flex items-center gap-2 font-semibold"><UserPlus className="h-4 w-4" /> Invite a teammate</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input name="email" type="email" required placeholder="teammate@company.com" className={inputClass} onChange={() => setSent(null)} />
        <select name="role" defaultValue="member" className={`${inputClass} sm:w-36`}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn-dark shrink-0 justify-center" disabled={invite.isPending}>
          {invite.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Send invite
        </button>
      </div>
      <p className="mt-2 text-xs text-[#6e6d7a]">{roleHelp}</p>
      {sent && <p role="status" className="mt-2 text-sm font-medium text-emerald-600">Invite sent to {sent}.</p>}
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}

export function TeamPanel() {
  const { data: ws, isPending } = useWorkspace();
  const rename = useRenameWorkspace();
  const customer = useCustomerAuthStore((s) => s.customer);
  if (isPending || !ws) return <div className="h-64 animate-pulse rounded-3xl bg-[#f3f3f4]" />;

  const canManage = ws.myRole !== "member";
  const active = ws.members.filter((m) => m.status === "active");
  const invited = ws.members.filter((m) => m.status === "invited");

  return (
    <div className="grid gap-8">
      <form
        className="grid gap-1.5"
        onSubmit={(e) => {
          e.preventDefault();
          const name = new FormData(e.currentTarget).get("name")!.toString().trim();
          if (name && name !== ws.name) rename.mutate(name);
        }}
      >
        <label htmlFor="ws-name" className="text-sm font-semibold">Team name</label>
        <div className="flex gap-3">
          <input id="ws-name" key={ws.name} name="name" required maxLength={60} defaultValue={ws.name} disabled={!canManage} className={inputClass} />
          {canManage && <button type="submit" className="btn-dark shrink-0" disabled={rename.isPending}>Save</button>}
        </div>
        <p className="text-xs text-[#6e6d7a]">Everyone on the team shares the maker profile, apps and plan.</p>
      </form>

      {canManage && <InviteForm />}

      <section>
        <h2 className="text-sm font-semibold">Members ({active.length})</h2>
        <ul className="mt-2 divide-y divide-[#f3f3f4]">
          {active.map((m) => <MemberRow key={m.id} member={m} canManage={canManage} isMe={m.email === customer?.email} />)}
        </ul>
      </section>
      {invited.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold">Pending invites ({invited.length})</h2>
          <ul className="mt-2 divide-y divide-[#f3f3f4]">
            {invited.map((m) => <MemberRow key={m.id} member={m} canManage={canManage} isMe={false} />)}
          </ul>
        </section>
      )}
    </div>
  );
}
