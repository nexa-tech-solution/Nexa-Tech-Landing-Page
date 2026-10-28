import type { GrowthServiceSlug } from "@/components/services/growth-services";

// One subscription covers every service. Prices in USD; limits are the
// launch proposal and should be tuned once real usage data exists.
export const TRIAL_DAYS = 7;

export type PlanId = "starter" | "pro";

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number; // billed once a year; 2 months free
  blurb: string;
  apps: string;
  highlighted?: boolean;
};

export const plans: Plan[] = [
  { id: "starter", name: "Starter", monthly: 15, yearly: 150, blurb: "Everything an indie app needs to launch and grow.", apps: "1 app" },
  { id: "pro", name: "Pro", monthly: 49, yearly: 490, blurb: "For studios with a portfolio, with done-for-you publishing.", apps: "Up to 5 apps", highlighted: true },
];

// `true` = included, `false` = not included, string = included with this limit.
export type Cell = boolean | string;
export type FeatureRow = { label: string; starter: Cell; pro: Cell };

export const planFeatures: Record<GrowthServiceSlug, FeatureRow[]> = {
  dashboard: [
    { label: "Apps", starter: "1", pro: "5" },
    { label: "Integrations", starter: "AdMob, Firebase + 1 store", pro: "All 5, multiple accounts" },
    { label: "Data sync", starter: "Daily", pro: "Daily" },
    { label: "History", starter: "90 days", pro: "Unlimited" },
    { label: "P&L and expense tracking", starter: false, pro: true },
    { label: "Revenue alerts and CSV export", starter: false, pro: true },
  ],
  "aso-seo": [
    { label: "Tracked keywords", starter: "50", pro: "500" },
    { label: "AI metadata drafts", starter: "20 / month", pro: "200 / month" },
    { label: "ASO audit and score", starter: true, pro: true },
    { label: "Competitor tracking", starter: false, pro: "Up to 10 rivals" },
    { label: "Localized markets", starter: "1", pro: "Up to 5" },
    { label: "Website SEO audit", starter: false, pro: "1 site" },
  ],
  mail: [
    { label: "Emails per month", starter: "5,000", pro: "25,000" },
    { label: "Sending domains", starter: "1", pro: "3" },
    { label: "Campaigns and transactional API", starter: true, pro: true },
    { label: "Automations", starter: false, pro: true },
    { label: "Support", starter: "Email", pro: "Priority + deliverability help" },
  ],
  publish: [
    { label: "Pre-submission checklist", starter: true, pro: true },
    { label: "Done-for-you submissions", starter: "Add-on, $29 each", pro: "1 / month included" },
    { label: "Stores", starter: "App Store or Google Play", pro: "Both" },
    { label: "Rejection handling", starter: "On paid submissions", pro: true },
  ],
};

// Pay-as-you-go extras so a plan never blocks you mid-month.
export const addOns = [
  { name: "Extra app publishing", price: "$29", unit: "per submission", body: "We prepare, submit and follow up on review for one app or update." },
  { name: "Extra emails", price: "$5", unit: "per 10,000", body: "Top up when a campaign needs more than your plan." },
  { name: "Extra app", price: "$5", unit: "per app / month", body: "Add apps to Pro beyond 5 without jumping to a custom plan." },
  { name: "Done-for-you ASO", price: "$199", unit: "per month", body: "Our team writes, ships and reviews your metadata every month." },
];

export const pricingFaq = [
  { question: "What do I get in the free trial?", answer: `Every Pro feature for ${TRIAL_DAYS} days, no card required. At the end you pick a plan, or your account stays read-only until you do.` },
  { question: "Can I change plans later?", answer: "Yes, upgrade or downgrade any time. Upgrades apply right away and are prorated; downgrades apply at the next billing date." },
  { question: "Why one plan for every service?", answer: "Most apps need all four sooner or later. One plan is cheaper than four tools, and your data (revenue, rankings, users) lives in one place." },
  { question: "How do I pay?", answer: "Card worldwide, or bank transfer and VietQR in Vietnam. Prices are in USD; Vietnamese invoices are available." },
  { question: "What happens if I hit a limit?", answer: "Nothing breaks. We email you, and you can add an add-on or upgrade. Emails pause only when the monthly quota is used up." },
  { question: "Do you offer refunds?", answer: "If something isn't working for you, email us within 14 days of a payment and we'll refund it." },
];
