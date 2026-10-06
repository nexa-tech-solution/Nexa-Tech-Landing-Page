import Seo from "@/components/seo/Seo";
import { socials } from "@/components/nexa/data";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { FlowScene, type SceneId } from "@/components/nexa/flow-scenes";
import { TechMarquee } from "@/components/nexa/tech-marquee";
import { useReveal } from "@/components/nexa/use-reveal";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AppWindow,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  Check,
  Clock,
  Cloud,
  Code2,
  CreditCard,
  Database,
  FileText,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  LifeBuoy,
  Mail,
  MessageSquare,
  Minus,
  MonitorPlay,
  MousePointerClick,
  Package,
  Plug,
  Plus,
  Presentation,
  Rocket,
  Send,
  Server,
  Share2,
  ShieldCheck,
  Smartphone,
  Store,
  User,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Download,
  Filter,
  Gauge,
  HardDrive,
  Heart,
  LineChart,
  Lock,
  MailOpen,
  Palette,
  Pencil,
  PenSquare,
  Quote,
  RefreshCw,
  Reply,
  ShieldAlert,
  ShoppingCart,
  ThumbsUp,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

type Node = { icon: LucideIcon; label: string; note?: string; scene?: SceneId; details?: string[] };

type Service = {
  icon: LucideIcon;
  title: string;
  tagline: string;
  // How data / users move through what we build, left to right.
  flow: Node[];
  deliverables: string[];
  // Leave undefined to show "Custom quote".
  price?: string;
};

const HOURLY_RATE = 10;

