import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/landing/contact-form";
import SectionHeader from "@/components/landing/section-header";

export default async function ContactSection() {
  const t = await getTranslations("ContactSection");

  return (
    <section
      id="contact"
      className="relative min-h-screen snap-start bg-cream px-4 py-24 sm:px-6 sm:py-28 md:px-10"
    >
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-4xl flex-col justify-center">
        <SectionHeader
          title={t("title")}
          subtitle={t("description")}
          titleClassName="!text-xl sm:!text-2xl"
          subtitleClassName="!mt-3 !text-sm sm:!text-base"
        />

        <div className="mt-8 flex w-full flex-col gap-8 lg:h-[75vh] lg:flex-row">
          <div className="min-h-0 overflow-hidden rounded-2xl border border-[#e7dbc4] shadow-[0_16px_40px_rgba(113,94,58,0.07)] lg:aspect-9/16 lg:h-full lg:flex-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="max-h-[240px] w-full object-cover sm:max-h-[300px] lg:h-full lg:max-h-none"
              src="/video/video-nexa-intro.mp4"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
