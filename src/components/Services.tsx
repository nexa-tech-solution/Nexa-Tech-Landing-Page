import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import cubeLeg from "../assets/cube-leg.png";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Instant QR Scanning",
    description:
      "Scan any QR or barcode in real time using your device camera. Works offline and never uploads data to the cloud.",
    icon: <MagnifierIcon />,
  },
  {
    title: "Scan from Photos",
    description:
      "Choose any image from your gallery to detect QR codes securely. All image processing is done locally.",
    icon: <WalletIcon />,
  },
  {
    title: "History & Privacy",
    description:
      "Keep your scan history private, stored only on your device. Manage, copy, or delete any scan anytime.",
    icon: <ChartIcon />,
  },
];

export const Services = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
              Smart. Secure. Simple.
            </span>{" "}
            QR Scanning with Nexa-Tech
          </h2>

          <p className="text-muted-foreground text-lg mt-4 mb-8">
            ScanQR by Nexa-Tech is a clean, privacy-first QR scanner designed
            for everyday users. Experience instant scanning, offline security,
            and complete control of your data.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card
                key={title}
                className="bg-gradient-to-b from-white/70 to-green-50/40 dark:from-neutral-900/50 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 backdrop-blur-sm"
              >
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-green-500/10 p-2 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.nexatech.scanqr"
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Get ScanQR on Google Play
            </a>

            <a
              href="https://www.youtube.com/shorts/SSWVFh0kB5s"
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Watch Demo Video
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-8">
          {/* YouTube video embed */}

          {/* Decorative image */}
          <img
            src={cubeLeg}
            className="w-[280px] md:w-[420px] lg:w-[520px] object-contain"
            alt="ScanQR visual illustration"
          />
        </div>
      </div>
    </section>
  );
};