const services: Service[] = [
  {
    icon: LayoutTemplate,
    title: "Landing page",
    tagline: "Visitors in, leads out.",
    flow: [
      { icon: User, label: "Visitor", scene: "search", note: "A visitor finds you on Google or from an ad", details: ["SEO meta + sitemap", "Fast-loading for ad traffic"] },
      { icon: LayoutTemplate, label: "Landing page", scene: "landing", note: "A clear hero explains your offer in seconds", details: ["Custom or Figma design", "Mobile-first, 90+ Lighthouse"] },
      { icon: Quote, label: "Social proof", scene: "testimonials", note: "Reviews and logos build trust", details: ["Testimonials + ratings", "Client logos, case studies"] },
      { icon: MousePointerClick, label: "Contact form", scene: "form", note: "They leave their name and request", details: ["Validation + spam protection", "Zalo / Messenger buttons"] },
      { icon: Inbox, label: "Your inbox", scene: "inbox", note: "The lead lands in your inbox instantly", details: ["Email or Google Sheet", "Auto-reply to the visitor"] },
      { icon: LineChart, label: "Analytics", scene: "analytics", note: "You see where leads come from", details: ["Google Analytics 4", "Conversion + ad pixel tracking"] },
    ],
    deliverables: ["Custom or Figma design", "SEO + analytics", "Deployed"],
  },
  {
    icon: Share2,
    title: "SNS service",
    tagline: "Post once, reach every network.",
    flow: [
      { icon: AppWindow, label: "Your app", scene: "app-share", note: "Your app gets social features built in", details: ["Share buttons + deep links", "Works on web and mobile"] },
      { icon: KeyRound, label: "Social login", scene: "login", note: "Users sign in with one tap", details: ["Facebook, Google, TikTok", "Secure OAuth 2.0"] },
      { icon: PenSquare, label: "Compose", scene: "compose", note: "Write a post once, with media", details: ["Image + video upload", "Caption per network"] },
      { icon: CalendarClock, label: "Scheduler", scene: "calendar", note: "Posts are queued for the best time", details: ["Calendar view", "Timezone-aware queue"] },
      { icon: Share2, label: "Auto-publish", scene: "social", note: "Published to every network automatically", details: ["Facebook · Instagram · TikTok", "Retry on API errors"] },
      { icon: Heart, label: "Insights", scene: "insights", note: "Reach and engagement in one place", details: ["Likes, comments, shares", "Best-performing posts"] },
    ],
    deliverables: ["Social login + share", "Auto-posting", "Platform APIs"],
  },
  {
    icon: LayoutDashboard,
    title: "Admin dashboard",
    tagline: "All your numbers, one screen.",
    flow: [
      { icon: Database, label: "Your data", scene: "db", note: "Orders, users and sales from your system", details: ["Connect existing DB", "Or import from Excel"] },
      { icon: Server, label: "API", scene: "api", note: "A secure API collects and aggregates it", details: ["Fast aggregated queries", "Cached for speed"] },
      { icon: BarChart3, label: "Dashboard", scene: "dashboard", note: "Charts and KPIs update in real time", details: ["Revenue, orders, users", "Filter by date range"] },
      { icon: Pencil, label: "Manage", scene: "crud", note: "Edit records without touching code", details: ["Create, edit, delete", "Search + bulk actions"] },
      { icon: Users, label: "Your team", scene: "team", note: "Each role sees exactly what it needs", details: ["Roles + permissions", "Activity log"] },
      { icon: Download, label: "Export", scene: "export", note: "Reports out in one click", details: ["Excel / CSV / PDF", "Scheduled email reports"] },
    ],
    deliverables: ["Charts + reports", "Roles + permissions", "CRUD"],
  },
  {
    icon: Mail,
    title: "Mail service",
    tagline: "Email that lands in the inbox.",
    flow: [
      { icon: AppWindow, label: "Trigger", scene: "trigger", note: "Your app fires an email on events", details: ["Sign-up, order, reset password", "Queued, never blocks the app"] },
      { icon: FileText, label: "Template", scene: "template", note: "A branded template is filled with data", details: ["Responsive HTML email", "Dynamic content per user"] },
      { icon: Filter, label: "Audience", scene: "audience", note: "Campaigns go to the right segment", details: ["Segments + tags", "Unsubscribe handled"] },
      { icon: ShieldCheck, label: "SPF · DKIM", scene: "dns", note: "Domain auth keeps it out of spam", details: ["SPF, DKIM, DMARC setup", "Warm-up for new domains"] },
      { icon: Inbox, label: "Inbox", scene: "mail-inbox", note: "Delivered to the customer inbox", details: ["Primary tab, not spam", "Looks right in Gmail + Outlook"] },
      { icon: MailOpen, label: "Tracking", scene: "mail-stats", note: "See who opened and clicked", details: ["Open + click rates", "Bounce monitoring"] },
    ],
    deliverables: ["Email templates", "Campaigns", "Domain setup"],
  },
  {
    icon: Smartphone,
    title: "Mobile app",
    tagline: "One codebase, two stores.",
    flow: [
      { icon: Palette, label: "Design", scene: "design", note: "Screens designed and approved first", details: ["Figma UI + clickable prototype", "iOS + Android guidelines"] },
      { icon: Code2, label: "React Native", scene: "code", note: "One codebase for both platforms", details: ["Expo + TypeScript", "Weekly test builds"] },
      { icon: ShoppingCart, label: "IAP + ads", scene: "iap", note: "Your app starts earning", details: ["In-app purchases, subscriptions", "AdMob ads"] },
      { icon: Package, label: "Build", scene: "build", note: "Native builds for each store", details: ["iOS .ipa + Android .aab", "Push notifications"] },
      { icon: ShieldCheck, label: "Store review", scene: "review", note: "We handle Apple and Google review", details: ["Screenshots + listing", "Fix rejections for you"] },
      { icon: Store, label: "Live on stores", scene: "store", note: "Your app is live for download", details: ["App Store + Google Play", "OTA updates after launch"] },
    ],
    deliverables: ["Expo", "IAP + ads", "Store release"],
  },
  {
    icon: Code2,
    title: "Web app",
    tagline: "From MVP to production.",
    flow: [
      { icon: User, label: "User", scene: "search", note: "A user finds and opens your web app", details: ["SEO-ready with Next.js", "Custom domain"] },
      { icon: AppWindow, label: "Web app", scene: "landing", note: "Fast pages, built with React / Next.js", details: ["Responsive on every screen", "Loads in under 2s"] },
      { icon: UserPlus, label: "Sign up", scene: "signup", note: "They create an account in seconds", details: ["Email or Google login", "Verify email + reset password"] },
      { icon: CreditCard, label: "Payments", scene: "payment", note: "They pay securely", details: ["Stripe, VNPay, MoMo", "Subscriptions + invoices"] },
      { icon: Cloud, label: "Hosting", scene: "deploy", note: "Deployed and scaled on the cloud", details: ["SSL + CDN", "Auto-deploy on every update"] },
      { icon: Gauge, label: "Grow", scene: "analytics", note: "Track users and revenue as you grow", details: ["Analytics + error tracking", "Ready to add features"] },
    ],
    deliverables: ["React / Next.js", "Accounts + payments", "Domain"],
  },
  {
    icon: Cloud,
    title: "Backend and API",
    tagline: "The engine behind your app.",
    flow: [
      { icon: Smartphone, label: "Client", scene: "request", note: "Your app sends a request", details: ["Web, mobile or partner", "REST or GraphQL"] },
      { icon: Lock, label: "Auth", scene: "auth-token", note: "Every request is verified", details: ["JWT + refresh tokens", "Rate limiting"] },
      { icon: Server, label: "REST API", scene: "api", note: "The API validates and processes it", details: ["Node.js + TypeScript", "Docs with Swagger"] },
      { icon: Database, label: "Database", scene: "db", note: "Data is stored and queried safely", details: ["PostgreSQL / MongoDB", "Indexes + daily backups"] },
      { icon: Plug, label: "3rd-party", scene: "integrations", note: "Payments, maps, email… connected", details: ["Webhooks handled", "Retries on failure"] },
      { icon: Reply, label: "Response", scene: "response", note: "The app gets its data back fast", details: ["< 100ms typical", "Logged + monitored"] },
    ],
    deliverables: ["Node.js APIs", "DB design", "Integrations"],
  },
  {
    icon: Bot,
    title: "AI integration",
    tagline: "AI only where it helps.",
    flow: [
      { icon: MessageSquare, label: "User asks", scene: "chat-ask", note: "A user asks a question", details: ["Chat, voice or image", "In your app or website"] },
      { icon: AppWindow, label: "Your data", scene: "context", note: "Your app adds the right context", details: ["Search your docs (RAG)", "User + order info"] },
      { icon: Brain, label: "LLM", scene: "thinking", note: "The model reasons over your data", details: ["Claude, GPT or Gemini", "Prompt tuned for your case"] },
      { icon: Gauge, label: "Cost control", scene: "cost", note: "Every call is cached and capped", details: ["Caching + token limits", "Cheaper model when enough"] },
      { icon: Bot, label: "Smart answer", scene: "chat-answer", note: "A useful answer comes back", details: ["Streamed in real time", "Can take actions for the user"] },
      { icon: ThumbsUp, label: "Improve", scene: "feedback", note: "Feedback makes it better every week", details: ["Thumbs up / down", "Review bad answers"] },
    ],
    deliverables: ["Chat assistants", "Speech + image", "Cost control"],
  },
  {
    icon: LifeBuoy,
    title: "Maintenance",
    tagline: "Healthy after launch, every month.",
    flow: [
      { icon: Activity, label: "Monitor", scene: "uptime", note: "We watch uptime and errors 24/7", details: ["Uptime checks every minute", "Error tracking (Sentry)"] },
      { icon: ShieldAlert, label: "Detect issue", scene: "alert", note: "Problems are caught before users notice", details: ["Instant alerts", "Root cause found fast"] },
      { icon: Wrench, label: "Fix", scene: "fix", note: "Bugs fixed, tested and deployed", details: ["Hotfix within 24h", "Regression tests"] },
      { icon: RefreshCw, label: "Upgrade", scene: "upgrade", note: "Libraries and OS kept current", details: ["iOS / Android SDK updates", "Security patches"] },
      { icon: HardDrive, label: "Backup", scene: "backup", note: "Your data is backed up daily", details: ["Daily snapshots", "Tested restores"] },
      { icon: FileText, label: "Monthly report", scene: "report", note: "You get a clear monthly summary", details: ["Uptime, fixes, upgrades", "Next month's plan"] },
    ],
    deliverables: ["Bug fixes", "OS + lib upgrades", "Support plan"],
  },
];

