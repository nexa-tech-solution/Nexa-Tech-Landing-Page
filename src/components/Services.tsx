import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import cubeLeg from "../assets/cube-leg.png";

type CoreValue = {
  title: string;
  description: string;
  icon: JSX.Element;
};

const coreValues: CoreValue[] = [
  {
    title: "Privacy & Data Ownership",
    description:
      "Your data stays on your device. No accounts, no tracking, and no unwanted uploads.",
    icon: <WalletIcon />,
  },
  {
    title: "Speed & Reliability",
    description:
      "Snappy performance with consistent results, designed to work smoothly even offline.",
    icon: <MagnifierIcon />,
  },
  {
    title: "Simplicity & Accessibility",
    description:
      "Clean interfaces, focused flows, and thoughtful details that make everyday tasks effortless.",
    icon: <ChartIcon />,
  },
];

export const Services = () => {
  return (
    <section id="values" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
              Built on Core Values
            </span>{" "}
            that respect people first
          </h2>

          <p className="text-muted-foreground text-lg mt-4 mb-8">
            Everything we create is guided by privacy, speed, and simplicity.
            These principles shape our decisions from design to engineering.
          </p>

          <div className="flex flex-col gap-8">
            {coreValues.map(({ icon, title, description }) => (
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
              href="https://play.google.com/store/apps/details?id=com.nexa.qr_code"
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              See ScanQR on Google Play
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.nexa.easy_math_calculator"
              target="_blank"
              rel="noreferrer noopener"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              See Easy Math Calculator
            </a>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-8">
          <img
            src={cubeLeg}
            className="w-[280px] md:w-[420px] lg:w-[520px] object-contain"
            alt="Brand visual"
          />
        </div>
      </div>
    </section>
  );
};
