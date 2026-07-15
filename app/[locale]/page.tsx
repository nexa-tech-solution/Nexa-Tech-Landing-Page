import ContactSection from "@/components/landing/contact-section";
import HeroSection from "@/components/landing/hero-section";
import OpenSourceSection from "@/components/landing/open-source-section";
import ProductsSection from "@/components/landing/products-section";
import SiteHeader from "@/components/landing/site-header";
import SiteFooter from "@/components/landing/site-footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { localeDetails, routing } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const metadataT = await getTranslations({ locale, namespace: "Metadata" });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Nexa Tech",
        description: metadataT("description"),
        logo: "/favicon.png",
      },
      {
        "@type": "WebSite",
        name: "Nexa Tech",
        description: metadataT("description"),
        inLanguage: locale,
        availableLanguage: routing.locales.map(
          (item) => localeDetails[item].nativeLabel,
        ),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main className="page-enter h-screen overflow-y-auto snap-y snap-proximity scroll-smooth">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HeroSection />
        <ProductsSection locale={locale} />
        <OpenSourceSection locale={locale} />
        <ContactSection />
        <SiteFooter />
      </main>
    </>
  );
}