const weeklyLoop: Node[] = [
  { icon: CalendarClock, label: "Plan", note: "We agree on this week's goals" },
  { icon: Code2, label: "Build", note: "Developers ship the work" },
  { icon: MonitorPlay, label: "Demo", note: "You see working progress" },
  { icon: Clock, label: "Time report", note: "Hours logged, billed by actual time" },
];

const steps: (Node & { when: string })[] = [
  { icon: Send, label: "Send brief", when: "Day 0" },
  { icon: FileText, label: "Quote", when: "≤ 48h" },
  { icon: Presentation, label: "Build + demos", when: "Weekly" },
  { icon: Rocket, label: "Launch + handover", when: "Ship" },
];

// Long enough to read the caption and watch the step scene play.
const STEP_MS = 3200;
// Pause on the fully-completed flow before looping / moving to the next tab.
const HOLD_MS = 2200;
// Line fills first, then the node it points to lights up.
const LINE_MS = 450;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

// step 0..count-1 = active node, step === count = whole flow done.
// After the hold, calls onLoop if given, otherwise replays. Restarts when resetKey changes.
function useStepper(
  count: number,
  { running, onLoop, resetKey }: { running: boolean; onLoop?: () => void; resetKey?: unknown },
) {
  const [step, setStep] = useState(0);
  useEffect(() => setStep(prefersReducedMotion() ? count : 0), [resetKey, count]);
  useEffect(() => {
    if (!running || prefersReducedMotion()) return;
    const id = window.setTimeout(
      () => {
        if (step < count) setStep(step + 1);
        else if (onLoop) onLoop();
        else setStep(0);
      },
      step < count ? STEP_MS : HOLD_MS,
    );
    return () => window.clearTimeout(id);
  }, [step, count, running, onLoop]);
  return [step, setStep] as const;
}

