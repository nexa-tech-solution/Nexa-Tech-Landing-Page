import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { HeroCards } from "./HeroCards";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-8">
        <main className="text-5xl md:text-6xl font-bold leading-tight">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#06B6D4] text-transparent bg-clip-text">
              Nexa Tech
            </span>{" "}
            product platform
          </h1>{" "}
          for{" "}
          <span className="inline bg-gradient-to-r from-[#22d3ee] via-[#06b6d4] to-[#0891b2] text-transparent bg-clip-text">
            modern teams
          </span>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Launch, scale, and monitor your apps in one place. Nexa Tech unifies
          workflow automation, analytics, and customer experiences into a single
          product.
        </p>

        <ul className="grid gap-3 text-left md:w-10/12 mx-auto lg:mx-0">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <span className="text-base text-muted-foreground">
              No-code automations with developer escape hatches
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <span className="text-base text-muted-foreground">
              Real-time dashboards and anomaly alerts
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <span className="text-base text-muted-foreground">
              Enterprise SSO, audit trails, and role policies
            </span>
          </li>
        </ul>

        <div className="flex flex-col md:flex-row gap-4">
          <Button className="w-full md:w-1/3">Book a demo</Button>
          <a
            href="#references"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Show references
          </a>
          <a
            href="/docs"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "ghost",
            })}`}
          >
            Product docs
          </a>
        </div>
      </div>

      <div className="z-10">
        <HeroCards />
      </div>

      <div className="shadow" />
    </section>
  );
};
