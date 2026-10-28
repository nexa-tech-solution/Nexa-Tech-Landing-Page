import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, CalendarClock, CheckCircle2, ImageOff, Link2, Loader2, Rocket, Zap } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { API_ERROR_CODES } from "@/lib/http";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import {
  useRankingCategories,
  useStoreLookup,
  useSubmitApp,
  type AppCategorySlug,
  type StoreLookup,
  type SubmitAppResult,
} from "@/services/rankings";

const TAGLINE_MAX = 60;
const FREE_QUEUE_DAYS = 7;

// Free launches join the queue: first open day a week out.
function nextFreeSlot() {
  const date = new Date();
  date.setDate(date.getDate() + FREE_QUEUE_DAYS);
  return date.toISOString().slice(0, 10);
}

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
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

const inputClass = "w-full rounded-xl border border-[#e7e7e9] bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-[#ea4c89] focus:ring-4 focus:ring-[#ea4c89]/10";

function StepUrl({ onFound }: { onFound: (lookup: StoreLookup) => void }) {
  const lookup = useStoreLookup();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = new FormData(event.currentTarget).get("url")?.toString().trim() ?? "";
    lookup.mutate(url, { onSuccess: onFound });
  };
  const error = lookup.error
    ? lookup.error.errorCode === API_ERROR_CODES.STORE_URL_INVALID
      ? "Paste a link from apps.apple.com or play.google.com."
      : "We couldn't read that listing. Check the link and try again."
    : null;

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-[#e7e7e9] p-6 md:p-8">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Link2 className="h-5 w-5 text-[#ea4c89]" /> Paste your store link
      </h2>
      <p className="mt-1 text-sm text-[#6e6d7a]">We'll pull the name, icon, description and screenshots from the listing.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          name="url"
          type="url"
          required
          autoFocus
          placeholder="https://apps.apple.com/app/… or https://play.google.com/store/apps/details?id=…"
          className={inputClass}
        />
        <button type="submit" className="btn-dark shrink-0 justify-center" disabled={lookup.isPending}>
          {lookup.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Fetch app
        </button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    </form>
  );
}