function FlowNode({
  icon: Icon,
  label,
  index,
  state,
  onSelect,
}: Node & { index: number; state: "done" | "active" | "idle"; onSelect?: () => void }) {
  // Delay lighting up until the incoming line has filled.
  const transition = {
    transitionTimingFunction: EASE,
    transitionDuration: "500ms",
    transitionDelay: state === "active" && index > 0 ? `${LINE_MS - 100}ms` : "0ms",
  };
  const Tag = onSelect ? "button" : "div";
  return (
    <Tag
      {...(onSelect && { type: "button" as const, onClick: onSelect, "aria-label": `Step ${index + 1}: ${label}` })}
      className={`group flex flex-col items-center gap-2 rounded-2xl text-center outline-none focus-visible:ring-2 focus-visible:ring-[#ea4c89] ${
        onSelect ? "cursor-pointer" : ""
      }`}
    >
      <span
        style={transition}
        className={`relative grid h-16 w-16 place-items-center rounded-2xl ring-1 transition-all ${
          onSelect && state !== "active" ? "group-hover:-translate-y-0.5 group-hover:ring-[#ea4c89]" : ""
        } ${
          state === "active"
            ? "scale-105 bg-[#ea4c89] text-white ring-[#ea4c89] shadow-[0_0_0_8px_rgba(234,76,137,0.12),0_12px_30px_rgba(234,76,137,0.3)]"
            : state === "done"
              ? "bg-[#fde2ee] text-[#ea4c89] ring-[#f6c3d8]"
              : "bg-white text-[#b9b8c2] ring-[#ececee]"
        }`}
      >
        <Icon className="h-7 w-7" />
        <span
          style={transition}
          className={`absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full font-mono text-[10px] font-bold ring-2 ring-white transition-colors ${
            state === "idle" ? "bg-[#ececee] text-[#9e9ea7]" : "bg-[#ea4c89] text-white"
          }`}
        >
          {state === "done" ? <Check className="h-3 w-3" /> : index + 1}
        </span>
      </span>
      <span
        style={transition}
        className={`max-w-[7.5rem] text-xs font-semibold transition-colors ${
          state === "idle" ? "text-[#9e9ea7]" : "text-[#0d0c22]"
        }`}
      >
        {label}
      </span>
    </Tag>
  );
}

