// Mini illustrated mockups shown for the active step of a service workflow.
// Pure markup + Tailwind so they stay crisp, on-brand and weightless.
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Apple,
  BarChart3,
  Bell,
  Bot,
  Check,
  CreditCard,
  Lock,
  Search,
  Send,
  Sparkles,
  Star,
  Download,
  HardDrive,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  ThumbsUp,
} from "lucide-react";

export type SceneId =
  | "search"
  | "landing"
  | "form"
  | "inbox"
  | "app-share"
  | "login"
  | "calendar"
  | "social"
  | "db"
  | "api"
  | "dashboard"
  | "team"
  | "trigger"
  | "template"
  | "dns"
  | "code"
  | "build"
  | "review"
  | "store"
  | "payment"
  | "deploy"
  | "request"
  | "integrations"
  | "chat-ask"
  | "context"
  | "thinking"
  | "chat-answer"
  | "uptime"
  | "alert"
  | "fix"
  | "report"
  | "testimonials"
  | "analytics"
  | "compose"
  | "insights"
  | "crud"
  | "export"
  | "audience"
  | "mail-inbox"
  | "mail-stats"
  | "design"
  | "iap"
  | "signup"
  | "auth-token"
  | "response"
  | "cost"
  | "feedback"
  | "upgrade"
  | "backup";

// Staggered entrance for the parts of a scene.
const d = (i: number): CSSProperties => ({ animationDelay: `${i * 140}ms` });
const IN = "scene-in";

function Bar({ w, className = "bg-[#ececee]" }: { w: string; className?: string }) {
  return <span className={`block h-2 rounded-full ${className}`} style={{ width: w }} />;
}

function Browser({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-[#ececee] shadow-[0_12px_30px_rgba(13,12,34,0.06)]">
      <div className="flex items-center gap-1.5 border-b border-[#ececee] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex-1 truncate rounded-md bg-[#f8f7f4] px-2 py-0.5 font-mono text-[10px] text-[#6e6d7a]">
          {url}
        </span>
      </div>
      <div className="relative flex-1 p-4">{children}</div>
    </div>
  );
}

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-full w-[150px] flex-col overflow-hidden rounded-[22px] bg-white p-2 ring-4 ring-[#0d0c22]">
      <span className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#0d0c22]" />
      <div className="relative flex-1 space-y-2 px-1">{children}</div>
    </div>
  );
}

function Terminal({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="h-full overflow-hidden rounded-xl bg-[#0d0c22] p-4 font-mono text-[11px] leading-6 text-[#d7d6e0]">
      {lines.map((line, i) => (
        <div key={i} className={IN} style={d(i)}>
          {line}
        </div>
      ))}
    </div>
  );
}

const pink = "text-[#ea4c89]";

function Stars() {
  return (
    <span className="flex text-[#febc2e]">
      {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}
    </span>
  );
}
const ok = "text-[#28c840]";

function Cursor({ className }: { className: string }) {
  return (
    <span className={`scene-click absolute grid h-6 w-6 place-items-center ${className}`}>
      <span className="absolute h-6 w-6 rounded-full bg-[#ea4c89]/30" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#ea4c89]" />
    </span>
  );
}

