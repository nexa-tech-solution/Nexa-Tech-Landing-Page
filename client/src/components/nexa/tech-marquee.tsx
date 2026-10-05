type Tech = { name: string; logo: string };

// Logos from Simple Icons (simpleicons.org), saved under /public/tech.
const rows: Tech[][] = [
  [
    { name: "React Native", logo: "react" },
    { name: "TypeScript", logo: "typescript" },
    { name: "Expo", logo: "expo" },
    { name: "Redux", logo: "redux" },
    { name: "Rive", logo: "rive" },
    { name: "iOS", logo: "apple" },
    { name: "Android", logo: "android" },
    { name: "Gemini", logo: "googlegemini" },
  ],
  [
    { name: "React", logo: "react" },
    { name: "Next.js", logo: "nextdotjs" },
    { name: "Vite", logo: "vite" },
    { name: "Tailwind CSS", logo: "tailwindcss" },
    { name: "Node.js", logo: "nodedotjs" },
    { name: "JavaScript", logo: "javascript" },
    { name: "Vercel", logo: "vercel" },
    { name: "Figma", logo: "figma" },
    { name: "GitHub", logo: "github" },
  ],
];

function TechPill({ tech }: { tech: Tech }) {
  return (
    <li className="flex shrink-0 items-center gap-3 rounded-full bg-white py-2.5 pl-3 pr-5 ring-1 ring-[#ececee]">
      <img
        src={`/tech/${tech.logo}.svg`}
        alt=""
        loading="lazy"
        className="h-7 w-7"
      />
      <span className="whitespace-nowrap text-[15px] font-semibold text-[#0d0c22]">
        {tech.name}
      </span>
    </li>
  );
}

export function TechMarquee() {
  return (
    <div className="tech-marquee mt-12 grid gap-2">
      {rows.map((row, index) => (
        <div key={index} className="tech-marquee-row overflow-hidden py-1">
          {/* Two copies of the row so translateX(-50%) loops seamlessly. */}
          <ul
            className={`tech-marquee-track flex w-max gap-4 ${
              index % 2 ? "tech-marquee-reverse" : ""
            }`}
          >
            {[...row, ...row].map((tech, i) => (
              <TechPill key={`${tech.name}-${i}`} tech={tech} />
            ))}
          </ul>
        </div>
      ))}
      <p className="sr-only">{rows.flat().map((t) => t.name).join(", ")}</p>
    </div>
  );
}