// Presentational: lines fill toward the active node, a caption says what happens now.
// Vertical on phones, horizontal from md.
function Flow({
  nodes,
  step,
  doneNote,
  caption = true,
  onSelect,
}: {
  nodes: Node[];
  step: number;
  doneNote: string;
  caption?: boolean;
  onSelect?: (index: number) => void;
}) {
  const done = step >= nodes.length;
  return (
    <div>
      <div className="flex flex-col items-center gap-2 md:flex-row md:items-start md:justify-between md:gap-0">
        {nodes.map((node, index) => (
          <Fragment key={node.label}>
            {index > 0 && (
              <div className="relative h-8 w-0.5 shrink-0 overflow-hidden rounded-full bg-[#e4e3e8] md:mx-1 md:mt-8 md:h-0.5 md:w-auto md:flex-1">
                <span
                  className={`absolute inset-0 origin-top bg-[#ea4c89] transition-transform md:origin-left ${
                    index <= step ? "scale-100" : "scale-y-0 md:scale-x-0 md:scale-y-100"
                  }`}
                  style={{ transitionDuration: `${LINE_MS}ms`, transitionTimingFunction: EASE }}
                />
              </div>
            )}
            <FlowNode
              {...node}
              index={index}
              state={index < step ? "done" : index === step ? "active" : "idle"}
              onSelect={onSelect && (() => onSelect(index))}
            />
          </Fragment>
        ))}
      </div>
      {caption && (
      <p
        key={step}
        aria-live="polite"
        className="page-enter mt-8 flex min-h-[1.5rem] items-center justify-center gap-2 text-center text-sm text-[#3d3d4e]"
      >
        {done ? (
          <>
            <Check className="h-4 w-4 text-[#ea4c89]" />
            <span className="font-semibold">{doneNote}</span>
          </>
        ) : (
          <>
            <span className="font-mono text-xs font-semibold text-[#ea4c89]">
              {step + 1}/{nodes.length}
            </span>
            {nodes[step].note}
          </>
        )}
      </p>
      )}
    </div>
  );
}

