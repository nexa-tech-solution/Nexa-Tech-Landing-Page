import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import heroBg from "@assets/generated_images/dark_digital_circuit_board_background_with_neon_green_glowing_lines.png";

export default function Hero() {
  const { t } = useTranslation();
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay - Adjusted for Light Mode */}
      <div className="absolute inset-0 z-0">
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
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium tracking-wide shadow-sm">
              {t("hero.badge")}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight text-foreground"
          >
            {t("hero.title_prefix")} <span className="text-gradient">{t("hero.title_highlight")}</span><br />
            {t("hero.title_suffix")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8 text-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
              {t("hero.cta_primary")}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-border bg-white/50 backdrop-blur-sm hover:bg-white hover:text-primary hover:border-primary/50 shadow-sm" onClick={() => document.getElementById('opensource')?.scrollIntoView({ behavior: 'smooth' })}>
              <Github className="mr-2 w-5 h-5" />
              {t("hero.cta_secondary")}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
