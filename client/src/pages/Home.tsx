import Seo from "@/components/seo/Seo";
import {
  faqItems,
  projects,
  socials,
  team,
  type Project,
} from "@/components/nexa/data";
import {
  ArrowRight,
  ArrowUpRight,
  Chrome,
  Code2,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MessageCircle,
  Package,
  Smartphone,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

const videoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const navLinks = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Team", "#team"],
  ["Contact", "#contact"],
];

type FadeInProps = { children: ReactNode; className?: string; delay?: number };

const revealVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay,
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Reveal({ children, className = "", delay = 0 }: FadeInProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      custom={delay / 1000}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  );
}

function NexaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#top"
      className="flex items-center gap-3"
      aria-label="Nexa Tech home"
    >
      <span
        className={`${compact ? "h-9 w-9" : "h-11 w-11"} relative overflow-hidden rounded-lg`}
      >
        <img
          src="/favicon.png"
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
        />
      </span>
      <span
        className={`${compact ? "text-lg" : "text-xl"} font-semibold tracking-[-0.04em]`}
      >
        Nexa Tech
      </span>
    </a>
  );
}

function AnimatedHeading() {
  const [visible, setVisible] = useState(false);
  const lines = ["We build useful", "digital products."];
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 200);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <h1 className="mb-5 max-w-4xl text-4xl font-normal leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.4rem]">
      {lines.map((line, lineIndex) => (
        <span className="block" key={line}>
          {Array.from(line).map((char, index) => (
            <span
              key={`${char}-${index}`}
              className={`inline-block duration-500 ease-out transition-[opacity,transform] ${lineIndex === 1 ? "text-[#70ff9b]" : ""}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-18px)",
                transitionDelay: `${lineIndex * line.length * 28 + index * 28}ms`,
              }}
            >
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

const categoryIcons = {
  All: Code2,
  Web: Globe2,
  Mobile: Smartphone,
  Extension: Chrome,
  Library: Package,
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = categoryIcons[project.category];
  return (
    <motion.article
      className={`project-card group ${index === 0 ? "md:col-span-2" : ""}`}
      variants={staggerItemVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-[#0d1310] ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-95"
          />
        ) : (
          <div className="project-placeholder h-full w-full">
            <span className="text-[clamp(2.8rem,8vw,7rem)] font-medium tracking-[-0.08em] text-white/90">
              N/{String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs backdrop-blur-md">
          <Icon className="h-3.5 w-3.5 text-[#70ff9b]" /> {project.category}
        </div>
        {project.icon && (
          <img
            src={project.icon}
            alt={`${project.title} app icon from Google Play`}
            className="absolute bottom-4 left-4 h-16 w-16 rounded-[18px] object-cover shadow-2xl ring-1 ring-white/25 md:h-[72px] md:w-[72px]"
            loading="lazy"
          />
        )}
      </div>
      <div className="px-1 pb-3 pt-5">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="text-xl font-medium tracking-[-0.03em] md:text-2xl">
              {project.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
              {project.description}
            </p>
          </div>
          <a
            href={project.primaryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title}`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 transition hover:border-[#70ff9b] hover:bg-[#70ff9b] hover:text-black"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.tech.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/8 pt-4 text-xs">
          <a
            href={project.primaryUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#70ff9b] transition hover:text-white"
          >
            {project.primaryLabel} ↗
          </a>
          {project.secondaryUrl && (
            <a
              href={project.secondaryUrl}
              target="_blank"
              rel="noreferrer"
              className="text-white/55 transition hover:text-white"
            >
              {project.secondaryLabel} ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ContactForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name")?.toString() ?? "";
    const email = data.get("email")?.toString() ?? "";
    const message = data.get("message")?.toString() ?? "";
    const subject = encodeURIComponent(`Project enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${socials.email}?subject=${subject}&body=${body}`;
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="contact-form grid gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span>Name</span>
          <input required name="name" placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input
            required
            name="email"
            type="email"
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label>
        <span>Tell us about the idea</span>
        <textarea
          required
          name="message"
          rows={5}
          placeholder="What are you hoping to build?"
        />
      </label>
      <button
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#70ff9b] px-6 py-4 font-medium text-black transition hover:bg-white"
        type="submit"
      >
        Send message <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function Home() {
  const [category, setCategory] = useState<keyof typeof categoryIcons>("All");
  const filteredProjects = useMemo(
    () =>
      category === "All"
        ? projects
        : projects.filter((project) => project.category === category),
    [category],
  );

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden bg-[#050705] text-white"
    >
      <Seo
        title="Nexa Tech | React Native, Web & Mobile Product Studio"
        description="Nexa Tech builds React Native apps, web products, open-source tools, and showcase libraries like react-native-simple-fs."
      />

      <section className="relative isolate flex min-h-svh overflow-hidden bg-black">
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="relative z-10 flex min-h-svh w-full flex-col px-5 pt-5 sm:px-8 md:px-12 lg:px-16">
          <nav
            className="liquid-glass mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-xl px-3 py-2 sm:px-4"
            aria-label="Main navigation"
          >
            <NexaLogo compact />
            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm text-white/65 transition hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
            <a
              href="#contact"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-[#70ff9b] sm:px-6"
            >
              Start a project
            </a>
          </nav>

          <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end pb-10 lg:pb-14">
            <div className="gap-12 lg:grid lg:grid-cols-[1.4fr_.6fr] lg:items-end">
              <div>
                <AnimatedHeading />
                <Reveal delay={850}>
                  <p className="max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
                    Nexa is a product studio turning simple ideas into React
                    Native apps, web products, and open-source tools people can
                    use today.
                  </p>
                </Reveal>
                <Reveal delay={1150} className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#work"
                    className="rounded-lg bg-white px-7 py-3 font-medium text-black transition hover:bg-[#70ff9b]"
                  >
                    Explore our work
                  </a>
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="liquid-glass liquid-glass--bordered rounded-lg px-7 py-3 font-medium"
                  >
                    GitHub ↗
                  </a>
                </Reveal>
              </div>
              <Reveal delay={1400} className="mt-8 flex lg:mt-0 lg:justify-end">
                <div className="liquid-glass liquid-glass--bordered rounded-xl px-5 py-3 text-lg font-light md:text-xl">
                  Web. Mobile. Open source.
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="border-b border-white/10 px-6 py-10 md:px-12 lg:px-16">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-6 md:grid-cols-4">
            {[
              ["14+", "Products shipped"],
              ["8", "Mobile apps"],
              ["3", "Product platforms"],
              ["Free", "User-first tools"],
            ].map(([value, label]) => (
              <motion.div
                key={label}
                variants={staggerItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.05 }}
              >
                <p className="text-3xl tracking-[-0.05em] md:text-4xl">
                  {value.endsWith("+") ? (
                    <>
                      {value.slice(0, -1)}
                      <span className="text-[#70ff9b]">+</span>
                    </>
                  ) : (
                    value
                  )}
                </p>
                <p className="mt-1 text-sm text-white/45">{label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="work"
          className="scroll-mt-8 px-6 py-24 md:px-12 lg:px-16 lg:py-32"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-8 border-b border-white/10 pb-9 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <p className="section-kicker">Selected work / 2024—2026</p>
                <h2 className="section-title mt-3">
                  Products made for
                  <br />
                  real everyday use.
                </h2>
              </Reveal>
              <Reveal delay={120} className="flex flex-wrap gap-2">
                {(
                  Object.keys(categoryIcons) as (keyof typeof categoryIcons)[]
                ).map((item) => {
                  const Icon = categoryIcons[item];
                  return (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${category === item ? "bg-[#70ff9b] text-black" : "border border-white/10 text-white/55 hover:border-white/30 hover:text-white"}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item}
                    </button>
                  );
                })}
              </Reveal>
            </div>
            <motion.div
              key={category}
              className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </section>

        <section
          id="about"
          className="border-y border-white/10 bg-[#090c09] px-6 py-24 md:px-12 lg:px-16 lg:py-32"
        >
          <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <Reveal>
              <div className="max-w-xl">
                <p className="section-kicker">About Nexa</p>
                <h2 className="section-title mt-4">
                  Small team.
                  <br />
                  <span className="text-white/35">Sharp execution.</span>
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-white/60 md:text-xl md:leading-9">
                  We turn focused ideas into products people can try today, with
                  a bias toward clarity, speed, and shipping work that actually
                  feels finished.
                </p>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/60">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#70ff9b]" />
                  Web, mobile, library, and open-source builds
                </div>
              </div>
            </Reveal>
            <Reveal
              delay={100}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-7"
            >
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#70ff9b]">
                What we focus on
              </p>
              <div className="mt-6 grid gap-4">
                {[
                  [
                    "Real product outcomes",
                    "Useful apps, tools, and libraries built for people who need them.",
                  ],
                  [
                    "Clean delivery",
                    "Simple interfaces, fast performance, and a presentation that feels intentional.",
                  ],
                  [
                    "Build once, reuse smartly",
                    "One codebase, many ship-ready outcomes across web, mobile, and package work.",
                  ],
                ].map(([title, description], index) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-white/55">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-medium text-white">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/50">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="team" className="px-6 py-24 md:px-12 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              <p className="section-kicker">The people behind Nexa</p>
              <h2 className="section-title mt-3">Meet the team.</h2>
            </Reveal>
            <motion.div
              className="mt-12 grid max-w-5xl gap-6 md:grid-cols-2"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {team.map((member) => (
                <motion.article
                  key={member.name}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#70ff9b]/50 md:p-7"
                  variants={staggerItemVariants}
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="aspect-[4/3] w-full rounded-2xl object-cover grayscale transition duration-500 group-hover:grayscale-0"
                  />
                  <div className="mt-6 flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-2xl tracking-[-0.04em]">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#70ff9b]">
                        {member.role}
                      </p>
                      <p className="mt-4 max-w-md text-sm leading-6 text-white/50">
                        {member.bio}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        className="social-button"
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on GitHub`}
                      >
                        <Github />
                      </a>
                      <a
                        className="social-button"
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <Linkedin />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <section
          id="faq"
          className="border-y border-white/10 bg-[#070a07] px-6 py-24 md:px-12 lg:px-16 lg:py-32"
        >
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              <p className="section-kicker">FAQ / Search-friendly answers</p>
              <h2 className="section-title mt-3">
                Common questions, answered clearly.
              </h2>
            </Reveal>
            <motion.div
              className="mt-12 grid gap-4 md:grid-cols-2"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
            >
              {faqItems.map((item) => (
                <motion.article
                  key={item.question}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
                  variants={staggerItemVariants}
                >
                  <h3 className="text-lg font-medium tracking-[-0.03em] text-white">
                    {item.question}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                    {item.answer}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="contact" className="px-6 py-24 md:px-12 lg:px-16 lg:py-32">
          <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <Reveal>
              <p className="section-kicker">Start a conversation</p>
              <h2 className="section-title mt-3">
                Have an idea?
                <br />
                <span className="text-[#70ff9b]">Let’s build it.</span>
              </h2>
              <p className="mt-6 max-w-md text-white/50">
                Tell us what you are working on. We read every message and will
                reply directly by email.
              </p>
              <a
                href={`mailto:${socials.email}`}
                className="mt-9 inline-flex items-center gap-3 text-lg hover:text-[#70ff9b]"
              >
                <Mail className="h-5 w-5" />
                {socials.email}
              </a>
            </Reveal>
            <Reveal delay={180}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-10 md:px-12 lg:px-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <NexaLogo />
            <div className="flex gap-3">
              <a
                className="social-button"
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Nexa on GitHub"
              >
                <Github />
              </a>
              <a
                className="social-button"
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Nexa on LinkedIn"
              >
                <Linkedin />
              </a>
              <a
                className="social-button"
                href={`mailto:${socials.email}`}
                aria-label="Email Nexa"
              >
                <Mail />
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/35 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Nexa Tech. All rights reserved.</p>
            <p>Web · Mobile · Open source</p>
          </div>
        </div>
      </footer>

      <a
        href={`mailto:${socials.email}`}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#70ff9b] px-4 py-3 text-sm font-medium text-black shadow-2xl transition hover:scale-105"
        aria-label="Chat with Nexa"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Chat with us</span>
      </a>
    </div>
  );
}