const scenes: Record<SceneId, () => ReactNode> = {
  search: () => (
    <Browser url="google.com/search?q=your+service">
      <div className={`${IN} flex items-center gap-2 rounded-full px-3 py-1.5 ring-1 ring-[#ececee]`} style={d(0)}>
        <Search className="h-3.5 w-3.5 text-[#9e9ea7]" />
        <span className="text-[11px]">best service near me</span>
      </div>
      <div className="mt-3 space-y-2.5">
        <div className={`${IN} relative rounded-lg bg-[#fff1f6] p-2 ring-1 ring-[#f6c3d8]`} style={d(1)}>
          <p className={`text-[11px] font-semibold ${pink}`}>Your Brand — Fast, trusted service</p>
          <Bar w="80%" className="mt-1.5 bg-[#f6c3d8]" />
          <Cursor className="-right-1 -top-2" />
        </div>
        {[2, 3].map((i) => (
          <div key={i} className={IN} style={d(i)}>
            <Bar w="45%" className="bg-[#c9c8d3]" />
            <Bar w="85%" className="mt-1.5" />
          </div>
        ))}
      </div>
    </Browser>
  ),
  landing: () => (
    <Browser url="yourbrand.com">
      <div className="grid h-full grid-cols-[1.2fr_1fr] items-center gap-3">
        <div className="space-y-2">
          <p className={`${IN} text-sm font-bold leading-tight`} style={d(0)}>
            Grow faster with <span className={pink}>Your Brand</span>
          </p>
          <div className={IN} style={d(1)}>
            <Bar w="90%" />
            <Bar w="70%" className="mt-1.5 bg-[#ececee]" />
          </div>
          <span className={`${IN} inline-block rounded-full bg-[#ea4c89] px-3 py-1 text-[10px] font-semibold text-white`} style={d(2)}>
            Get a quote
          </span>
        </div>
        <div className={`${IN} h-full min-h-[90px] rounded-lg bg-gradient-to-br from-[#fde2ee] to-[#f6c3d8]`} style={d(3)} />
      </div>
    </Browser>
  ),
  form: () => (
    <Browser url="yourbrand.com/#contact">
      <p className={`${IN} text-xs font-semibold`} style={d(0)}>Get in touch</p>
      <div className="mt-3 space-y-2">
        {["Anna Nguyen", "anna@company.com", "I need a quote for…"].map((value, i) => (
          <div key={value} className={`${IN} rounded-md px-2 py-1.5 text-[10px] ring-1 ring-[#ececee]`} style={d(i + 1)}>
            {value}
          </div>
        ))}
        <span className={`${IN} relative inline-flex items-center gap-1 rounded-full bg-[#ea4c89] px-3 py-1 text-[10px] font-semibold text-white`} style={d(4)}>
          <Send className="h-3 w-3" /> Send
          <Cursor className="-bottom-3 -right-3" />
        </span>
      </div>
    </Browser>
  ),
  inbox: () => (
    <Browser url="mail.google.com/inbox">
      <div className="space-y-1.5">
        <div className={`${IN} flex items-center gap-2 rounded-lg bg-[#fff1f6] p-2 ring-1 ring-[#f6c3d8]`} style={d(0)}>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ea4c89] text-[10px] font-bold text-white">A</span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold">New lead: Anna Nguyen</p>
            <p className="truncate text-[10px] text-[#6e6d7a]">I need a quote for…</p>
          </div>
          <span className="rounded-full bg-[#ea4c89] px-1.5 text-[9px] font-bold text-white">NEW</span>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${IN} flex items-center gap-2 p-2 opacity-60`} style={d(i)}>
            <span className="h-6 w-6 rounded-full bg-[#ececee]" />
            <div className="flex-1">
              <Bar w="40%" className="bg-[#c9c8d3]" />
              <Bar w="75%" className="mt-1.5" />
            </div>
          </div>
        ))}
      </div>
    </Browser>
  ),
  "app-share": () => (
    <Phone>
      <div className={`${IN} h-16 rounded-lg bg-gradient-to-br from-[#fde2ee] to-[#f6c3d8]`} style={d(0)} />
      <div className={IN} style={d(1)}>
        <Bar w="80%" className="bg-[#c9c8d3]" />
        <Bar w="60%" className="mt-1.5" />
      </div>
      <span className={`${IN} relative block rounded-full bg-[#ea4c89] py-1 text-center text-[10px] font-semibold text-white`} style={d(2)}>
        Share
        <Cursor className="-right-2 -top-2" />
      </span>
    </Phone>
  ),
  login: () => (
    <Phone>
      <p className={`${IN} pt-2 text-center text-[11px] font-bold`} style={d(0)}>Sign in</p>
      {[
        ["Continue with Facebook", "bg-[#1877f2] text-white"],
        ["Continue with Google", "bg-white ring-1 ring-[#ececee]"],
        ["Continue with TikTok", "bg-[#0d0c22] text-white"],
      ].map(([label, cls], i) => (
        <span key={label} className={`${IN} block rounded-full py-1.5 text-center text-[9px] font-semibold ${cls}`} style={d(i + 1)}>
          {label}
        </span>
      ))}
    </Phone>
  ),
  calendar: () => (
    <Browser url="app/scheduler">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }, (_, i) => {
          const post = [3, 8, 12, 17].indexOf(i);
          return (
            <span
              key={i}
              className={`${IN} grid h-7 place-items-center rounded text-[9px] ${
                post >= 0 ? "bg-[#ea4c89] font-bold text-white" : "bg-[#f8f7f4] text-[#9e9ea7]"
              }`}
              style={d(post >= 0 ? post + 1 : 0)}
            >
              {post >= 0 ? ["FB", "IG", "TT", "FB"][post] : i + 1}
            </span>
          );
        })}
      </div>
      <p className={`${IN} mt-3 text-[10px] text-[#6e6d7a]`} style={d(5)}>
        4 posts queued · next at <b className="text-[#0d0c22]">09:00</b>
      </p>
    </Browser>
  ),
  social: () => (
    <div className="grid h-full grid-cols-3 items-center gap-3">
      {[
        ["Facebook", "#1877f2"],
        ["Instagram", "#e1306c"],
        ["TikTok", "#0d0c22"],
      ].map(([name, color], i) => (
        <div key={name} className={`${IN} rounded-xl bg-white p-2 ring-1 ring-[#ececee]`} style={d(i)}>
          <p className="text-[10px] font-bold" style={{ color }}>{name}</p>
          <div className="mt-2 h-14 rounded-md bg-gradient-to-br from-[#fde2ee] to-[#f6c3d8]" />
          <p className={`mt-2 flex items-center gap-1 text-[9px] font-semibold ${ok}`}>
            <Check className="h-3 w-3" /> Posted
          </p>
        </div>
      ))}
    </div>
  ),
  db: () => (
    <Browser url="database · orders">
      <table className="w-full text-left text-[10px]">
        <thead className="text-[#9e9ea7]">
          <tr><th className="pb-1">id</th><th>customer</th><th>total</th><th>status</th></tr>
        </thead>
        <tbody>
          {[
            ["1042", "Anna", "$120", "paid"],
            ["1043", "Minh", "$86", "paid"],
            ["1044", "Lan", "$240", "pending"],
            ["1045", "Huy", "$54", "paid"],
          ].map((row, i) => (
            <tr key={row[0]} className={`${IN} border-t border-[#ececee]`} style={d(i)}>
              {row.map((cell, j) => (
                <td key={j} className={`py-1 ${j === 3 && cell === "paid" ? ok : ""}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Browser>
  ),
  api: () => (
    <Terminal
      lines={[
        <><span className={pink}>GET</span> /api/orders?month=10</>,
        <span className={ok}>200 OK · 38ms</span>,
        "{",
        <>&nbsp;&nbsp;"revenue": <span className={pink}>12480</span>,</>,
        <>&nbsp;&nbsp;"orders": <span className={pink}>312</span>,</>,
        "}",
      ]}
    />
  ),
  dashboard: () => (
    <Browser url="admin.yourbrand.com">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Revenue", "$12.4k"],
          ["Orders", "312"],
          ["Users", "1.9k"],
        ].map(([k, v], i) => (
          <div key={k} className={`${IN} rounded-lg bg-[#f8f7f4] p-2`} style={d(i)}>
            <p className="text-[9px] text-[#6e6d7a]">{k}</p>
            <p className="text-sm font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-20 items-end gap-1.5">
        {[40, 55, 35, 70, 60, 85, 95].map((h, i) => (
          <span key={i} className="scene-grow flex-1 origin-bottom rounded-t bg-[#ea4c89]" style={{ height: `${h}%`, opacity: 0.4 + i * 0.1, ...d(i + 2) }} />
        ))}
      </div>
    </Browser>
  ),
  team: () => (
    <div className="flex h-full flex-col justify-center gap-2">
      {[
        ["CEO", "Sees revenue + reports"],
        ["Sales", "Manages orders + customers"],
        ["Support", "Handles tickets only"],
      ].map(([role, can], i) => (
        <div key={role} className={`${IN} flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-[#ececee]`} style={d(i)}>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fde2ee] text-xs font-bold text-[#ea4c89]">{role[0]}</span>
          <div>
            <p className="text-xs font-semibold">{role}</p>
            <p className="text-[10px] text-[#6e6d7a]">{can}</p>
          </div>
          <Lock className="ml-auto h-3.5 w-3.5 text-[#9e9ea7]" />
        </div>
      ))}
    </div>
  ),
  trigger: () => (
    <Terminal
      lines={[
        <span className="text-[#9e9ea7]">// customer places an order</span>,
        <><span className={pink}>on</span>("order.created", order =&gt; </>,
        <>&nbsp;&nbsp;mail.send(<span className={ok}>"receipt"</span>, order.email)</>,
        ")",
        <span className={ok}>→ queued email to anna@company.com</span>,
      ]}
    />
  ),
  template: () => (
    <Browser url="email preview">
      <div className="mx-auto max-w-[220px] space-y-2 text-center">
        <p className={`${IN} text-xs font-bold ${pink}`} style={d(0)}>Your Brand</p>
        <p className={`${IN} text-sm font-bold`} style={d(1)}>Thanks for your order, Anna!</p>
        <div className={`${IN} rounded-lg bg-[#f8f7f4] p-2 text-left text-[10px]`} style={d(2)}>
          Order #1042 · <b>$120</b>
        </div>
        <span className={`${IN} inline-block rounded-full bg-[#ea4c89] px-3 py-1 text-[10px] font-semibold text-white`} style={d(3)}>
          Track order
        </span>
      </div>
    </Browser>
  ),
  dns: () => (
    <div className="flex h-full flex-col justify-center gap-2">
      {["SPF", "DKIM", "DMARC"].map((rec, i) => (
        <div key={rec} className={`${IN} flex items-center gap-3 rounded-xl bg-white p-3 font-mono text-[11px] ring-1 ring-[#ececee]`} style={d(i)}>
          <b className="w-12">{rec}</b>
          <span className="flex-1 truncate text-[#6e6d7a]">v={rec.toLowerCase()}1 … yourbrand.com</span>
          <span className={`flex items-center gap-1 font-sans font-semibold ${ok}`}><Check className="h-3.5 w-3.5" /> Pass</span>
        </div>
      ))}
      <p className={`${IN} text-center text-[11px] text-[#6e6d7a]`} style={d(3)}>Spam score: <b className={ok}>0 / 10</b></p>
    </div>
  ),
  code: () => (
    <Terminal
      lines={[
        <><span className={pink}>export default function</span> App() {"{"}</>,
        <>&nbsp;&nbsp;<span className={pink}>return</span> &lt;HomeScreen /&gt;</>,
        "}",
        <span className="text-[#9e9ea7]">// one codebase →</span>,
        <span className={ok}>✓ iOS &nbsp;✓ Android</span>,
      ]}
    />
  ),
  build: () => (
    <div className="flex h-full flex-col justify-center gap-4">
      {[
        ["iOS", Apple],
        ["Android", Bot],
      ].map(([name, Icon], i) => {
        const I = Icon as typeof Apple;
        return (
          <div key={name as string} className={IN} style={d(i)}>
            <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold"><I className="h-4 w-4" /> {name as string} build</p>
            <div className="h-2 overflow-hidden rounded-full bg-[#ececee]">
              <span className="scene-fill block h-full origin-left rounded-full bg-[#ea4c89]" style={d(i + 1)} />
            </div>
          </div>
        );
      })}
      <p className={`${IN} text-[11px] text-[#6e6d7a]`} style={d(4)}>app-release.ipa · app-release.aab</p>
    </div>
  ),
  review: () => (
    <div className="flex h-full flex-col justify-center gap-2">
      {["Screenshots + metadata", "Privacy policy", "Guideline check", "Approved by Apple + Google"].map((item, i) => (
        <p key={item} className={`${IN} flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium ring-1 ring-[#ececee]`} style={d(i)}>
          <Check className={`h-4 w-4 ${ok}`} /> {item}
        </p>
      ))}
    </div>
  ),
  store: () => (
    <Phone>
      <div className={`${IN} flex items-center gap-2 pt-2`} style={d(0)}>
        <span className="h-10 w-10 rounded-xl bg-[#ea4c89]" />
        <div>
          <p className="text-[10px] font-bold">Your App</p>
          <p className="flex text-[#febc2e]">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}</p>
        </div>
      </div>
      <span className={`${IN} block rounded-full bg-[#0d0c22] py-1 text-center text-[10px] font-semibold text-white`} style={d(1)}>GET</span>
      <div className={`${IN} grid grid-cols-2 gap-1`} style={d(2)}>
        <span className="h-16 rounded-md bg-[#fde2ee]" />
        <span className="h-16 rounded-md bg-[#f6c3d8]" />
      </div>
    </Phone>
  ),
  payment: () => (
    <Browser url="yourbrand.com/checkout">
      <div className="space-y-2">
        <p className={`${IN} text-xs font-semibold`} style={d(0)}>Pro plan · <span className={pink}>$29/mo</span></p>
        <div className={`${IN} flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[10px] ring-1 ring-[#ececee]`} style={d(1)}>
          <CreditCard className="h-3.5 w-3.5 text-[#9e9ea7]" /> 4242 4242 4242 4242
        </div>
        <span className={`${IN} flex items-center justify-center gap-1 rounded-full bg-[#ea4c89] py-1.5 text-[10px] font-semibold text-white`} style={d(2)}>
          <Lock className="h-3 w-3" /> Pay securely
        </span>
        <p className={`${IN} flex items-center gap-1 text-[10px] font-semibold ${ok}`} style={d(3)}>
          <Check className="h-3 w-3" /> Payment successful
        </p>
      </div>
    </Browser>
  ),
  deploy: () => (
    <Terminal
      lines={[
        <><span className={pink}>$</span> deploy --prod</>,
        "Building… done in 24s",
        "Uploading to cloud…",
        <span className={ok}>✓ Live at https://yourbrand.com</span>,
        <span className={ok}>✓ SSL · CDN · auto-scaling</span>,
      ]}
    />
  ),
  request: () => (
    <div className="grid h-full grid-cols-[150px_1fr] items-center gap-4">
      <Phone>
        <div className={`${IN} h-14 rounded-lg bg-[#fde2ee]`} style={d(0)} />
        <span className={`${IN} block rounded-full bg-[#ea4c89] py-1 text-center text-[10px] font-semibold text-white`} style={d(1)}>Load orders</span>
      </Phone>
      <div className={`${IN} rounded-xl bg-[#0d0c22] p-3 font-mono text-[10px] text-[#d7d6e0]`} style={d(2)}>
        <span className={pink}>GET</span> /api/orders<br />
        Authorization: Bearer ••••
      </div>
    </div>
  ),
  integrations: () => (
    <div className="relative grid h-full place-items-center">
      <span className={`${IN} z-10 rounded-xl bg-[#ea4c89] px-3 py-2 text-xs font-bold text-white`} style={d(0)}>Your API</span>
      {[
        ["Stripe", "left-[6%] top-[12%]"],
        ["Google Maps", "right-[4%] top-[12%]"],
        ["SendGrid", "left-[6%] bottom-[12%]"],
        ["Zalo / Slack", "right-[4%] bottom-[12%]"],
      ].map(([name, pos], i) => (
        <span key={name} className={`${IN} absolute ${pos} flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold ring-1 ring-[#ececee]`} style={d(i + 1)}>
          <Check className={`h-3 w-3 ${ok}`} /> {name}
        </span>
      ))}
    </div>
  ),
  "chat-ask": () => (
    <Phone>
      <p className={`${IN} ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-[#ea4c89] px-2 py-1.5 text-[10px] text-white`} style={d(0)}>
        Which plan fits a team of 5?
      </p>
    </Phone>
  ),
  context: () => (
    <div className="flex h-full flex-col justify-center gap-2">
      <p className={`${IN} text-[11px] font-semibold text-[#6e6d7a]`} style={d(0)}>Your app attaches context:</p>
      {["pricing.pdf · Team plan section", "FAQ · seats & billing", "User: company of 5"].map((doc, i) => (
        <p key={doc} className={`${IN} rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-[#ececee]`} style={d(i + 1)}>
          📎 {doc}
        </p>
      ))}
    </div>
  ),
  thinking: () => (
    <div className="grid h-full place-items-center">
      <div className={`${IN} flex flex-col items-center gap-3`} style={d(0)}>
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#0d0c22] text-white">
          <Sparkles className="h-7 w-7 animate-pulse" />
        </span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-[#ea4c89]" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </span>
        <p className="text-[11px] text-[#6e6d7a]">Reasoning over your data…</p>
      </div>
    </div>
  ),
  "chat-answer": () => (
    <Phone>
      <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-[#ea4c89] px-2 py-1.5 text-[10px] text-white">
        Which plan fits a team of 5?
      </p>
      <p className={`${IN} w-fit max-w-[95%] rounded-2xl rounded-bl-sm bg-[#f8f7f4] px-2 py-1.5 text-[10px]`} style={d(1)}>
        The <b>Team plan</b> ($49/mo) covers up to 10 seats. Want me to start a trial?
      </p>
    </Phone>
  ),
  uptime: () => (
    <Browser url="status · monitoring">
      <p className={`${IN} flex items-center gap-2 text-xs font-semibold`} style={d(0)}>
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#28c840]" /> All systems operational
      </p>
      <div className="mt-3 flex gap-[3px]">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="scene-grow h-8 flex-1 origin-bottom rounded-sm bg-[#28c840]" style={{ animationDelay: `${i * 25}ms` }} />
        ))}
      </div>
      <p className={`${IN} mt-2 text-[10px] text-[#6e6d7a]`} style={d(3)}>Uptime 99.98% · last 30 days</p>
    </Browser>
  ),
  alert: () => (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className={`${IN} flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-[#f6c3d8]`} style={d(0)}>
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#febc2e]" />
        <div>
          <p className="text-xs font-semibold">Checkout error rate ↑ 4%</p>
          <p className="text-[10px] text-[#6e6d7a]">TypeError in payment.ts:42 · 12 users</p>
        </div>
      </div>
      <p className={`${IN} flex items-center gap-2 rounded-xl bg-[#fff1f6] p-3 text-[11px] font-semibold ${pink}`} style={d(1)}>
        <Bell className="h-4 w-4" /> Nexa on-call notified · 2 min ago
      </p>
    </div>
  ),
  fix: () => (
    <Terminal
      lines={[
        <span className="text-[#9e9ea7]">payment.ts</span>,
        <span className="text-[#ff5f57]">- const total = cart.items.sum</span>,
        <span className={ok}>+ const total = cart.items?.sum ?? 0</span>,
        <span className={ok}>✓ tests passed · deployed</span>,
        <span className={ok}>✓ react-native 0.76 → 0.77</span>,
      ]}
    />
  ),
  report: () => (
    <Browser url="October report.pdf">
      <p className={`${IN} text-xs font-bold`} style={d(0)}>Monthly report · October</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Uptime", "99.98%"],
          ["Bugs fixed", "7"],
          ["Upgrades", "3"],
        ].map(([k, v], i) => (
          <div key={k} className={`${IN} rounded-lg bg-[#f8f7f4] p-2`} style={d(i + 1)}>
            <p className="text-[9px] text-[#6e6d7a]">{k}</p>
            <p className="text-sm font-bold">{v}</p>
          </div>
        ))}
      </div>
      <p className={`${IN} mt-3 flex items-center gap-1 text-[10px] text-[#6e6d7a]`} style={d(4)}>
        <BarChart3 className={`h-3.5 w-3.5 ${pink}`} /> Sent to your email on the 1st
      </p>
    </Browser>
  ),
  testimonials: () => (
    <Browser url="yourbrand.com/#reviews">
      <div className="grid grid-cols-2 gap-2">
        {[
          ["Minh T.", "Leads doubled in the first month."],
          ["Lan P.", "Fast, clean, exactly our brand."],
        ].map(([name, text], i) => (
          <div key={name} className={`${IN} rounded-lg bg-[#f8f7f4] p-2`} style={d(i)}>
            <Stars />
            <p className="mt-1 text-[10px] leading-4">“{text}”</p>
            <p className="mt-1 text-[9px] font-semibold text-[#6e6d7a]">{name}</p>
          </div>
        ))}
      </div>
      <div className={`${IN} mt-3 flex items-center justify-between gap-2`} style={d(2)}>
        {["ACME", "Nova", "Lumen", "Kite"].map((logo) => (
          <span key={logo} className="font-display text-xs font-bold text-[#b9b8c2]">{logo}</span>
        ))}
      </div>
      <p className={`${IN} mt-3 text-center text-[11px] font-semibold`} style={d(3)}>
        4.9 / 5 from <span className={pink}>120+</span> clients
      </p>
    </Browser>
  ),
  analytics: () => (
    <Browser url="analytics.google.com">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Visitors", "8,420"],
          ["Leads", "312"],
          ["Conversion", "3.7%"],
        ].map(([k, v], i) => (
          <div key={k} className={`${IN} rounded-lg bg-[#f8f7f4] p-2`} style={d(i)}>
            <p className="text-[9px] text-[#6e6d7a]">{k}</p>
            <p className="text-sm font-bold">{v}</p>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 200 60" className={`${IN} mt-3 h-16 w-full`} style={d(3)} preserveAspectRatio="none">
        <path d="M0 50 L30 44 L60 46 L90 32 L120 34 L150 18 L200 8 V60 H0 Z" fill="#fde2ee" />
        <path d="M0 50 L30 44 L60 46 L90 32 L120 34 L150 18 L200 8" fill="none" stroke="#ea4c89" strokeWidth="2" vectorEffect="non-scaling-stroke" className="scene-draw" />
      </svg>
      <div className={`${IN} mt-1 flex gap-3 text-[9px] text-[#6e6d7a]`} style={d(4)}>
        <span>Google 52%</span><span>Facebook ads 31%</span><span>Direct 17%</span>
      </div>
    </Browser>
  ),
  compose: () => (
    <Browser url="app/compose">
      <div className="grid grid-cols-[80px_1fr] gap-3">
        <div className={`${IN} h-20 rounded-lg bg-gradient-to-br from-[#fde2ee] to-[#f6c3d8]`} style={d(0)} />
        <div className="space-y-1.5">
          <p className={`${IN} text-[11px] leading-4`} style={d(1)}>New autumn collection is here 🍂 Shop now!</p>
          <p className={`${IN} text-[10px] ${pink}`} style={d(2)}>#fashion #newarrival</p>
        </div>
      </div>
      <div className={`${IN} mt-3 flex gap-1.5`} style={d(3)}>
        {[["FB", "#1877f2"], ["IG", "#e1306c"], ["TT", "#0d0c22"]].map(([n, c]) => (
          <span key={n} className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ background: c }}>
            <Check className="h-2.5 w-2.5" />{n}
          </span>
        ))}
      </div>
      <span className={`${IN} mt-3 inline-block rounded-full bg-[#ea4c89] px-3 py-1 text-[10px] font-semibold text-white`} style={d(4)}>
        Schedule post
      </span>
    </Browser>
  ),
  insights: () => (
    <Browser url="app/insights">
      <div className="grid grid-cols-3 gap-2">
        {[
          [Heart, "2.4k", "Likes"],
          [MessageCircle, "318", "Comments"],
          [Share2, "96", "Shares"],
        ].map(([Icon, v, k], i) => {
          const I = Icon as typeof Heart;
          return (
            <div key={k as string} className={`${IN} rounded-lg bg-[#f8f7f4] p-2`} style={d(i)}>
              <I className={`h-3.5 w-3.5 ${pink}`} />
              <p className="mt-1 text-sm font-bold">{v as string}</p>
              <p className="text-[9px] text-[#6e6d7a]">{k as string}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 space-y-1.5">
        {[["TikTok", 92], ["Instagram", 64], ["Facebook", 41]].map(([n, w], i) => (
          <div key={n} className={`${IN} flex items-center gap-2 text-[9px]`} style={d(i + 3)}>
            <span className="w-14">{n}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ececee]">
              <span className="scene-fill block h-full origin-left rounded-full bg-[#ea4c89]" style={{ width: `${w}%`, ...d(i + 3) }} />
            </span>
          </div>
        ))}
      </div>
    </Browser>
  ),
  crud: () => (
    <Browser url="admin.yourbrand.com/products">
      <div className={`${IN} flex items-center justify-between`} style={d(0)}>
        <span className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-[#9e9ea7] ring-1 ring-[#ececee]">
          <Search className="h-3 w-3" /> Search products
        </span>
        <span className="rounded-full bg-[#ea4c89] px-2.5 py-1 text-[10px] font-semibold text-white">+ Add</span>
      </div>
      <div className="mt-2 space-y-1">
        {[["Summer dress", "$39", false], ["Linen shirt", "$29", true], ["Canvas bag", "$19", false]].map(([name, price, editing], i) => (
          <div
            key={name as string}
            className={`${IN} flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${editing ? "bg-[#fff1f6] ring-1 ring-[#f6c3d8]" : ""}`}
            style={d(i + 1)}
          >
            <span className="h-5 w-5 rounded bg-[#fde2ee]" />
            <span className="flex-1">{name as string}</span>
            {editing ? (
              <span className="rounded bg-white px-1.5 font-semibold ring-1 ring-[#ea4c89]">$25</span>
            ) : (
              <span>{price as string}</span>
            )}
            <span className={editing ? `font-semibold ${pink}` : "text-[#9e9ea7]"}>{editing ? "Save" : "Edit"}</span>
          </div>
        ))}
      </div>
      <p className={`${IN} mt-2 flex items-center gap-1 text-[10px] font-semibold ${ok}`} style={d(4)}>
        <Check className="h-3 w-3" /> Saved · live on your site
      </p>
    </Browser>
  ),
  export: () => (
    <div className="flex h-full flex-col justify-center gap-2">
      {[
        ["October-sales.xlsx", "#1d6f42"],
        ["Customers.csv", "#6e6d7a"],
        ["Monthly-report.pdf", "#e5252a"],
      ].map(([file, color], i) => (
        <div key={file} className={`${IN} flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-[#ececee]`} style={d(i)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg text-[9px] font-bold text-white" style={{ background: color }}>
            {file.split(".")[1].toUpperCase()}
          </span>
          <span className="flex-1 text-xs font-semibold">{file}</span>
          <Download className={`h-4 w-4 ${pink}`} />
        </div>
      ))}
      <p className={`${IN} text-center text-[11px] text-[#6e6d7a]`} style={d(3)}>Auto-emailed every Monday 08:00</p>
    </div>
  ),
  audience: () => (
    <Browser url="app/campaigns/new">
      <p className={`${IN} text-xs font-semibold`} style={d(0)}>Send “Autumn sale” to:</p>
      <div className="mt-2 space-y-1.5">
        {[["VIP customers", "1,204", true], ["Bought in last 30 days", "3,880", true], ["Unsubscribed", "212", false]].map(([seg, n, on], i) => (
          <div key={seg as string} className={`${IN} flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ring-1 ${on ? "ring-[#f6c3d8] bg-[#fff1f6]" : "ring-[#ececee] opacity-50"}`} style={d(i + 1)}>
            <span className={`grid h-3.5 w-3.5 place-items-center rounded ${on ? "bg-[#ea4c89] text-white" : "ring-1 ring-[#c9c8d3]"}`}>
              {on && <Check className="h-2.5 w-2.5" />}
            </span>
            <span className="flex-1">{seg as string}</span>
            <span className="font-mono">{n as string}</span>
          </div>
        ))}
      </div>
      <p className={`${IN} mt-2 text-[10px] text-[#6e6d7a]`} style={d(4)}>
        Recipients: <b className="text-[#0d0c22]">5,084</b> · unsubscribed excluded
      </p>
    </Browser>
  ),
  "mail-inbox": () => (
    <Browser url="mail.google.com · Primary">
      <div className="space-y-1.5">
        <div className={`${IN} flex items-center gap-2 rounded-lg bg-[#fff1f6] p-2 ring-1 ring-[#f6c3d8]`} style={d(0)}>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ea4c89] text-[10px] font-bold text-white">Y</span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold">Your Brand · Thanks for your order!</p>
            <p className="truncate text-[10px] text-[#6e6d7a]">Order #1042 · $120 · Track order</p>
          </div>
          <span className={`flex items-center gap-0.5 text-[9px] font-bold ${ok}`}><ShieldCheck className="h-3 w-3" />Primary</span>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${IN} flex items-center gap-2 p-2 opacity-60`} style={d(i)}>
            <span className="h-6 w-6 rounded-full bg-[#ececee]" />
            <div className="flex-1">
              <Bar w="40%" className="bg-[#c9c8d3]" />
              <Bar w="75%" className="mt-1.5" />
            </div>
          </div>
        ))}
      </div>
    </Browser>
  ),
  "mail-stats": () => (
    <div className="flex h-full flex-col justify-center gap-3">
      {[
        ["Delivered", 99],
        ["Opened", 48],
        ["Clicked", 12],
      ].map(([k, v], i) => (
        <div key={k} className={IN} style={d(i)}>
          <p className="mb-1 flex justify-between text-xs font-semibold">
            <span>{k}</span>
            <span className={pink}>{v}%</span>
          </p>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#ececee]">
            <span className="scene-fill block h-full origin-left rounded-full bg-[#ea4c89]" style={{ width: `${v}%`, ...d(i + 1) }} />
          </div>
        </div>
      ))}
      <p className={`${IN} text-[11px] text-[#6e6d7a]`} style={d(4)}>Industry average open rate: 21%</p>
    </div>
  ),
  design: () => (
    <div className="relative flex h-full items-center justify-center gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`${IN} h-[200px] w-[96px] rounded-2xl bg-white p-2 ring-1 ring-[#ececee] shadow-sm`} style={d(i)}>
          <div className={`h-12 rounded-lg ${i === 1 ? "bg-[#ea4c89]" : "bg-[#fde2ee]"}`} />
          <Bar w="80%" className="mt-2 bg-[#c9c8d3]" />
          <Bar w="60%" className="mt-1.5" />
          <div className="mt-2 grid grid-cols-2 gap-1">
            <span className="h-10 rounded bg-[#f8f7f4]" />
            <span className="h-10 rounded bg-[#f8f7f4]" />
          </div>
          <span className="mt-2 block h-4 rounded-full bg-[#ea4c89]/80" />
        </div>
      ))}
      <span className={`${IN} absolute bottom-3 rounded-full bg-[#0d0c22] px-2 py-0.5 text-[9px] font-semibold text-white`} style={d(3)}>
        Figma · approved ✓
      </span>
    </div>
  ),
  iap: () => (
    <Phone>
      <p className={`${IN} pt-1 text-center text-[11px] font-bold`} style={d(0)}>Go Premium</p>
      {[["Monthly", "$4.99"], ["Yearly", "$39.99"]].map(([plan, price], i) => (
        <div key={plan} className={`${IN} flex justify-between rounded-lg px-2 py-1.5 text-[10px] ring-1 ${i ? "bg-[#fff1f6] ring-[#ea4c89]" : "ring-[#ececee]"}`} style={d(i + 1)}>
          <span>{plan}</span>
          <b>{price}</b>
        </div>
      ))}
      <span className={`${IN} block rounded-full bg-[#0d0c22] py-1.5 text-center text-[9px] font-semibold text-white`} style={d(3)}>
        Subscribe with Apple Pay
      </span>
      <p className={`${IN} text-center text-[9px] font-semibold ${ok}`} style={d(4)}>✓ Purchase complete</p>
    </Phone>
  ),
  signup: () => (
    <Browser url="app.yourbrand.com/signup">
      <div className="mx-auto max-w-[200px] space-y-2">
        <p className={`${IN} text-center text-xs font-bold`} style={d(0)}>Create your account</p>
        <span className={`${IN} block rounded-full py-1.5 text-center text-[10px] font-semibold ring-1 ring-[#ececee]`} style={d(1)}>
          Continue with Google
        </span>
        <p className={`${IN} text-center text-[9px] text-[#9e9ea7]`} style={d(2)}>or</p>
        <div className={`${IN} rounded-md px-2 py-1.5 text-[10px] ring-1 ring-[#ececee]`} style={d(2)}>anna@company.com</div>
        <div className={`${IN} rounded-md px-2 py-1.5 text-[10px] ring-1 ring-[#ececee]`} style={d(3)}>••••••••</div>
        <span className={`${IN} block rounded-full bg-[#ea4c89] py-1.5 text-center text-[10px] font-semibold text-white`} style={d(4)}>
          Sign up
        </span>
      </div>
    </Browser>
  ),
  "auth-token": () => (
    <Terminal
      lines={[
        <><span className={pink}>→</span> Authorization: Bearer eyJhbGci…</>,
        <span className="text-[#9e9ea7]">verify signature…</span>,
        <span className={ok}>✓ token valid · user 1042 · role: customer</span>,
        <span className={ok}>✓ rate limit 12 / 100 per min</span>,
        <><span className={pink}>→</span> forward to /api/orders</>,
      ]}
    />
  ),
  response: () => (
    <Phone>
      <p className={`${IN} pt-1 text-[11px] font-bold`} style={d(0)}>My orders</p>
      {[["#1042", "$120", "Shipped"], ["#1038", "$86", "Delivered"], ["#1031", "$54", "Delivered"]].map(([id, total, st], i) => (
        <div key={id} className={`${IN} rounded-lg bg-[#f8f7f4] px-2 py-1.5 text-[9px]`} style={d(i + 1)}>
          <p className="flex justify-between font-semibold"><span>{id}</span><span>{total}</span></p>
          <p className={i ? "text-[#6e6d7a]" : pink}>{st}</p>
        </div>
      ))}
      <p className={`${IN} text-center font-mono text-[9px] ${ok}`} style={d(4)}>200 OK · 42ms</p>
    </Phone>
  ),
  cost: () => (
    <Browser url="ai · usage">
      <div className="grid grid-cols-2 gap-2">
        {[["Cache hits", "68%"], ["Cost / chat", "$0.002"]].map(([k, v], i) => (
          <div key={k} className={`${IN} rounded-lg bg-[#f8f7f4] p-2`} style={d(i)}>
            <p className="text-[9px] text-[#6e6d7a]">{k}</p>
            <p className="text-sm font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className={`${IN} mt-3`} style={d(2)}>
        <p className="mb-1 flex justify-between text-[10px] font-semibold">
          <span>Monthly budget</span>
          <span>$42 / $100</span>
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-[#ececee]">
          <span className="scene-fill block h-full w-[42%] origin-left rounded-full bg-[#ea4c89]" style={d(3)} />
        </div>
      </div>
      <p className={`${IN} mt-3 text-[10px] text-[#6e6d7a]`} style={d(4)}>
        Simple questions → small model · hard ones → large model
      </p>
    </Browser>
  ),
  feedback: () => (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className={`${IN} flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-[#ececee]`} style={d(0)}>
        <p className="flex-1 text-[11px]">Was this answer helpful?</p>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ea4c89] text-white"><ThumbsUp className="h-3.5 w-3.5" /></span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f8f7f4] text-[#9e9ea7]"><ThumbsUp className="h-3.5 w-3.5 rotate-180" /></span>
      </div>
      <div className={`${IN} rounded-xl bg-white p-3 ring-1 ring-[#ececee]`} style={d(1)}>
        <p className="text-[10px] text-[#6e6d7a]">Helpful answers</p>
        <div className="mt-2 flex h-14 items-end gap-1.5">
          {[62, 68, 74, 81, 88, 93].map((h, i) => (
            <span key={i} className="scene-grow flex-1 origin-bottom rounded-t bg-[#ea4c89]" style={{ height: `${h}%`, opacity: 0.4 + i * 0.12, ...d(i + 2) }} />
          ))}
        </div>
        <p className={`mt-1 text-[10px] font-semibold ${ok}`}>62% → 93% in 6 weeks</p>
      </div>
    </div>
  ),
  upgrade: () => (
    <div className="flex h-full flex-col justify-center gap-2">
      {[
        ["react-native", "0.76", "0.77"],
        ["iOS SDK", "17", "18"],
        ["Android target", "34", "35"],
        ["openssl", "3.0.1", "3.0.15 (security)"],
      ].map(([pkg, from, to], i) => (
        <div key={pkg} className={`${IN} flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-mono text-[10px] ring-1 ring-[#ececee]`} style={d(i)}>
          <span className="flex-1 font-semibold">{pkg}</span>
          <span className="text-[#9e9ea7]">{from}</span>→<span className={ok}>{to}</span>
        </div>
      ))}
    </div>
  ),
  backup: () => (
    <Browser url="backups · production">
      <div className="space-y-1.5">
        {["Today 03:00", "Yesterday 03:00", "Oct 4 · 03:00", "Oct 3 · 03:00"].map((when, i) => (
          <div key={when} className={`${IN} flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${i === 0 ? "bg-[#fff1f6]" : ""}`} style={d(i)}>
            <HardDrive className={`h-3.5 w-3.5 ${pink}`} />
            <span className="flex-1">{when}</span>
            <span className="text-[#6e6d7a]">2.4 GB</span>
            <span className={`font-semibold ${ok}`}>✓</span>
          </div>
        ))}
      </div>
      <p className={`${IN} mt-2 text-[10px] text-[#6e6d7a]`} style={d(4)}>Restore tested monthly · kept 30 days</p>
    </Browser>
  ),
};

export function FlowScene({ id }: { id: SceneId }) {
  return <>{scenes[id]()}</>;
}
