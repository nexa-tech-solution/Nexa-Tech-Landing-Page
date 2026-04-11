import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";
import Hero from "@/components/sections/Hero";
import TrustSignals from "@/components/sections/TrustSignals";
import About from "@/components/sections/About";
import EditorialHighlights from "@/components/sections/EditorialHighlights";
import Portfolio from "@/components/sections/Portfolio";
import OpenSource from "@/components/sections/OpenSource";
import TechStack from "@/components/sections/TechStack";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <Seo />
      <Navbar />
      <main>
        <Hero />
        <TrustSignals />
        <Portfolio />
        <EditorialHighlights />
        <OpenSource />
        <About />
        <TechStack />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
