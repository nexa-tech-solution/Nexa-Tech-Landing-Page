import {
  getProjectPath,
  projects,
  roadmap,
  type Project,
  type RoadmapPhase,
} from "@/components/nexa/data";
import { ProjectAvatar } from "@/components/nexa/layout";
import { useEffect, useRef, useState, type CSSProperties } from "react";

// Web builds often share artwork with their app twin; borrow its icon.
const withIcon = (project: Project): Project =>
  project.icon
    ? project
    : {
        ...project,
        icon: projects.find((p) => p.icon && p.image === project.image)?.icon,
      };

// "Coloring Book: Paint & Draw" → "Coloring Book". Em-dash suffixes stay, since
// they tell an app ("PetPal — Pet Simulator") apart from its web twin ("PetPal").
const shortName = (title: string) => title.split(": ")[0];

function ProjectChip({ title }: { title: string }) {
  const project = projects.find((item) => item.title === title);
  if (!project) return null;
  return (
    <a
      href={getProjectPath(project)}
      title={project.title}
      className="inline-flex items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2.5 text-[12px] font-medium text-[#0d0c22] ring-1 ring-[#ececee] transition hover:ring-[#c4c4c8]"
    >
      <ProjectAvatar
        project={withIcon(project)}
        className="h-5 w-5 text-[8px]"
      />
      {shortName(project.title)}
      {project.comingSoon ? (
        <span className="rounded-full bg-[#fde2ee] px-1.5 text-[10px] font-semibold text-[#ea4c89]">
          Soon
        </span>
      ) : null}
    </a>
  );
}

const nodeClass: Record<RoadmapPhase["status"], string> = {
  done: "bg-[#0d0c22]",
  now: "rm-node-now bg-[#ea4c89] shadow-[0_0_0_4px_rgba(234,76,137,0.2)]",
  planned: "border-2 border-dashed border-[#c4c4c8] bg-[#f8f7f4]",
};

function Phase({
  phase,
  index,
  isLast,
}: {
  phase: RoadmapPhase;
  index: number;
  isLast: boolean;
}) {
  const planned = phase.status === "planned";
  // The track leading out of a phase is solid through history, dashed into the future.
  const nextIsPlanned = roadmap[index + 1]?.status === "planned";

  return (
    <li
      style={{ "--rm-i": index } as CSSProperties}
      className="relative flex flex-col pl-9 lg:pl-0 lg:pt-10"
    >
      {!isLast ? (
        <span
          aria-hidden="true"
          className={`rm-track absolute left-[7px] top-5 -bottom-12 lg:bottom-auto lg:left-5 lg:-right-8 lg:top-[7px] ${
            nextIsPlanned
              ? "border-l border-dashed border-[#c4c4c8] lg:border-l-0 lg:border-t"
              : "w-px bg-[#0d0c22] lg:h-px lg:w-auto"
          }`}
        />
      ) : null}
      <span
        aria-hidden="true"
        className={`rm-node absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full lg:top-0 ${nodeClass[phase.status]}`}
      />

      <div className="rm-content flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <p
            className={`font-display text-4xl font-bold tracking-[-0.04em] ${
              planned ? "text-[#9e9ea7]" : "text-[#0d0c22]"
            }`}
          >
            {phase.period}
          </p>
          {phase.status === "now" ? (
            <span className="rounded-full bg-[#fde2ee] px-2 py-0.5 text-[11px] font-semibold text-[#ea4c89]">
              Now
            </span>
          ) : null}
          {planned ? (
            <span className="rounded-full border border-dashed border-[#c4c4c8] px-2 py-0.5 text-[11px] font-semibold text-[#6e6d7a]">
              Planned
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug">
          {phase.title}
        </h3>
        <p className="mt-2 text-[15px] leading-6 text-[#6e6d7a]">
          {phase.summary}
        </p>

        {phase.projects?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {phase.projects.map((title) => (
              <ProjectChip key={title} title={title} />
            ))}
          </div>
        ) : null}

        {phase.plans?.length ? (
          <ul className="mt-4 grid gap-2">
            {phase.plans.map((plan) => (
              <li
                key={plan}
                className="flex gap-2.5 text-sm leading-5 text-[#3d3d4e]"
              >
                <span className="mt-1 h-3 w-3 shrink-0 rounded-full border border-dashed border-[#9e9ea7]" />
                {plan}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-6">
          <div className="border-t border-[#e7e7e9] pt-4">
            <p
              className={`font-mono text-[11px] uppercase tracking-[0.1em] ${
                planned ? "text-[#9e9ea7]" : "text-[#ea4c89]"
              }`}
            >
              {planned ? "Goal" : "Result"}
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-[#0d0c22]">
              {phase.result}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

// The track draws itself phase by phase up to "Now" (see `.roadmap` in
// index.css); each phase's node and content arrive as the line reaches them.
export function Roadmap() {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <ol
      ref={ref}
      className={`roadmap mt-16 grid gap-12 lg:grid-cols-4 lg:gap-8 ${active ? "is-active" : ""}`}
    >
      {roadmap.map((phase, index) => (
        <Phase
          key={phase.period}
          phase={phase}
          index={index}
          isLast={index === roadmap.length - 1}
        />
      ))}
    </ol>
  );
}
