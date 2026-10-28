import { TRIAL_DAYS } from "@/components/pricing/plans";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  FileSearch,
  Globe,
  Inbox,
  KeyRound,
  Languages,
  LayoutDashboard,
  ListChecks,
  Mail,
  PenLine,
  PlugZap,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Swords,
  TrendingUp,
  UploadCloud,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type GrowthServiceSlug = "publish" | "aso-seo" | "mail" | "dashboard";

type Feature = { icon: LucideIcon; title: string; body: string };
export type GrowthService = {
  slug: GrowthServiceSlug;
  name: string; // short label for nav and cards
  kicker: string;
  title: string; // h1
  tagline: string;
  description: string; // meta description
  icon: LucideIcon;
  gradient: string; // Tailwind from-/to- pair for the one bold hero tile
  tint: string; // soft background + icon colour for list and card icons
  // Done-for-you services start with a call; self-serve products start in the app.
  kind: "managed" | "product";
  highlights: { value: string; label: string }[]; // facts about the offer, not results claims
  features: Feature[];
  steps: { title: string; body: string }[];
  faq: { question: string; answer: string }[];
};

// Pricing is one bundle for all services; see components/pricing/plans.ts.
const trialHighlight = { value: `${TRIAL_DAYS} days`, label: "free trial, every service included" };

