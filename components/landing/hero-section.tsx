import BoomerangVideoBg from "@/components/landing/boomerang-video-bg";
import HeroCopy from "@/components/landing/hero-copy";
import { bgVideoUrl } from "@/lib/site";

export default async function HeroSection() {
  return (
    <section
      id="mission"
      className="relative w-full min-h-screen sm:h-screen overflow-hidden snap-start"
      aria-labelledby="hero-heading"
    >
      <BoomerangVideoBg
        src={bgVideoUrl}
        className="absolute inset-0 w-full h-full"
      />
      <HeroCopy />
    </section>
  );
}
