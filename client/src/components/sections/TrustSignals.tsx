import { motion } from "framer-motion";
import { BadgeCheck, Layers3, Rocket, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const capabilities = [
  {
    key: "open_source",
    icon: Layers3,
  },
  {
    key: "web_platforms",
    icon: Rocket,
  },
  {
    key: "mobile_apps",
    icon: Smartphone,
  },
];

const stats = [
  { key: "products" },
  { key: "stores" },
  { key: "delivery" },
];

export default function TrustSignals() {
  const { t } = useTranslation();

  return (
    <section className="relative -mt-10 pb-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[2rem] border border-border bg-white/90 p-6 shadow-xl shadow-primary/5 backdrop-blur-xl md:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                <BadgeCheck className="h-4 w-4" />
                {t("trust.badge")}
              </div>
              <h2 className="max-w-2xl text-2xl font-heading font-bold text-foreground md:text-3xl">
                {t("trust.title")}
              </h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:min-w-[420px]"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.key}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="card-sheen rounded-2xl border border-border bg-secondary/40 px-4 py-4 text-center"
                >
                  <div className="text-2xl font-heading font-bold text-foreground">
                    {t(`trust.stats.${stat.key}.value`)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t(`trust.stats.${stat.key}.label`)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-4 md:grid-cols-3"
          >
            {capabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.key}
                  variants={itemVariants}
                  whileHover={{ y: -6, rotateX: 1.5 }}
                  className="card-sheen hover-lift rounded-2xl border border-border bg-background p-5"
                >
                  <motion.div
                    whileHover={{ rotate: -6, scale: 1.05 }}
                    className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {t(`trust.capabilities.${item.key}.title`)}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t(`trust.capabilities.${item.key}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
