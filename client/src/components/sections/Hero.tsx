import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import heroBg from "@assets/generated_images/dark_digital_circuit_board_background_with_neon_green_glowing_lines.png";

export default function Hero() {
  const { t } = useTranslation();
  const quickLinks = [
    t("hero.quick_links.web"),
    t("hero.quick_links.mobile"),
    t("hero.quick_links.opensource"),
    t("hero.quick_links.free"),
  ];
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay - Adjusted for Light Mode */}
      <div className="absolute inset-0 z-0">
        <div className="ambient-grid absolute inset-0 opacity-60" />
        <div className="mesh-orb h-56 w-56 bg-emerald-200/70 left-[8%] top-[16%]" />
        <div className="mesh-orb mesh-orb-delay h-72 w-72 bg-sky-200/60 right-[10%] top-[14%]" />
        <div className="mesh-orb mesh-orb-slow h-64 w-64 bg-amber-100/70 bottom-[12%] left-[22%]" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 grayscale invert" 
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium tracking-wide shadow-sm">
              {t("hero.badge")}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight text-foreground"
          >
            {t("hero.title_prefix")} <span className="text-gradient">{t("hero.title_highlight")}</span><br />
            {t("hero.title_suffix")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: "easeOut" }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="h-12 px-8 text-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
              {t("hero.cta_primary")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-border bg-white/50 backdrop-blur-sm hover:bg-white hover:text-primary hover:border-primary/50 shadow-sm" onClick={() => document.getElementById('opensource')?.scrollIntoView({ behavior: 'smooth' })}>
              <Github className="mr-2 w-5 h-5" />
              {t("hero.cta_secondary")}
            </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {quickLinks.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.46 + index * 0.06, duration: 0.35 }}
                className="rounded-full border border-border bg-white/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm"
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
