import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@assets/generated_images/abstract_dark_blue_tech_background_with_geometric_lines.png";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
              We build software that matters
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight"
          >
            Building <span className="text-gradient">Open-Source</span>,<br />
            Web & Mobile Products
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Nexa creates scalable platforms and developer tools with a focus on engineering excellence and community contribution.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8 text-lg" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
              View Our Work
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/20 hover:bg-white/5" onClick={() => document.getElementById('opensource')?.scrollIntoView({ behavior: 'smooth' })}>
              <Github className="mr-2 w-5 h-5" />
              Explore Open Source
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
