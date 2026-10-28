import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Award, Check, Copy, X } from "lucide-react";
import { badgeSnippets, badgeThemes, renderBadgeSvg, type BadgeTheme } from "@/lib/badge";

type BadgeApp = { slug: string; name: string; dailyRank?: number };

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked: the text is selectable below.
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <button type="button" onClick={copy} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-[#ea4c89] hover:bg-[#fdf0f5]">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-[#f8f7f4] p-3 text-xs leading-5 text-[#3d3d4e]">{value}</pre>
    </div>
  );
}

// Makers embed this on their site or README; every embed is a backlink.
export function BadgeEmbedButton({ app, className }: { app: BadgeApp; className?: string }) {
  const [theme, setTheme] = useState<BadgeTheme>("light");
  const snippets = badgeSnippets(app, theme);
  // Preview renders the same SVG the build writes to /badges, inline.
  const preview = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderBadgeSvg(app, theme))}`;

  return (
    <Dialog.Root>
      <Dialog.Trigger className={className ?? "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-[#f3f3f4]"}>
        <Award className="h-4 w-4" /> Get badge
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0d0c22]/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 text-[#0d0c22] shadow-2xl md:p-8">
          <Dialog.Close className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#6e6d7a] hover:bg-[#f3f3f4]" aria-label="Close">
            <X className="h-4 w-4" />
          </Dialog.Close>
          <Dialog.Title className="text-xl font-semibold">Show off your launch</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-[#6e6d7a]">
            Add this badge to your website or README. It links visitors back to {app.name} on Nexa.
          </Dialog.Description>

          <div className="mt-6 flex gap-1 rounded-full bg-[#f3f3f4] p-1" role="group" aria-label="Badge theme">
            {badgeThemes.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={theme === t}
                onClick={() => setTheme(t)}
                className={`flex-1 rounded-full py-1.5 text-sm font-semibold capitalize transition ${theme === t ? "bg-white shadow-sm" : "text-[#6e6d7a]"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className={`mt-4 grid place-items-center rounded-2xl p-8 ${theme === "dark" ? "bg-[#f3f3f4]" : "bg-[#f8f7f4]"}`}>
            <img src={preview} alt="Badge preview" width={250} height={54} />
          </div>

          <div className="mt-6 grid gap-5">
            <CopyField label="HTML" value={snippets.html} />
            <CopyField label="Markdown (README)" value={snippets.markdown} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
