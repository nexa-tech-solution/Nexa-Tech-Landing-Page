import { Code, Server, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-24 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-foreground">
              {t("about.title_prefix")} <span className="text-primary">{t("about.title_highlight")}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t("about.description1")}
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("about.description2")}
            </p>
          </div>

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
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                <div className="mt-1 p-2 bg-primary/10 rounded-md">{item.icon}</div>
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
