import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { useSearch } from "wouter";
import { CalendarClock, CheckCircle2, ExternalLink, Loader2, Pencil, Rocket, Trash2, X } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { CustomerAvatar } from "@/components/auth/customer-account";
import { BadgeEmbedButton } from "@/components/rankings/badge-embed";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { NotificationPanel } from "@/components/account/notification-panel";
import { TeamPanel } from "@/components/account/team-panel";
import { useWorkspace } from "@/services/account";
import {
  useAppDetail,
  useCancelLaunch,
  useMakerProfile,
  useRankingCategories,
  useUpdateApp,
  useUpdateMyProfile,
  type AppCategorySlug,
  type Launch,
  type MakerProfile,
} from "@/services/rankings";

const inputClass =
  "w-full rounded-xl border border-[#e7e7e9] bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-[#ea4c89] focus:ring-4 focus:ring-[#ea4c89]/10";

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-baseline justify-between text-sm font-semibold">
        {label}
        {hint && <span className="text-xs font-normal text-[#9e9ea7]">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

// Empty strings mean "remove this link".
const optional = (value: FormDataEntryValue | null) => value?.toString().trim() || undefined;

function ProfileForm({ maker }: { maker: MakerProfile }) {
  const save = useUpdateMyProfile();
  const [saved, setSaved] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaved(false);
    save.mutate(
      {
        name: data.get("name")!.toString().trim(),
        role: data.get("role")!.toString().trim(),
        bio: data.get("bio")!.toString().trim(),
        location: optional(data.get("location")),
        links: {
          website: optional(data.get("website")),
          x: optional(data.get("x")),
          linkedin: optional(data.get("linkedin")),
          github: optional(data.get("github")),
        },
      },
      { onSuccess: () => setSaved(true) },
    );
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6" onChange={() => setSaved(false)}>
      <div className="flex items-center gap-4">
        <CustomerAvatar name={maker.name} src={maker.avatar || null} size={64} />
        <p className="text-sm text-[#6e6d7a]">Your photo comes from your Google account.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name">
          <input name="name" required maxLength={60} defaultValue={maker.name} className={inputClass} />
        </Field>
        <Field label="Headline" hint="e.g. Indie iOS developer">
          <input name="role" required maxLength={60} defaultValue={maker.role} className={inputClass} />
        </Field>
      </div>
      <Field label="Bio">
        <textarea name="bio" required rows={4} maxLength={300} defaultValue={maker.bio} className={inputClass} />
      </Field>
      <Field label="Location">
        <input name="location" maxLength={60} defaultValue={maker.location} placeholder="City, Country" className={inputClass} />
      </Field>
      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className="mb-3 text-sm font-semibold">Links</legend>
        <Field label="Website">
          <input name="website" type="url" defaultValue={maker.links.website} placeholder="https://" className={inputClass} />
        </Field>
        <Field label="X (Twitter)">
          <input name="x" type="url" defaultValue={maker.links.x} placeholder="https://x.com/…" pattern="https://(www\.)?(x|twitter)\.com/.+" className={inputClass} />
        </Field>
        <Field label="LinkedIn">
          <input name="linkedin" type="url" defaultValue={maker.links.linkedin} placeholder="https://linkedin.com/in/…" pattern="https://([a-z]+\.)?linkedin\.com/.+" className={inputClass} />
        </Field>
        <Field label="GitHub">
          <input name="github" type="url" defaultValue={maker.links.github} placeholder="https://github.com/…" pattern="https://(www\.)?github\.com/.+" className={inputClass} />
        </Field>
      </fieldset>
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-dark" disabled={save.isPending}>
          {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save profile
        </button>
        {saved && (
          <span role="status" className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
        {save.error && <span role="alert" className="text-sm text-red-600">Couldn't save. Please try again.</span>}
      </div>
    </form>
  );
}

function EditAppDialog({ app, onClose }: { app: Launch; onClose: () => void }) {
  const update = useUpdateApp(app.slug);
  const { data: categories = [] } = useRankingCategories();
  const [tagline, setTagline] = useState(app.tagline);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    update.mutate(
      {
        name: data.get("name")!.toString().trim(),
        tagline: tagline.trim(),
        description: data.get("description")!.toString().trim(),
        category: data.get("category") as AppCategorySlug,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0d0c22]/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 text-[#0d0c22] shadow-2xl md:p-8">
          <Dialog.Close className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[#6e6d7a] hover:bg-[#f3f3f4]" aria-label="Close">
            <X className="h-4 w-4" />
          </Dialog.Close>
          <Dialog.Title className="text-xl font-semibold">Edit {app.name}</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-[#6e6d7a]">
            Icon and screenshots stay in sync with your store listing.
          </Dialog.Description>
          <form onSubmit={onSubmit} className="mt-6 grid gap-5">
            <Field label="App name">
              <input name="name" required maxLength={60} defaultValue={app.name} className={inputClass} />
            </Field>
            <Field label="Tagline" hint={`${tagline.length}/60`}>
              <input name="tagline" required maxLength={60} value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Category">
              <select key={categories.length} name="category" required defaultValue={app.category} className={inputClass}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Description">
              <AppDescription slug={app.slug} />
            </Field>
            {update.error && <p role="alert" className="text-sm text-red-600">Couldn't save. Please try again.</p>}
            <div className="flex justify-end gap-3">
              <Dialog.Close className="rounded-full px-5 py-3 text-sm font-semibold hover:bg-[#f3f3f4]">Cancel</Dialog.Close>
              <button type="submit" className="btn-dark" disabled={update.isPending}>
                {update.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// The maker list omits descriptions; load the app page's data for the textarea.
function AppDescription({ slug }: { slug: string }) {
  const { data } = useAppDetail(slug);
  if (!data) return <div className="h-32 animate-pulse rounded-xl bg-[#f3f3f4]" />;
  return <textarea name="description" required rows={5} maxLength={4000} defaultValue={data.description} className={inputClass} />;
}

function CancelLaunchButton({ app }: { app: Launch }) {
  const cancel = useCancelLaunch();
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
        <Trash2 className="h-4 w-4" /> Cancel launch
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[#0d0c22]/40 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 text-[#0d0c22] shadow-2xl md:p-8">
          <AlertDialog.Title className="text-xl font-semibold">Cancel the launch of {app.name}?</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-[#6e6d7a]">
            Your {shortDate(app.launchDate)} slot is released and the app is removed. You can submit it again later, but it goes to the back of the queue.
          </AlertDialog.Description>
          {cancel.error && <p role="alert" className="mt-3 text-sm text-red-600">Couldn't cancel. Please try again.</p>}
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel className="rounded-full px-5 py-3 text-sm font-semibold hover:bg-[#f3f3f4]">Keep it</AlertDialog.Cancel>
            <button
              type="button"
              onClick={() => cancel.mutate(app.slug)}
              disabled={cancel.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {cancel.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Cancel launch
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

function MyApps({ apps }: { apps: Launch[] }) {
  const [editing, setEditing] = useState<Launch | null>(null);
  if (apps.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#e7e7e9] py-16 text-center">
        <p className="text-[#6e6d7a]">You haven't submitted any apps yet.</p>
        <a href="/submit" className="btn-dark mt-4">Submit your app</a>
      </div>
    );
  }
  return (
    <>
      <ul className="grid gap-3">
        {apps.map((app) => (
          <li key={app.slug} className="flex flex-col gap-4 rounded-3xl border border-[#e7e7e9] p-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <img src={app.icon} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{app.name}</p>
                <p className="truncate text-sm text-[#6e6d7a]">{app.tagline}</p>
                {app.status === "scheduled" ? (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#fff7e6] px-2 py-0.5 text-xs font-semibold text-[#b45309]">
                    <CalendarClock className="h-3.5 w-3.5" /> Launching {shortDate(app.launchDate)}
                  </span>
                ) : (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <Rocket className="h-3.5 w-3.5" /> Live · {app.votes.toLocaleString("en-US")} upvotes
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:justify-end">
              <a href={`/app/${app.slug}`} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-[#f3f3f4]">
                <ExternalLink className="h-4 w-4" /> View
              </a>
              <button type="button" onClick={() => setEditing(app)} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-[#f3f3f4]">
                <Pencil className="h-4 w-4" /> Edit
              </button>
              {app.status === "scheduled" ? <CancelLaunchButton app={app} /> : <BadgeEmbedButton app={app} />}
            </div>
          </li>
        ))}
      </ul>
      {editing && <EditAppDialog app={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

const tabs = [
  { value: "profile", label: "Profile" },
  { value: "apps", label: "My apps" },
  { value: "team", label: "Team" },
  { value: "notifications", label: "Notifications" },
] as const;
type Tab = (typeof tabs)[number]["value"];

function NoMakerYet() {
  return (
    <div className="rounded-3xl border border-dashed border-[#e7e7e9] py-16 text-center">
      <p className="font-semibold">Your team doesn't have a maker profile yet</p>
      <p className="mt-1 text-sm text-[#6e6d7a]">It's created when someone on the team submits the first app.</p>
      <a href="/submit" className="btn-dark mt-5">Submit your app</a>
    </div>
  );
}

export default function Account() {
  const customer = useCustomerAuthStore((s) => s.customer);
  const requestLogin = useCustomerAuthStore((s) => s.requestLogin);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const requested = new URLSearchParams(useSearch()).get("tab");
  const tab: Tab = tabs.find((t) => t.value === requested)?.value ?? "profile";
  const { data: workspace } = useWorkspace();
  // Teammates share the workspace's maker profile.
  const makerSlug = customer?.makerSlug ?? workspace?.makerSlug ?? undefined;
  const { data: maker, isPending } = useMakerProfile(makerSlug);

  let body: ReactNode;
  if (!mounted) body = <div className="h-64 animate-pulse rounded-3xl bg-[#f3f3f4]" />;
  else if (!customer) {
    body = (
      <div className="rounded-3xl border border-[#e7e7e9] p-8 text-center">
        <p className="font-semibold">Sign in to manage your account</p>
        <button type="button" className="btn-dark mt-5" onClick={() => requestLogin("")}>Continue with Google</button>
      </div>
    );
  } else if (tab === "team") body = <TeamPanel />;
  else if (tab === "notifications") body = <NotificationPanel />;
  else if (!makerSlug) body = <NoMakerYet />;
  else if (isPending || !maker) body = <div className="h-64 animate-pulse rounded-3xl bg-[#f3f3f4]" />;
  else body = tab === "apps" ? <MyApps apps={maker.apps} /> : <ProfileForm key={maker.slug} maker={maker} />;

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo title="Your account | Nexa Rankings" path="/me" noindex />
      <SiteHeader />
      <main className="px-5 pb-24 pt-12 md:px-10">
        <div className="mx-auto max-w-[760px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="section-title">Your account</h1>
            {mounted && makerSlug && (
              <a href={`/makers/${makerSlug}`} className="flex items-center gap-1.5 text-sm font-semibold text-[#ea4c89]">
                View public profile <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          {mounted && customer && (
            <nav aria-label="Account sections" className="-mx-5 mt-8 flex gap-1 overflow-x-auto border-b border-[#e7e7e9] px-5 md:mx-0 md:px-0">
              {tabs.map((t) => (
                <a
                  key={t.value}
                  href={t.value === "profile" ? "/me" : `/me?tab=${t.value}`}
                  aria-current={tab === t.value ? "page" : undefined}
                  className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    tab === t.value ? "border-[#0d0c22]" : "border-transparent text-[#6e6d7a] hover:text-[#0d0c22]"
                  }`}
                >
                  {t.label}
                  {t.value === "apps" && maker && <span className="ml-1.5 text-[#9e9ea7]">{maker.apps.length}</span>}
                </a>
              ))}
            </nav>
          )}
          <div className="mt-8">{body}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