function StepDetails({ lookup, onBack, onDone }: { lookup: StoreLookup; onBack: () => void; onDone: (r: SubmitAppResult) => void }) {
  const { data: categories = [] } = useRankingCategories();
  const submit = useSubmitApp();
  const [tagline, setTagline] = useState("");
  const freeDate = nextFreeSlot();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => data.get(key)?.toString().trim() ?? "";
    submit.mutate(
      {
        storeUrl: lookup.storeUrl,
        platform: lookup.platform,
        name: get("name"),
        tagline: get("tagline"),
        description: get("description"),
        icon: get("icon"),
        screenshots: lookup.screenshots,
        category: get("category") as AppCategorySlug,
        launchDate: freeDate,
      },
      { onSuccess: onDone },
    );
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-8">
      <div className="flex items-center gap-4 rounded-3xl bg-[#f8f7f4] p-5">
        {lookup.icon ? (
          <img src={lookup.icon} alt="" width={64} height={64} className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-[#9e9ea7]"><ImageOff className="h-6 w-6" /></span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{lookup.name}</p>
          <p className="truncate text-sm text-[#6e6d7a]">{lookup.platform === "ios" ? "App Store" : "Google Play"} · {lookup.storeUrl}</p>
        </div>
        <button type="button" onClick={onBack} className="text-sm font-semibold text-[#ea4c89]">Change</button>
      </div>

      {lookup.screenshots.length > 0 && (
        <div>
          <p className="text-sm font-semibold">Screenshots from the store</p>
          <div className="-mx-5 mt-2 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
            {lookup.screenshots.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" className="h-56 w-auto shrink-0 rounded-2xl border border-[#e7e7e9]" />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="App name">
          <input name="name" required maxLength={60} defaultValue={lookup.name} className={inputClass} />
        </Field>
        <Field label="Category">
          {/* Remount once categories load, or defaultValue lands on an empty list
              and the browser silently picks the first option. */}
          <select key={categories.length} name="category" required defaultValue={lookup.category ?? ""} className={inputClass}>
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Tagline" hint={`${tagline.length}/${TAGLINE_MAX}`}>
        <input
          name="tagline"
          required
          maxLength={TAGLINE_MAX}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="What does it do, in one line?"
          className={inputClass}
        />
      </Field>
      <Field label="Description">
        <textarea name="description" required rows={5} maxLength={4000} defaultValue={lookup.description} className={inputClass} />
      </Field>
      {!lookup.icon && (
        <Field label="Icon URL" hint="Google Play listings are read by our server; paste the icon for now">
          <input name="icon" type="url" required placeholder="https://…" className={inputClass} />
        </Field>
      )}
      {lookup.icon && <input type="hidden" name="icon" value={lookup.icon} />}

      <fieldset className="grid gap-3">
        <legend className="mb-1.5 text-sm font-semibold">Launch day</legend>
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-[#ea4c89] bg-[#fdf0f5]/50 p-4">
          <input type="radio" name="plan" value="free" defaultChecked className="mt-1 accent-[#ea4c89]" />
          <span className="flex-1">
            <span className="flex items-center gap-2 font-semibold"><CalendarClock className="h-4 w-4" /> Free launch</span>
            <span className="mt-0.5 block text-sm text-[#6e6d7a]">Next open slot: <b className="text-[#0d0c22]">{longDate(freeDate)}</b></span>
          </span>
          <span className="font-semibold">$0</span>
        </label>
        <label className="flex items-start gap-4 rounded-2xl border border-[#e7e7e9] p-4 opacity-60">
          <input type="radio" name="plan" value="boost" disabled className="mt-1" />
          <span className="flex-1">
            <span className="flex items-center gap-2 font-semibold">
              <Zap className="h-4 w-4" /> Launch Boost
              <span className="rounded-full bg-[#f3f3f4] px-2 py-0.5 text-[11px] font-semibold text-[#6e6d7a]">Coming soon</span>
            </span>
            <span className="mt-0.5 block text-sm text-[#6e6d7a]">Pick any day, featured slot and a spot in the weekly newsletter.</span>
          </span>
        </label>
      </fieldset>

      {submit.error && <p role="alert" className="text-sm text-red-600">Your app couldn't be submitted. Please try again.</p>}
      <button type="submit" className="btn-dark justify-self-start" disabled={submit.isPending}>
        {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
        Schedule launch
      </button>
    </form>
  );
}

function Done({ result }: { result: SubmitAppResult }) {
  return (
    <div className="rounded-3xl border border-[#e7e7e9] p-8 text-center md:p-12" role="status">
      <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
      <h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.02em]">{result.app.name} is scheduled</h2>
      <p className="mt-2 text-[#6e6d7a]">
        It goes live on <b className="text-[#0d0c22]">{longDate(result.app.launchDate)}</b>. Your followers get an email that morning.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href={`/app/${result.app.slug}`} className="btn-dark">View app page</a>
        <a href={`/makers/${result.makerSlug}`} className="rounded-full border border-[#e7e7e9] px-5 py-3 text-sm font-semibold transition hover:bg-[#f3f3f4]">
          My maker profile
        </a>
      </div>
    </div>
  );
}

export default function Submit() {
  const customer = useCustomerAuthStore((s) => s.customer);
  const requestLogin = useCustomerAuthStore((s) => s.requestLogin);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [lookup, setLookup] = useState<StoreLookup | null>(null);
  const [result, setResult] = useState<SubmitAppResult | null>(null);

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo title="Submit your app | Nexa Rankings" description="Launch your mobile app on Nexa Rankings." path="/submit" noindex />
      <SiteHeader />
      <main className="px-5 pb-24 pt-12 md:px-10">
        <div className="mx-auto max-w-[760px]">
          <p className="kicker">Launch on Nexa</p>
          <h1 className="section-title mt-3">Submit your app</h1>
          <p className="mt-4 text-lg text-[#3d3d4e]">Get in front of people who love trying new apps. Free launches go live within a week.</p>

          <div className="mt-10">
            {!mounted ? (
              <div className="h-48 animate-pulse rounded-3xl bg-[#f3f3f4]" />
            ) : !customer ? (
              <div className="rounded-3xl border border-[#e7e7e9] p-8 text-center">
                <p className="font-semibold">Sign in to submit an app</p>
                <p className="mt-1 text-sm text-[#6e6d7a]">Your first launch creates your maker profile.</p>
                <button type="button" className="btn-dark mt-5" onClick={() => requestLogin("Sign in to launch your app on Nexa.")}>
                  Continue with Google
                </button>
              </div>
            ) : result ? (
              <Done result={result} />
            ) : lookup ? (
              <StepDetails lookup={lookup} onBack={() => setLookup(null)} onDone={setResult} />
            ) : (
              <StepUrl onFound={setLookup} />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
