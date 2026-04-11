import { Code, Server, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">
              {t("about.title_prefix")} <span className="text-primary">{t("about.title_highlight")}</span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.08, duration: 0.45 }}
              className="text-lg text-muted-foreground mb-6 leading-relaxed"
            >
              {t("about.description1")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.16, duration: 0.45 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              {t("about.description2")}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {[
              {
                icon: <Code className="w-6 h-6 text-primary" />,
                title: t("about.points.dev_first.title"),
                desc: t("about.points.dev_first.desc")
              },
              {
                icon: <Server className="w-6 h-6 text-primary" />,
                title: t("about.points.scalable.title"),
                desc: t("about.points.scalable.desc")
              },
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: t("about.points.community.title"),
                desc: t("about.points.community.desc")
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4, y: -4 }}
                className="card-sheen flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: -8, scale: 1.06 }}
                  className="mt-1 p-2 bg-primary/10 rounded-md"
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h3 className="font-bold mb-1 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
