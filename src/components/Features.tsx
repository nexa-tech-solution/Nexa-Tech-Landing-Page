import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import scanqrHero from "../assets/looking-ahead.png";
import calcHero from "../assets/reflecting.png";

// Replace these with your real screenshots (PNG/JPG/WEBP)
import scanqr1 from "../assets/scanqr/1.webp";
import scanqr2 from "../assets/scanqr/2.webp";
import scanqr3 from "../assets/scanqr/3.webp";
import calc1 from "../assets/calc/1.png";
import calc2 from "../assets/calc/2.png";
import calc3 from "../assets/calc/3.png";
import calc4 from "../assets/calc/4.png";
import currencyCvt1 from "../assets/currency-converter/1.jpg";
import currencyCvt2 from "../assets/currency-converter/2.jpg";
import currencyCvt3 from "../assets/currency-converter/3.jpg";
import currencyCvt4 from "../assets/currency-converter/4.jpg";
import currencyCvt5 from "../assets/currency-converter/5.jpg";

type AppItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  playStore: string;
  tags: string[];
  youtubeDemo?: string;
  screenshots: string[];
};

const apps: AppItem[] = [
  {
    id: "scanqr",
    title: "ScanQR",
    description:
      "Fast, private QR & Barcode scanner. Works offline, saves history, and supports multiple content types.",
    image: scanqrHero,
    playStore: "https://play.google.com/store/apps/details?id=com.nexa.qr_code",
    tags: ["Privacy-first", "Offline", "No ads", "Modern UI"],
    youtubeDemo: "https://www.youtube.com/embed/SSWVFh0kB5s",
    screenshots: [scanqr1, scanqr2, scanqr3],
  },
  {
    id: "easy-math",
    title: "Easy Math Calculator",
    description:
      "Simple, intuitive, and fast calculator for everyday use.\nNo clutter, just clean math.",
    image: calcHero,
    playStore:
      "https://play.google.com/store/apps/details?id=com.nexa.easy_math_calculator",
    tags: ["Lightweight", "Elegant UI", "Free forever", "No sign-in"],
    youtubeDemo: undefined,
    screenshots: [calc1, calc2, calc3, calc4],
  },
  {
    id: "currency-converter",
    title: "Currency Converter",
    description:
      "Fun, fast currency converter with calculator, dark mode & offline power! 💸✨",
    image: calcHero,
    playStore:
      "https://play.google.com/store/apps/details?id=com.currencyunitconverter",
    tags: [
      "Currency Converter",
      "Exchange Rates",
      "Finance Calculator",
      "Money Exchange",
    ],
    youtubeDemo: undefined,
    screenshots: [
      currencyCvt1,
      currencyCvt2,
      currencyCvt3,
      currencyCvt4,
      currencyCvt5,
    ],
  },
];

function ScreenshotGrid({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((src, idx) => (
          <div className="group relative rounded-lg overflow-hidden border">
            <AspectRatio ratio={9 / 16} className="bg-white">
              <img
                src={src}
                alt={`${title} screenshot ${idx + 1}`}
                className="h-full w-full object-scale-down"
                loading="lazy"
              />
            </AspectRatio>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Features = () => {
  return (
    <section id="apps" className="container py-24 sm:py-32 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Explore{" "}
          <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
            Nexa-Tech Apps
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
          Discover lightweight, privacy-focused tools built for speed and
          simplicity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {apps.map((app) => (
          <Card
            key={app.id}
            className="bg-gradient-to-b from-white/70 to-green-50/40 dark:from-neutral-900/50 dark:to-emerald-900/20 border border-green-100 dark:border-emerald-800 backdrop-blur-sm"
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold">{app.title}</CardTitle>
              <p className="text-muted-foreground whitespace-pre-line">
                {app.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {app.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 text-sm font-medium text-muted-foreground">
                  Screenshots
                </div>
                <ScreenshotGrid images={app.screenshots} title={app.title} />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-4">
              <a
                href={app.playStore}
                target="_blank"
                rel="noreferrer noopener"
                className={buttonVariants({ variant: "default", size: "lg" })}
                aria-label={`Get ${app.title} on Google Play`}
              >
                Get it on Google Play
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