function WeeklyLoop() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [step] = useStepper(weeklyLoop.length, { running: inView });
  return (
    <div ref={ref}>
      <Flow nodes={weeklyLoop} step={step} doneNote="Repeat next week" />
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#6e6d7a]">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - step))}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#fde2ee] text-[#ea4c89] transition hover:bg-[#fbcfe0] disabled:opacity-30"
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </button>
        <p className="w-20 text-center font-display text-2xl font-bold">
          {value}
          <span className="ml-1 text-sm font-semibold text-[#6e6d7a]">{unit}</span>
        </p>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + step))}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#fde2ee] text-[#ea4c89] transition hover:bg-[#fbcfe0] disabled:opacity-30"
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function HourlyCalculator() {
  const [devs, setDevs] = useState(1);
  const [hours, setHours] = useState(20);
  const [weeks, setWeeks] = useState(4);
  const total = devs * hours * weeks * HOURLY_RATE;

  return (
    <div className="grid gap-8 rounded-3xl bg-white p-6 ring-1 ring-[#f6d3e2] md:p-8">
      <div className="grid gap-4">
        <Stepper label="Developers" value={devs} min={1} max={5} unit="dev" onChange={setDevs} />
        <Stepper label="Hours / week" value={hours} min={5} max={40} step={5} unit="h" onChange={setHours} />
        <Stepper label="Duration" value={weeks} min={1} max={24} unit="wk" onChange={setWeeks} />
      </div>

      {/* One block per developer-week, so the size of the team is visible. */}
      <div className="flex flex-wrap gap-1.5" aria-hidden>
        {Array.from({ length: devs * weeks }, (_, i) => (
          <span
            key={i}
            className="h-3 rounded-sm bg-[#ea4c89] transition-all"
            style={{ width: `${8 + hours / 2}px`, opacity: 0.45 + ((i % weeks) / weeks) * 0.55 }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[#f6d3e2] pt-6">
        <div>
          <p className="font-mono text-xs text-[#6e6d7a]">
            {devs} × {hours}h × {weeks}wk × ${HOURLY_RATE}
          </p>
          <p className="mt-1 font-display text-5xl font-bold tracking-[-0.04em]">
            ${total.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-[#6e6d7a]">
            {(devs * hours * weeks).toLocaleString()} hours · estimate, billed by actual time
          </p>
        </div>
        <a
          href={`mailto:${socials.email}?subject=${encodeURIComponent(
            `Hire ${devs} developer(s), ${hours}h/week for ${weeks} weeks`,
          )}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#ea4c89] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d63d78]"
        >
          Book this team <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const service = services[active];
  const next = useCallback(
    () => setActive((current) => (current + 1) % services.length),
    [],
  );
  const Icon = service.icon;
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();
  // Manual navigation stops autoplay so the step doesn't move while reading.
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useStepper(service.flow.length, {
    running: inView && !hovered && playing,
    // Once the user picks a tab, keep replaying it instead of moving on.
    onLoop: paused ? undefined : next,
    resetKey: active,
  });
  const progress = Math.min(step / service.flow.length, 1);
  const current = service.flow[step];
  // Keep the last scene on screen during the "done" hold.
  const sceneNode = current ?? service.flow[service.flow.length - 1];
  const count = service.flow.length;

  const goTo = (index: number) => {
    setPlaying(false);
    setPaused(true);
    if (index > count) setActive((a) => (a + 1) % services.length);
    else if (index < 0) setActive((a) => (a - 1 + services.length) % services.length);
    else setStep(index);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="grid gap-4 lg:grid-cols-[280px_1fr]"
    >
      <div
        role="tablist"
        aria-label="Services"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {services.map(({ icon: TabIcon, title }, index) => (
          <button
            key={title}
            role="tab"
            type="button"
            aria-selected={index === active}
            onClick={() => {
              setActive(index);
              setPaused(true);
            }}
            className={`relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
              index === active
                ? "bg-[#ea4c89] text-white"
                : "bg-[#f8f7f4] text-[#3d3d4e] hover:bg-[#f0efec]"
            }`}
          >
            <TabIcon
              className={`h-4 w-4 ${index === active ? "text-white" : "text-[#ea4c89]"}`}
            />
            {title}
            {index === active && !paused && (
              <span
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-white/70 transition-transform duration-500"
                style={{ transform: `scaleX(${progress})`, transitionTimingFunction: EASE }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        key={service.title}
        role="tabpanel"
        className="page-enter flex flex-col rounded-3xl bg-[#f8f7f4] p-6 md:p-10"
      >
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fde2ee] text-[#ea4c89]">
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.02em]">
              {service.title}
            </h3>
            <p className="text-[15px] text-[#6e6d7a]">{service.tagline}</p>
          </div>
        </div>

        <div className="my-8 rounded-2xl border border-[#ececee] bg-white px-4 py-8 md:px-8">
          <Flow
            nodes={service.flow}
            step={step}
            doneNote={service.tagline}
            caption={false}
            onSelect={goTo}
          />

          {/* Stage: what happens at the active step, as a mini mockup. */}
          <div className="mt-8 grid items-center gap-6 rounded-2xl bg-[#f8f7f4] p-5 md:grid-cols-[0.9fr_1.1fr] md:p-6">
            <div key={`text-${step}`} aria-live="polite" className="page-enter">
              {current ? (
                <>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#ea4c89]">
                    Step {step + 1} of {service.flow.length}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.02em]">{current.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6e6d7a]">{current.note}</p>
                  {current.details && (
                    <ul className="mt-4 space-y-2">
                      {current.details.map((item, i) => (
                        <li
                          key={item}
                          className="scene-in flex items-center gap-2 text-sm font-medium text-[#3d3d4e]"
                          style={{ animationDelay: `${200 + i * 140}ms` }}
                        >
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#fde2ee] text-[#ea4c89]">
                            <Check className="h-3 w-3" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  <p className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#28a745]">
                    <Check className="h-3.5 w-3.5" /> Done
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.02em]">{service.tagline}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6e6d7a]">
                    {service.flow.map((node) => node.label).join(" → ")}
                  </p>
                </>
              )}
            </div>
            <div
              key={`scene-${active}-${Math.min(step, service.flow.length - 1)}`}
              className="h-[250px]"
              aria-hidden
            >
              {sceneNode?.scene && <FlowScene id={sceneNode.scene} />}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-[#3d3d4e] ring-1 ring-[#ececee] transition hover:ring-[#ea4c89] hover:text-[#ea4c89]"
            >
              <ChevronLeft className="h-4 w-4" />
              {step === 0 ? "Prev service" : "Prev"}
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden gap-1.5 sm:flex" aria-hidden>
                {Array.from({ length: count + 1 }, (_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === step ? "w-6 bg-[#ea4c89]" : i < step ? "w-1.5 bg-[#f6c3d8]" : "w-1.5 bg-[#e4e3e8]"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((p) => !p)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#fde2ee] text-[#ea4c89] transition hover:bg-[#fbcfe0]"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#ea4c89] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d63d78]"
            >
              {step >= count ? "Next service" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#3d3d4e] ring-1 ring-[#ececee]"
              >
                <Check className="h-3.5 w-3.5 text-[#ea4c89]" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold">{service.price ?? "Custom quote"}</p>
            <a
              href={`mailto:${socials.email}?subject=${encodeURIComponent(`Service: ${service.title}`)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#ea4c89] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d63d78]"
            >
              Request <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hero diagram: one idea, two paths. Each branch jumps to its section.
function DecisionTree() {
  const branches = [
    { href: "#hourly", icon: Clock, title: "Hire hourly", note: `$${HOURLY_RATE}/h · flexible scope` },
    { href: "#services", icon: Package, title: "Buy a package", note: "Clear scope · fixed quote" },
  ];
  return (
    <div className="relative rounded-3xl bg-[#f8f7f4] p-6 md:p-8">
      <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[#ea4c89] px-4 py-2 text-sm font-semibold text-white">
        <Brain className="h-4 w-4 text-white" /> Your idea
      </div>
      <div className="flow-line mx-auto h-8 w-0.5 md:h-8 md:w-0.5" style={{ backgroundImage: "linear-gradient(to bottom, #ea4c89 50%, transparent 50%)", backgroundSize: "2px 10px", animationName: "flow-v" }} />
      <p className="mx-auto w-fit rounded-xl bg-white px-4 py-2 text-center text-sm font-semibold ring-1 ring-[#ececee]">
        Scope clear yet?
      </p>
      <svg viewBox="0 0 200 40" className="mx-auto block h-10 w-3/5" preserveAspectRatio="none" aria-hidden>
        <path d="M100 0 V12 H25 V40 M100 12 H175 V40" fill="none" stroke="#ea4c89" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke">
          <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.8s" repeatCount="indefinite" />
        </path>
      </svg>
      <div className="grid grid-cols-2 gap-3">
        {branches.map(({ href, icon: Icon, title, note }, index) => (
          <a
            key={title}
            href={href}
            className="group rounded-2xl bg-white p-4 ring-1 ring-[#ececee] transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(13,12,34,0.08)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#9e9ea7]">
              {index === 0 ? "Not yet" : "Yes"}
            </p>
            <Icon className="mt-3 h-6 w-6 text-[#ea4c89]" />
            <p className="mt-2 flex items-center gap-1 font-semibold">
              {title}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </p>
            <p className="mt-1 text-xs text-[#6e6d7a]">{note}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function Pipeline() {
  const reveal = useReveal<HTMLOListElement>();
  return (
    <ol ref={reveal.ref} className={`relative mt-14 grid gap-10 md:grid-cols-4 md:gap-4 ${reveal.className}`}>
      {/* Track with a dot travelling from brief to launch. */}
      <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-[#ececee] md:block" aria-hidden>
        <span
          className="absolute -top-[5px] h-3 w-3 -translate-x-1/2 rounded-full bg-[#ea4c89] shadow-[0_0_0_6px_rgba(234,76,137,0.15)]"
          style={{ animation: "flow-travel 4s ease-in-out infinite" }}
        />
      </div>
      {steps.map(({ icon: Icon, label, when }, index) => (
        <li key={label} className="relative flex flex-col items-center text-center">
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#fde2ee] text-[#ea4c89] ring-8 ring-white">
            <Icon className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#ea4c89] text-white font-mono text-[10px] font-bold">
              {index + 1}
            </span>
          </span>
          <p className="mt-4 font-semibold">{label}</p>
          <span className="mt-2 rounded-full bg-[#fde2ee] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#ea4c89]">
            {when}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function Services() {
  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo
        title="Services | Nexa Tech"
        description="Hire Nexa Tech developers from $10/hour, or order a service: landing page, SNS integration, admin dashboard, mail service, mobile and web apps."
        path="/services"
      />

      <SiteHeader />

      <main>
        <section className="px-5 md:px-10">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 pb-16 pt-12 md:pt-16 lg:grid-cols-[1.1fr_1fr]">
            <header>
              <span className="inline-flex rounded-full bg-[#fde2ee] px-3 py-1 text-xs font-semibold text-[#ea4c89]">
                Work with us
              </span>
              <h1 className="mt-4 font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                Hire a developer.
                <br />
                Or buy a ready service.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#3d3d4e] md:text-lg md:leading-8">
                Two ways in. Pick the path that fits where your idea is today.
              </p>
            </header>
            <DecisionTree />
          </div>
        </section>

        <section className="px-5 md:px-10">
          <div
            id="hourly"
            className="mx-auto grid max-w-[1200px] scroll-mt-24 gap-10 rounded-3xl bg-[#fff1f6] p-7 md:p-12 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div className="flex flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fde2ee] px-3 py-1 text-xs font-semibold text-[#ea4c89]">
                <Clock className="h-3.5 w-3.5" /> Hire by the hour
              </span>
              <p className="mt-6 font-display text-6xl font-bold tracking-[-0.04em]">
                ${HOURLY_RATE}
                <span className="text-2xl font-semibold text-[#6e6d7a]"> / h / dev</span>
              </p>
              <p className="mt-10 font-mono text-[11px] uppercase tracking-widest text-[#6e6d7a]">
                Every week
              </p>
              <div className="mt-5">
                <WeeklyLoop />
              </div>
            </div>
            <HourlyCalculator />
          </div>
        </section>

        <section className="px-5 md:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div id="services" className="scroll-mt-24 pb-10 pt-24">
              <p className="kicker">Service packages</p>
              <h2 className="section-title mt-3">See how each one works</h2>
            </div>
            <ServiceExplorer />
          </div>
        </section>

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-[1200px]">
            <p className="kicker">How we work</p>
            <h2 className="section-title mt-3">Brief to launch</h2>
            <Pipeline />
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-5 text-center md:px-10">
            <p className="kicker">Our stack</p>
            <h2 className="section-title mt-3">Proven tools, no experiments</h2>
          </div>
          <TechMarquee />
        </section>

        <section id="contact" className="px-5 pb-24 md:px-10">
          <div className="mx-auto max-w-[1200px] rounded-3xl bg-[#fff1f6] px-7 py-14 text-center md:py-20">
            <h2 className="section-title">Have a project in mind?</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#6e6d7a]">
              Tell us what you want to build, or how many developer hours you
              need. We reply to every message by email.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${socials.email}?subject=${encodeURIComponent("Project inquiry")}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#ea4c89] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d63d78]"
              >
                <Mail className="h-4 w-4" />
                {socials.email}
              </a>
              <a
                href="/#contact"
                className="text-sm font-semibold text-[#3d3d4e] underline-offset-4 hover:text-[#ea4c89] hover:underline"
              >
                Or use the contact form
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
