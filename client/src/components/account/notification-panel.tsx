import { useMarkRead, useNotificationSettings, useNotifications, useSaveNotificationSettings, type EmailPreference } from "@/services/account";
import { NotificationItem } from "./notification-bell";

const emailOptions: { key: EmailPreference; label: string; help: string }[] = [
  { key: "launch", label: "Launch day", help: "The morning your app goes live, and launches from makers you follow." },
  { key: "comment", label: "Comments", help: "When someone comments on your app." },
  { key: "vote", label: "Upvotes", help: "A daily summary of new upvotes on your apps." },
  { key: "follow", label: "New followers", help: "When someone follows your maker profile." },
  { key: "digest", label: "Weekly digest", help: "The top new apps of the week, every Monday." },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#ea4c89]" : "bg-[#dbdbde]"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export function NotificationPanel() {
  const { data: list = [] } = useNotifications();
  const { data: settings } = useNotificationSettings();
  const save = useSaveNotificationSettings();
  const markRead = useMarkRead();
  const unread = list.filter((n) => !n.read).length;

  return (
    <div className="grid gap-10">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent ({list.length})</h2>
          {unread > 0 && (
            <button type="button" onClick={() => markRead.mutate(undefined)} className="text-sm font-semibold text-[#ea4c89]">
              Mark all as read
            </button>
          )}
        </div>
        {list.length === 0 ? (
          <p className="mt-3 rounded-3xl border border-dashed border-[#e7e7e9] py-12 text-center text-sm text-[#6e6d7a]">No notifications yet.</p>
        ) : (
          <div className="mt-2 grid gap-1">
            {list.map((n) => <NotificationItem key={n.id} n={n} onOpen={(x) => !x.read && markRead.mutate([x.id])} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold">Email me about</h2>
        <p className="mt-1 text-xs text-[#6e6d7a]">In-app notifications are always on. Every email has a one-click unsubscribe link.</p>
        {settings ? (
          <ul className="mt-4 divide-y divide-[#f3f3f4] rounded-3xl border border-[#e7e7e9] px-5">
            {emailOptions.map((o) => (
              <li key={o.key} className="flex items-center gap-4 py-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{o.label}</p>
                  <p className="text-xs text-[#6e6d7a]">{o.help}</p>
                </div>
                <Toggle
                  label={`Email me about ${o.label.toLowerCase()}`}
                  checked={settings.email[o.key]}
                  onChange={(v) => save.mutate({ email: { ...settings.email, [o.key]: v } })}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 h-64 animate-pulse rounded-3xl bg-[#f3f3f4]" />
        )}
      </section>
    </div>
  );
}
