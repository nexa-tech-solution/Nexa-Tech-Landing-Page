import { ArrowRight, ArrowUpRight, BarChart3, Check, Link2, Rocket, TrendingUp } from "lucide-react";
import { useReveal } from "@/components/nexa/use-reveal";

type MarqueeApp = { name: string; icon: string; category: string; href?: string };

const marqueeApps: MarqueeApp[] = [
  { name: "Ingredient Scanner", icon: "/graphic/icons/ingredient-scanner.webp", category: "AI", href: "/app/ingredient-scanner" },
  { name: "PetPal", icon: "/graphic/icons/petpal-pet-simulator.webp", category: "Games", href: "/app/petpal-pet-simulator" },
  { name: "FieldStamp", icon: "/graphic/icons/fieldstamp-gps-camera.webp", category: "Photo & Video", href: "/app/fieldstamp-gps-camera" },
  { name: "Tarot Destiny", icon: "/graphic/icons/tarot-destiny.webp", category: "Lifestyle", href: "/app/tarot-destiny" },
  { name: "Loan Estimator", icon: "/graphic/icons/loan-estimator.webp", category: "Finance", href: "/app/loan-estimator" },
  { name: "ScanQR", icon: "/graphic/icons/scanqr.webp", category: "Utilities", href: "/app/scanqr" },
  { name: "Horror Chat Stories", icon: "/graphic/icons/horror-chat-stories.webp", category: "Games", href: "/app/horror-chat-stories" },
  { name: "Coloring Book", icon: "/graphic/icons/coloring-book-paint-and-draw.webp", category: "Education", href: "/app/coloring-book-paint-and-draw" },
  { name: "Currency Converter", icon: "/graphic/icons/smart-currency-converter.webp", category: "Finance", href: "/app/smart-currency-converter" },
  { name: "Image Resizer", icon: "/graphic/icons/quick-image-pdf-resizer.webp", category: "Utilities", href: "/app/quick-image-pdf-resizer" },
  { name: "World Time Buddy", icon: "/graphic/icons/world-time-buddy.webp", category: "Productivity" },
  { name: "The Home Versus", icon: "/graphic/icons/the-home-versus.webp", category: "Games" },
  { name: "CleanMaster", icon: "/graphic/cleanmaster-icon.webp", category: "Utilities" },
  { name: "AI Lecture Recorder", icon: "/graphic/ai-lecture-recorder-icon.webp", category: "AI" },
];

function MarqueeRow({ apps, reverse = false }: { apps: MarqueeApp[]; reverse?: boolean }) {
  // Rendered twice so translateX(-50%) loops seamlessly.
  const items = [...apps, ...apps];
  return (
    <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <ul className={`marquee-track flex gap-3 py-2 ${reverse ? "reverse" : ""}`}>
        {items.map((app, i) => {
          const Tag = app.href ? "a" : "div";
          return (
            <li key={`${app.name}-${i}`} aria-hidden={i >= apps.length}>
              <Tag
                {...(app.href ? { href: app.href, tabIndex: i >= apps.length ? -1 : undefined } : {})}
                className="flex items-center gap-3 rounded-2xl border border-[#ececee] bg-white py-2 pl-2 pr-5 shadow-[0_1px_2px_rgba(13,12,34,0.04)] transition hover:border-[#dbdbde]"
              >
                <img src={app.icon} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-xl object-cover" />
                <span className="whitespace-nowrap">
                  <span className="block text-sm font-semibold">{app.name}</span>
                  <span className="block text-xs text-[#9e9ea7]">{app.category}</span>
                </span>
              </Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AppMarquee() {
  const half = Math.ceil(marqueeApps.length / 2);
  return (
    <section aria-label="Apps launching on Nexa" className="pb-20">
      <p className="mb-5 text-center text-sm font-medium text-[#6e6d7a]">Apps launching on Nexa this month</p>
      <div className="grid gap-1">
        <MarqueeRow apps={marqueeApps.slice(0, half)} />
        <MarqueeRow apps={marqueeApps.slice(half)} reverse />
      </div>
    </section>
  );
}

// --- How it works: three steps, each with a small live mock-up ---

function SubmitMock() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-[#ececee] bg-white px-3 py-2.5 text-xs text-[#3d3d4e] shadow-sm">
        <Link2 className="h-3.5 w-3.5 shrink-0 text-[#9e9ea7]" />
        <span className="caret truncate">apps.apple.com/app/ingredient-scanner</span>
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#ececee]">
        <img src="/graphic/icons/ingredient-scanner.webp" alt="" className="h-10 w-10 rounded-lg" loading="lazy" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Ingredient Scanner</p>
          <p className="text-xs text-[#6e6d7a]">AI · iOS · 6 screenshots</p>
        </div>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-3.5 w-3.5" /></span>
      </div>
    </div>
  );
}

function LaunchMock() {
  const rows = [
    { icon: "/graphic/icons/ingredient-scanner.webp", name: "Ingredient Scanner", votes: 412, me: true },
    { icon: "/graphic/icons/fieldstamp-gps-camera.webp", name: "FieldStamp", votes: 356 },
    { icon: "/graphic/icons/smart-currency-converter.webp", name: "Currency", votes: 241 },
  ];
  return (
    <ol className="grid gap-2">
      {rows.map((r, i) => (
        <li key={r.name} className={`flex items-center gap-3 rounded-xl p-2 ${r.me ? "bg-white shadow-sm ring-1 ring-[#ea4c89]/30" : ""}`}>
          <span className="w-4 text-center text-xs font-bold text-[#9e9ea7]">{i + 1}</span>
          <img src={r.icon} alt="" className="h-8 w-8 rounded-lg" loading="lazy" />
          <span className="flex-1 truncate text-sm font-medium">{r.name}</span>
          <span className={`flex items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-bold ${r.me ? "bg-[#ea4c89] text-white" : "bg-white text-[#3d3d4e] ring-1 ring-[#ececee]"}`}>
            <TrendingUp className="h-3 w-3" /> {r.votes}
          </span>
        </li>
      ))}
    </ol>
  );
}

function GrowMock() {
  const bars = [32, 44, 38, 56, 50, 68, 74, 88];
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-[#ececee]">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold text-[#6e6d7a]">Revenue · AdMob + RevenueCat</span>
        <span className="text-xs font-bold text-emerald-600">+38%</span>
      </div>
      <p className="mt-1 font-display text-2xl font-bold tracking-[-0.03em]">$4,280</p>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className="rise-bar flex-1 rounded-t-md bg-linear-to-t from-[#8b5cf6] to-[#ea4c89]"
            style={{ height: `${h}%`, animationDelay: `${i * 70}ms`, opacity: 0.45 + i * 0.07 }}
          />
        ))}
      </div>
    </div>
  );
}

const steps = [
  { icon: Link2, title: "Paste your store link", body: "We pull the name, icon, screenshots and category from the App Store or Google Play.", mock: SubmitMock },
  { icon: Rocket, title: "Launch and collect upvotes", body: "Your app goes live on launch day. Followers get an email, the community votes it up the chart.", mock: LaunchMock },
  { icon: BarChart3, title: "Grow with one plan", body: "Publishing, ASO, mail and a revenue dashboard keep the momentum after launch day.", mock: GrowMock },
];

function Step({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const reveal = useReveal<HTMLLIElement>(index * 120);
  const Mock = step.mock;
  return (
    <li ref={reveal.ref} className={`${reveal.className} flex flex-col rounded-3xl border border-[#ececee] bg-white p-6`} style={reveal.style}>
      <div className="flex h-[220px] flex-col justify-center rounded-2xl bg-linear-to-br from-[#f8f7f4] to-[#f3edff]/60 p-4">
        <Mock />
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#ea4c89]">
        <step.icon className="h-4 w-4" /> Step {index + 1}
      </p>
      <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
      <p className="mt-2 text-[15px] leading-7 text-[#6e6d7a]">{step.body}</p>
    </li>
  );
}

export function HowItWorks() {
  const heading = useReveal<HTMLDivElement>();
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div ref={heading.ref} className={`${heading.className} mx-auto max-w-2xl text-center`}>
          <p className="kicker">How it works</p>
          <h2 className="section-title mt-3">From store link to top of the chart</h2>
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => <Step key={step.title} step={step} index={i} />)}
        </ol>
      </div>
    </section>
  );
}

