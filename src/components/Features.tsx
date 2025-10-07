import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "../assets/growth.png";
import image3 from "../assets/reflecting.png";
import image4 from "../assets/looking-ahead.png";

type StoreLinks = {
  playStore?: string;
  appStore?: string;
};

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const store: StoreLinks = {
  playStore: "https://play.google.com/store/apps/details?id=com.nexa.qr_code", // change to your real id
  // appStore: "https://apps.apple.com/app/id0000000000", // optional; remove if Android-only
};

const features: FeatureProps[] = [
  {
    title: "Scan all QR & Barcodes",
    description:
      "Instant, accurate scanning with your camera. Works offline after first launch.",
    image: image4,
  },
  {
    title: "Scan from Photos",
    description:
      "Pick an image from your gallery to detect QR codes—no uploads, processed on-device.",
    image: image3,
  },
  {
    title: "History & Quick Actions",
    description:
      "Auto-save scans locally. Reopen links, copy text, share, or delete anytime.",
    image,
  },
];

const featureTags: string[] = [
  "Privacy-first",
  "Works offline",
  "Multilingual",
  "Wi-Fi / Contacts / URLs",
  "Lightweight",
  "Modern UI",
  "History",
  "No sign-in",
];

export const Features = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold">
          Showcase{" "}
          <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
            ScanQR
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
          Fast, secure, and minimal QR scanner by Nexa-Tech. Scan with camera or
          from photos, keep a private history, and take action instantly.
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {featureTags.map((feature) => (
            <Badge key={feature} variant="secondary" className="text-sm">
              {feature}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {store.playStore && (
            <a
              href={store.playStore}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({
                variant: "default",
                size: "lg",
              })}
              aria-label="Get ScanQR on Google Play"
            >
              Get it on Google Play
            </a>
          )}
          {store.appStore && (
            <a
              href={store.appStore}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
              })}
              aria-label="Download ScanQR on the App Store"
            >
              Download on the App Store
            </a>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image: img }) => (
          <Card
            key={title}
            className="bg-gradient-to-b from-white/70 to-green-50/40 dark:from-neutral-900/50 dark:to-emerald-900/20 border border-green-100 dark:border-emerald-800 backdrop-blur-sm"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground">
              {description}
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-4">
              <img
                src={img}
                alt={title}
                className="w-[220px] lg:w-[300px] mx-auto"
              />

              <div className="flex gap-2">
                {store.playStore && (
                  <a
                    href={store.playStore}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={buttonVariants({
                      variant: "secondary",
                      size: "sm",
                    })}
                    aria-label={`Open ${title} on Google Play`}
                  >
                    Google Play
                  </a>
                )}
                {store.appStore && (
                  <a
                    href={store.appStore}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                    aria-label={`Open ${title} on App Store`}
                  >
                    App Store
                  </a>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/SSWVFh0kB5s"
          title="ScanQR demo"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </section>
  );
};