export const growthServices: GrowthService[] = [
  {
    slug: "publish",
    name: "App Publishing",
    kicker: "App Publishing",
    title: "Get your app live on the App Store and Google Play",
    tagline: "We prepare, submit and follow up on store review, so you can keep building.",
    description: "App publishing service for iOS and Android: store listing setup, build upload, privacy forms, review submission and rejection fixes on the App Store and Google Play.",
    icon: Rocket,
    gradient: "from-[#ea4c89] to-[#f97316]",
    tint: "bg-pink-50 text-pink-600",
    kind: "managed",
    highlights: [
      trialHighlight,
      { value: "2 stores", label: "App Store and Google Play" },
      { value: "End to end", label: "from listing setup to approval" },
    ],
    features: [
      { icon: ClipboardCheck, title: "Pre-submission check", body: "We review your build and listing against Apple and Google guidelines before anything is sent." },
      { icon: PenLine, title: "Store listing setup", body: "Name, description, keywords, category, age rating and support links filled in properly." },
      { icon: Smartphone, title: "Screenshots and assets", body: "Screenshots, icon and feature graphic sized for every required device." },
      { icon: ShieldCheck, title: "Privacy and compliance", body: "App Privacy labels, Data safety form, privacy policy and account-deletion requirements." },
      { icon: UploadCloud, title: "Build upload and submission", body: "TestFlight and Play Console tracks set up, builds uploaded, review submitted." },
      { icon: Bell, title: "Rejection handling", body: "If a store rejects the app, we read the reason, fix the listing or tell you exactly what to change in code." },
    ],
    steps: [
      { title: "Share access", body: "Invite us to App Store Connect or Play Console with a limited role. We never need your owner login." },
      { title: "Prepare", body: "We check the build and complete the listing, assets and compliance forms." },
      { title: "Submit", body: "We send it for review and track it daily." },
      { title: "Go live", body: "Approved apps are released on your schedule. Rejections are handled until it passes." },
    ],
    faq: [
      { question: "Do I need my own developer account?", answer: "Yes. Apps are published under your Apple Developer and Google Play Console accounts so you keep full ownership. We help you set them up if needed." },
      { question: "Can you guarantee approval?", answer: "No one can, because the stores decide. We fix every listing issue they raise, and tell you clearly when a rejection needs a code change." },
      { question: "How long does review take?", answer: "Apple usually reviews within 1–2 days and Google within a few days for new accounts. We submit as soon as everything is ready." },
      { question: "What counts as one published app?", answer: "One new app or one version update going through store review." },
    ],
  },
  {
    slug: "aso-seo",
    name: "SEO / ASO",
    kicker: "SEO & ASO Optimization",
    title: "Rank higher in the stores and on Google",
    tagline: "Keyword research, store metadata and website SEO for your app, with AI drafts and human review.",
    description: "ASO and SEO for mobile apps: keyword research, App Store and Google Play metadata, keyword tracking, competitor analysis and landing page SEO.",
    icon: Search,
    gradient: "from-[#8b5cf6] to-[#3b82f6]",
    tint: "bg-violet-50 text-violet-600",
    kind: "managed",
    highlights: [
      trialHighlight,
      { value: "Stores + web", label: "ASO and SEO in one plan" },
      { value: "30+", label: "languages for localized keywords" },
    ],
    features: [
      { icon: KeyRound, title: "Keyword research", body: "Volume, difficulty and relevance for every market you ship to." },
      { icon: PenLine, title: "Store metadata", body: "Title, subtitle, keyword field and description written for ranking and for people. AI drafts, reviewed by us." },
      { icon: TrendingUp, title: "Keyword tracking", body: "Daily positions for your keywords on the App Store and Google Play." },
      { icon: Swords, title: "Competitor analysis", body: "Which keywords rivals rank for, and where they're weak." },
      { icon: Globe, title: "Website SEO", body: "Technical fixes, structured data and content for your app's landing page." },
      { icon: Languages, title: "Localization", body: "Keywords and copy adapted per country, including Vietnamese, Japanese and Korean." },
    ],
    steps: [
      { title: "Audit", body: "We score your store listing and website and map keyword opportunities." },
      { title: "Plan", body: "A prioritized keyword plan per market, agreed with you first." },
      { title: "Optimize", body: "New metadata and page fixes go live." },
      { title: "Track", body: "Rankings are tracked daily, with a monthly review of what to change next." },
    ],
    faq: [
      { question: "How soon will I see results?", answer: "Keyword movement usually shows within 2–4 weeks of a metadata update. Install lift follows as rankings settle." },
      { question: "Do you need access to my developer account?", answer: "Only to publish metadata changes, with an App Manager role. Otherwise we send you the copy to paste in." },
      { question: "Can you guarantee a #1 ranking?", answer: "No one honestly can. We commit to the work and to transparent reporting, and you can cancel any month." },
      { question: "Is the copy written by AI?", answer: "AI writes first drafts within each store's rules and limits; we review and edit everything before you see it." },
    ],
  },
  {
    slug: "mail",
    name: "Mail Management",
    kicker: "Mail Management Support",
    title: "Email your users from your own domain, without the setup pain",
    tagline: "Domain setup, campaigns, automations and transactional email, with our team on hand when you need help.",
    description: "Email management for app makers: SPF, DKIM and DMARC setup, campaigns, onboarding automations and transactional email from your own domain, with hands-on support.",
    icon: Mail,
    gradient: "from-[#f59e0b] to-[#ef4444]",
    tint: "bg-amber-50 text-amber-600",
    kind: "product",
    highlights: [
      trialHighlight,
      { value: "Your domain", label: "SPF, DKIM and DMARC set up with you" },
      { value: "1 API", label: "for campaigns and transactional email" },
    ],
    features: [
      { icon: ShieldCheck, title: "Domain setup", body: "We generate the DNS records and check them with you until they pass." },
      { icon: Mail, title: "Campaigns", body: "Newsletters and launch announcements with templates and a simple editor." },
      { icon: Workflow, title: "Automations", body: "Onboarding, win-back and trial-ending flows triggered by user events." },
      { icon: Inbox, title: "Transactional email", body: "Receipts, password resets and alerts through one API." },
      { icon: ListChecks, title: "Contacts and segments", body: "Import users, tag them, and send to exactly the right group." },
      { icon: BarChart3, title: "Analytics", body: "Opens, clicks, bounces and unsubscribes per campaign." },
    ],
    steps: [
      { title: "Verify your domain", body: "Add the DNS records we generate; we check them with you." },
      { title: "Import contacts", body: "CSV upload, API, or sync from your app's sign-ups." },
      { title: "Send", body: "Launch a campaign or switch on an automated flow." },
      { title: "Get support", body: "Stuck on deliverability or a template? Message us." },
    ],
    faq: [
      { question: "Do I need my own domain?", answer: "Yes. Sending from your own verified domain is what keeps you out of spam folders." },
      { question: "What happens if I go over my limit?", answer: "Sending pauses and we let you know; nothing is charged without your OK." },
      { question: "Is it compliant with anti-spam rules?", answer: "Every marketing email carries an unsubscribe link, and bounced or complaining addresses are removed automatically." },
      { question: "What does “support” include?", answer: "Help with domain setup, deliverability problems and templates. Pro gets faster replies." },
    ],
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    kicker: "Revenue Dashboard",
    title: "All your app revenue in one dashboard",
    tagline: "AdMob, Firebase, RevenueCat, App Store Connect and Google Play, synced daily into one view.",
    description: "Revenue dashboard for mobile apps: connect AdMob, Firebase, RevenueCat, App Store Connect and Google Play to see ad earnings, subscriptions, installs and P&L together.",
    icon: LayoutDashboard,
    gradient: "from-[#10b981] to-[#0d9488]",
    tint: "bg-emerald-50 text-emerald-600",
    kind: "product",
    highlights: [
      trialHighlight,
      { value: "5", label: "integrations: AdMob, Firebase, RevenueCat, ASC, Play" },
      { value: "Daily", label: "automatic sync" },
    ],
    features: [
      { icon: PlugZap, title: "Integrations", body: "AdMob, Firebase, RevenueCat, App Store Connect and Google Play, with multiple accounts per provider." },
      { icon: BarChart3, title: "Ad revenue", body: "AdMob earnings, eCPM and fill rate per app and ad unit." },
      { icon: Wallet, title: "Subscriptions and P&L", body: "Subscriptions and in-app purchases against your expenses." },
      { icon: TrendingUp, title: "Installs and users", body: "Downloads and active users per app, country and store." },
      { icon: ShieldCheck, title: "Verified badge", body: "Connected apps get the Verified metrics badge on Nexa Rankings." },
      { icon: Bell, title: "Alerts", body: "Get told when revenue drops or spikes." },
    ],
    steps: [
      { title: "Sign in", body: "Continue with Google and start the 7-day trial." },
      { title: "Connect", body: "Add read-only API keys. Secrets are encrypted and never shown again." },
      { title: "Sync", body: "We import history and refresh every day." },
      { title: "Decide", body: "See what earns, what costs, and where to grow." },
    ],
    faq: [
      { question: "Is it safe to give you API keys?", answer: "We ask for read-only keys, encrypt them at rest, and never return them in any response. You can revoke them any time." },
      { question: "Which sources are supported?", answer: "AdMob, Firebase, RevenueCat, App Store Connect and Google Play today." },
      { question: "How fresh is the data?", answer: "Synced daily. The stores and ad networks themselves report with a delay of up to 1–2 days." },
      { question: "What is the Verified badge?", answer: "Apps with a connected store account show a Verified metrics badge on Nexa Rankings, because their numbers come straight from the source." },
    ],
  },
];

export const getGrowthService = (slug: string | undefined) => growthServices.find((s) => s.slug === slug);
