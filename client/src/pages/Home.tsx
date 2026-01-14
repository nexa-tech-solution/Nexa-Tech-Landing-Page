import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Portfolio from "@/components/sections/Portfolio";
import OpenSource from "@/components/sections/OpenSource";
import TechStack from "@/components/sections/TechStack";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <OpenSource />
        <TechStack />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
