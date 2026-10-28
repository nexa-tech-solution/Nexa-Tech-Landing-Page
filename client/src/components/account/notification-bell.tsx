import * as Popover from "@radix-ui/react-popover";
import { Bell, CalendarClock, ChevronUp, MessageCircle, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useMarkRead, useNotifications, type AppNotification, type NotificationType } from "@/services/account";

const typeIcon: Record<NotificationType, typeof Bell> = {
  vote: ChevronUp,
  comment: MessageCircle,
  launch: CalendarClock,
  follow: UserPlus,
  team: Users,
};

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function NotificationItem({ n, onOpen }: { n: AppNotification; onOpen: (n: AppNotification) => void }) {
  const Icon = typeIcon[n.type];
  return (
    <a
      href={n.href}
      onClick={() => onOpen(n)}
      className={`flex gap-3 rounded-xl p-3 transition hover:bg-[#f8f7f4] ${n.read ? "" : "bg-[#fdf0f5]/60"}`}
    >
      {n.actor?.avatarUrl ? (
        <img src={n.actor.avatarUrl} alt="" width={36} height={36} referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f3f3f4] text-[#6e6d7a]">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-5">{n.title}</span>
        {n.body && <span className="mt-0.5 block truncate text-sm text-[#6e6d7a]">{n.body}</span>}
        <span className="mt-1 block text-xs text-[#9e9ea7]">{timeAgo(n.createdAt)}</span>
      </span>
      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#ea4c89]" aria-label="Unread" />}
    </a>
  );
}

export function NotificationBell() {
  const { data = [] } = useNotifications();
  const markRead = useMarkRead();
  const [open, setOpen] = useState(false);
  const unread = data.filter((n) => !n.read).length;

  const onOpen = (n: AppNotification) => {
    if (!n.read) markRead.mutate([n.id]);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#f3f3f4]"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#ea4c89] px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={8} className="z-50 w-[min(380px,calc(100vw-2rem))] rounded-2xl border border-[#e7e7e9] bg-white p-2 text-[#0d0c22] shadow-[0_10px_40px_rgba(13,12,34,0.12)]">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="font-semibold">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={() => markRead.mutate(undefined)} className="text-sm font-semibold text-[#ea4c89]">
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {data.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-[#6e6d7a]">You're all caught up.</p>
            ) : (
              data.slice(0, 12).map((n) => <NotificationItem key={n.id} n={n} onOpen={onOpen} />)
            )}
          </div>
          <a href="/me?tab=notifications" onClick={() => setOpen(false)} className="mt-1 block rounded-xl px-3 py-2 text-center text-sm font-semibold text-[#6e6d7a] hover:bg-[#f3f3f4]">
            See all and email settings
          </a>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
