import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/landing/section-header";
import ProductCard from "@/components/landing/product-card";
import { openSourceProjects } from "@/constants/open-source-projects";

interface OpenSourceSectionProps {
  locale: string;
}

export default async function OpenSourceSection({
  locale,
}: OpenSourceSectionProps) {
  const t = await getTranslations("OpenSourceSection");

  return (
    <section
      id="open-source"
      className="relative min-h-screen snap-start bg-cream px-4 py-24 sm:px-6 sm:py-28 md:px-10"
    >
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl flex-col justify-center">
        <SectionHeader title={t("title")} subtitle={t("description")} />

        <div className="mx-auto mt-12 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[240px]">
          {openSourceProjects.map((project) => (
            <ProductCard
              key={project.id}
              name={project.name[locale] ?? project.name.en}
              description={
                project.description[locale] ?? project.description.en
              }
              stack={project.stack}
              image={project.image}
              link={project.link}
              githubLink={project.githubLink}
              appStoreLink={project.appStoreLink}
              playStoreLink={project.playStoreLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
