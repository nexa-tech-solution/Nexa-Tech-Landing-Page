import Seo from "@/components/seo/Seo";
import {
  faqItems,
  projects,
  socials,
  team,
} from "@/components/nexa/data";
import { ShotCard, SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { Roadmap } from "@/components/nexa/roadmap";
import { CountUp } from "@/components/nexa/count-up";
import {
  EMPTY_FILTERS,
  FilterPanel,
  FiltersButton,
  SortMenu,
  applyWorkFilters,
  filterOptions,
  type SortKey,
  type WorkFilters,
} from "@/components/nexa/work-filters";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Search,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

const categories = ["All", "Web", "Mobile", "Extension", "Library"] as const;
type Category = (typeof categories)[number];

const trendingTags = ["React Native", "Next.js", "Chrome extension", "TypeScript"];

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
    <form onSubmit={handleSubmit} className="contact-form grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
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
      <button className="btn-dark mt-1 justify-self-start" type="submit">
        Send message <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function Home() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [filters, setFilters] = useState<WorkFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const options = useMemo(() => filterOptions(projects), []);
  const activeFilters = filters.platforms.length + filters.techs.length;

  const filteredProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matching = projects.filter((project) => {
      if (category !== "All" && project.category !== category) return false;
      if (!needle) return true;
      return [project.title, project.description, ...project.tech]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
    return applyWorkFilters(matching, filters, sort);
  }, [category, query, filters, sort]);

  const resetAll = () => {
    setQuery("");
    setCategory("All");
    setFilters(EMPTY_FILTERS);
  };

  const searchFor = (value: string) => {
    setQuery(value);
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="top"
      className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]"
    >
      <Seo
        title="Nexa Tech | React Native, Web & Mobile Product Studio"
        description="Nexa Tech builds React Native apps, web products, open-source tools, and showcase libraries like react-native-simple-fs."
      />

      <SiteHeader />

      <main>
        <section className="px-5 pb-16 pt-14 text-center md:pt-20">
          <div className="mx-auto max-w-[900px]">
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-[4.5rem]">
              Discover the products
              <br className="hidden sm:block" /> we build &amp; ship
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-[#3d3d4e] md:text-lg">
              Nexa is a product studio turning simple ideas into React Native
              apps, web products, and open-source tools people can use today.
            </p>

            <form
              className="mx-auto mt-10 flex max-w-[640px] items-center rounded-full bg-[#f3f3f4] p-1.5 pl-6 transition focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(234,76,137,0.1)] focus-within:ring-1 focus-within:ring-[#ea4c89]/40"
              onSubmit={(event) => {
                event.preventDefault();
                searchFor(query);
              }}
              role="search"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What are you looking for?"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#9e9ea7]"
                aria-label="Search products"
              />
              <span className="mr-3 hidden items-center gap-1 text-sm font-semibold text-[#3d3d4e] sm:flex">
                Products <ChevronDown className="h-4 w-4" />
              </span>
              <button
                type="submit"
                className="grid h-12 w-12 place-items-center rounded-full bg-[#ea4c89] text-white transition hover:bg-[#f082ac]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-[#6e6d7a]">Trending searches</span>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => searchFor(tag)}
                  className="rounded-full border border-[#e7e7e9] px-3 py-1 text-[13px] font-medium text-[#3d3d4e] transition hover:border-[#dbdbde] hover:bg-[#f3f3f4]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="scroll-mt-20 px-5 pb-24 md:px-10">
          <div className="mx-auto max-w-[1600px]">
            <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="hidden lg:block">
                <SortMenu value={sort} onChange={setSort} />
              </div>
              <div className="-mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:px-0">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      category === item
                        ? "bg-[#f3f3f4] text-[#0d0c22]"
                        : "text-[#6e6d7a] hover:text-[#0d0c22]"
                    }`}
                  >
                    {item === "All" ? "Discover" : item}
                  </button>
                ))}
              </div>
              {/* On small screens sort + filters share one row under the categories. */}
              <div className="flex items-center justify-between gap-3 lg:contents">
                <div className="lg:hidden">
                  <SortMenu value={sort} onChange={setSort} />
                </div>
                <FiltersButton
                  open={filtersOpen}
                  count={activeFilters}
                  onClick={() => setFiltersOpen((o) => !o)}
                />
              </div>
            </div>

            <FilterPanel
              open={filtersOpen}
              filters={filters}
              options={options}
              onChange={setFilters}
            />

            {filteredProjects.length ? (
              <ul className="grid gap-x-9 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {filteredProjects.map((project, index) => (
                  <ShotCard
                    key={project.title}
                    project={project}
                    index={index}
                  />
                ))}
              </ul>
            ) : (
              <div className="py-20 text-center text-[#6e6d7a]">
                <p>
                  {query
                    ? `No products match “${query}”.`
                    : "No products match these filters."}
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-4 rounded-full border border-[#e7e7e9] px-4 py-2 text-sm font-medium text-[#0d0c22] transition hover:bg-[#f3f3f4]"
                >
                  Clear search &amp; filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="about" className="bg-[#f8f7f4] px-5 py-24 md:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className="kicker">About Nexa · Since 2024</p>
                <h2 className="section-title mt-3">
                  Small team.
                  <br />
                  Sharp execution.
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-[#3d3d4e]">
                  We turn focused ideas into products people can try today. Here
                  is how that has played out so far, and where we are heading.
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 lg:pb-2">
                {[
                  { to: 2024, from: 2015, label: "Founded" },
                  { to: 21, suffix: "+", label: "Products shipped" },
                  { to: 12, label: "Mobile apps" },
                  { to: 3, label: "Platforms" },
                ].map(({ label, ...count }, index) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="font-display text-4xl font-bold tracking-[-0.04em]">
                      <CountUp {...count} delay={index * 120} />
                    </dd>
                    <dd aria-hidden="true" className="mt-1 text-sm text-[#6e6d7a]">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <Roadmap />
          </div>
        </section>

        <section id="team" className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="text-center">
              <p className="kicker">The people behind Nexa</p>
              <h2 className="section-title mt-3">Meet the team</h2>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
              {team.map((member) => (
                <article
                  key={member.name}
                  className="rounded-2xl border border-[#e7e7e9] p-6 text-center transition hover:shadow-[0_10px_40px_rgba(13,12,34,0.08)]"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                  <h3 className="mt-5 text-xl font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[#ea4c89]">
                    {member.role}
                  </p>
                  <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-[#6e6d7a]">
                    {member.bio}
                  </p>
                  <div className="mt-5 flex justify-center gap-2">
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
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-[#f8f7f4] px-5 py-24 md:px-10">
          <div className="mx-auto max-w-[900px]">
            <div className="text-center">
              <p className="kicker">FAQ</p>
              <h2 className="section-title mt-3">Common questions</h2>
            </div>
            <div className="mt-12 grid gap-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl bg-white p-6 open:shadow-[0_10px_40px_rgba(13,12,34,0.06)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                    {item.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#6e6d7a] transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[15px] leading-7 text-[#6e6d7a]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-5 py-24 md:px-10">
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="kicker">Start a conversation</p>
              <h2 className="section-title mt-3">
                Have an idea?
                <br />
                Let’s build it.
              </h2>
              <p className="mt-6 max-w-md text-lg text-[#3d3d4e]">
                Tell us what you are working on. We read every message and will
                reply directly by email.
              </p>
              <a
                href={`mailto:${socials.email}`}
                className="mt-8 inline-flex items-center gap-3 text-lg font-semibold underline-offset-4 hover:underline"
              >
                <Mail className="h-5 w-5" />
                {socials.email}
              </a>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
