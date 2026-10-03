import { socials, team } from "@/components/nexa/data";
import {
  ArrowRight,
  Check,
  Copy,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

function Action({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f3f3f4] text-[#0d0c22]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#0d0c22]">{title}</span>
        <span className="block truncate text-[13px] text-[#6e6d7a]">{detail}</span>
      </span>
    </>
  );
}

const actionClass =
  "flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#f8f7f4]";

const subject = "Project enquiry";
// Opens Gmail's compose window in a new tab: works in any browser, unlike a
// bare mailto: which needs a desktop mail app to be configured.
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  socials.email,
)}&su=${encodeURIComponent(subject)}`;

// Floating "Chat with us". A bare mailto: does nothing on machines without a
// default mail app, so the button opens a small panel whose options all work:
// open an email, copy the address, or jump to the contact form.
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socials.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the address is still visible to copy by hand.
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
    >
      {open ? (
        <div
          id="chat-panel"
          role="dialog"
          aria-label="Contact Nexa"
          className="chat-pop w-[min(340px,calc(100vw-2.5rem))] rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(13,12,34,0.18)] ring-1 ring-[#ececee]"
        >
          <div className="flex items-start justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {team.map((member) => (
                  <img
                    key={member.name}
                    src={member.avatar}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="font-semibold leading-tight text-[#0d0c22]">
                  Chat with Nexa
                </p>
                <p className="mt-0.5 text-[13px] text-[#6e6d7a]">
                  We read every message.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[#6e6d7a] transition hover:bg-[#f3f3f4] hover:text-[#0d0c22]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 px-1 text-sm leading-6 text-[#3d3d4e]">
            Tell us what you are building and we will reply by email.
          </p>

          {/* minmax(0,1fr): grid items otherwise refuse to shrink below their
              truncated text and push the rows past the panel edge. */}
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-1">
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={actionClass}
            >
              <Action
                icon={<Mail className="h-4 w-4" />}
                title="Write us in Gmail"
                detail={socials.email}
              />
            </a>
            <button type="button" onClick={copyEmail} className={actionClass}>
              <Action
                icon={
                  copied ? (
                    <Check className="h-4 w-4 text-[#ea4c89]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )
                }
                title={copied ? "Copied to clipboard" : "Copy email address"}
                detail="Paste it into Gmail or any mail app"
              />
            </button>
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className={actionClass}
            >
              <Action
                icon={<ArrowRight className="h-4 w-4" />}
                title="Use the contact form"
                detail="Name, email and a few lines about the idea"
              />
            </a>
          </div>

        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat options" : "Chat with Nexa"}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-[#ea4c89] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-[#f082ac]"
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        <span className="hidden sm:inline">
          {open ? "Close" : "Chat with us"}
        </span>
      </button>
    </div>
  );
}