// --- Showcase: big store artwork, the most visual part of the page ---

// Order matters: wide cards span 2 of 3 columns, so rows read 2+1, 1+2, 1+1+1.
const showcase = [
  { name: "Ingredient Scanner", tagline: "Scan a label, see what's really inside", image: "/graphic/ingredient-scanner.webp", href: "/app/ingredient-scanner", wide: true },
  { name: "PetPal", tagline: "A virtual pet that grows with you", image: "/graphic/petpal.webp", href: "/app/petpal-pet-simulator" },
  { name: "FieldStamp GPS Camera", tagline: "Photos with time, place and notes", image: "/graphic/fieldstamp-camera.webp", href: "/app/fieldstamp-gps-camera" },
  { name: "Horror Chat Stories", tagline: "Scary stories as text messages", image: "/graphic/horror-chat-stories.webp", href: "/app/horror-chat-stories", wide: true },
  { name: "Tarot Destiny", tagline: "Daily readings with an AI guide", image: "/graphic/tarot-destiny.webp", href: "/app/tarot-destiny" },
  { name: "Coloring Book", tagline: "Relaxing coloring for all ages", image: "/graphic/coloring-book-paint-draw.webp", href: "/app/coloring-book-paint-and-draw" },
  { name: "ScanQR", tagline: "Fast QR and barcode scanner, no ads", image: "/graphic/scanqr.webp", href: "/app/scanqr" },
];

function ShowcaseCard({ item, index }: { item: (typeof showcase)[number]; index: number }) {
  const reveal = useReveal<HTMLLIElement>((index % 3) * 100);
  return (
    <li ref={reveal.ref} style={reveal.style} className={`${reveal.className} ${item.wide ? "md:col-span-2" : ""}`}>
      <a href={item.href} className="group relative block overflow-hidden rounded-3xl bg-[#0d0c22]">
        <img
          src={item.image}
          alt={`${item.name} store artwork`}
          loading="lazy"
          // Store artwork puts its headline on the left; keep that side when a narrow card crops.
          className={`aspect-[16/10] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] md:aspect-auto md:h-[320px] ${item.wide ? "object-center" : "object-left"}`}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#0d0c22] via-[#0d0c22]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
          <div>
            <p className="text-lg font-semibold drop-shadow-sm">{item.name}</p>
            <p className="text-sm text-white/80">{item.tagline}</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-white group-hover:text-[#0d0c22]">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </a>
    </li>
  );
}

export function Showcase() {
  const heading = useReveal<HTMLDivElement>();
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div ref={heading.ref} className={`${heading.className} flex flex-wrap items-end justify-between gap-4`}>
          <div>
            <p className="kicker">Featured launches</p>
            <h2 className="section-title mt-3">Made by makers like you</h2>
          </div>
          <a href="/rankings?period=month" className="flex items-center gap-1 text-sm font-semibold text-[#ea4c89]">
            Top apps this month <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {showcase.map((item, i) => <ShowcaseCard key={item.name} item={item} index={i} />)}
        </ul>
      </div>
    </section>
  );
}
