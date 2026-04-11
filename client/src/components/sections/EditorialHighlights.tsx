import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const stories = [
  {
    key: "launchpad",
    accent: "bg-sky-500/10 text-sky-700",
  },
  {
    key: "apps",
    accent: "bg-emerald-500/10 text-emerald-700",
  },
  {
    key: "oss",
    accent: "bg-amber-500/10 text-amber-700",
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function EditorialHighlights() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.08),_transparent_35%),linear-gradient(to_bottom,_rgba(248,250,252,0.8),_rgba(255,255,255,1))]">
      <div className="container mx-auto px-6">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("editorial.eyebrow")}
            </div>
            <h2 className="text-3xl font-heading font-bold text-foreground md:text-5xl">
              {t("editorial.title_prefix")}{" "}
              <span className="text-primary">
                {t("editorial.title_highlight")}
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("editorial.description")}
            </p>
          </div>

          <Button
            variant="outline"
            className="gap-2 border-border bg-background hover:bg-secondary"
            onClick={() =>
              document.getElementById("products")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            {t("editorial.cta")}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </motion.div>

        <div className="grid auto-rows-fr gap-6 lg:grid-cols-3">
          {stories.map((story, index) => (
            <motion.article
              key={story.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="card-sheen group flex h-full min-h-[28rem] flex-col rounded-[1.75rem] border border-border bg-white p-6 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:border-primary/30"
            >
              <div className="mb-5 flex min-h-[3.5rem] items-start justify-between gap-3">
                <motion.span
                  whileHover={{ x: 2 }}
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${story.accent}`}
                >
                  {t(`editorial.cards.${story.key}.tag`)}
                </motion.span>
                <span className="max-w-[9rem] text-right text-sm leading-5 text-muted-foreground">
                  {t(`editorial.cards.${story.key}.meta`)}
                </span>
              </div>

              <h3 className="mb-3 min-h-[6.5rem] text-2xl font-heading font-bold text-foreground">
                {t(`editorial.cards.${story.key}.title`)}
              </h3>
              <p className="mb-6 min-h-[8.5rem] text-muted-foreground">
                {t(`editorial.cards.${story.key}.description`)}
              </p>

              <motion.div
                whileHover={{ y: -2 }}
                className="mt-auto rounded-2xl bg-secondary/45 p-4"
              >
                <div className="mb-2 text-sm font-semibold text-foreground">
                  {t(`editorial.cards.${story.key}.highlightLabel`)}
                </div>
                <div className="text-sm leading-6 text-muted-foreground">
                  {t(`editorial.cards.${story.key}.highlightValue`)}
                </div>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
