import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/landing/section-header";
import ProductCard from "@/components/landing/product-card";
import { products } from "@/constants/products";

interface ProductsSectionProps {
  locale: string;
}

export default async function ProductsSection({
  locale,
}: ProductsSectionProps) {
  const t = await getTranslations("ProductsSection");

  return (
    <section
      id="products"
      className="relative w-full min-h-screen overflow-hidden snap-start"
    >
      <Image
        src="/background/background2.png"
        alt=""
        fill
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-white/36" />
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-4 py-24 sm:px-6 sm:py-28 md:px-10">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          titleClassName="text-ink-strong"
          subtitleClassName="text-copy-strong"
        />

        <div className="mx-auto mt-12 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px] [grid-auto-flow:dense]">
          {products.map((product) => {
            const span = [
              product.wide ? "md:col-span-2" : "",
              product.tall ? "md:row-span-2" : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <ProductCard
                key={product.id}
                name={product.name[locale] ?? product.name.en}
                description={
                  product.description[locale] ?? product.description.en
                }
                stack={product.stack}
                image={product.image}
                link={product.link}
                appStoreLink={product.appStoreLink}
                playStoreLink={product.playStoreLink}
                className={span}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
