import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-2xl border bg-muted/40">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-[#7C3AED]/20 via-[#4F46E5]/20 to-[#06B6D4]/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-[#06B6D4]/15 via-[#22D3EE]/15 to-[#4F46E5]/15 blur-3xl" />
        </div>

        <div className="relative px-6 py-12">
          <div className="flex flex-col-reverse items-center md:flex-row md:items-stretch gap-10 md:gap-12">
            <img
              src={pilot}
              alt="Nexa Tech platform preview"
              className="w-[320px] md:w-[360px] shrink-0 object-contain rounded-xl ring-1 ring-foreground/10"
            />

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">About Nexa Tech</Badge>
                  <Badge>Product Platform</Badge>
                  <Badge variant="outline">Enterprise Ready</Badge>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    Build, launch, and scale
                  </span>{" "}
                  customer experiences—on one platform
                </h2>

                <p className="text-lg text-muted-foreground md:w-11/12">
                  Nexa Tech unifies workflow automation, analytics, and secure
                  customer journeys. Ship faster with no-code building blocks
                  and developer-grade extensions, governed by roles, audit
                  trails, and SSO/SAML.
                </p>

                <ul className="grid gap-3 text-sm md:text-base">
                  {[
                    "Drag-and-drop Flows with approvals and handoffs",
                    "Real-time dashboards, alerts, and anomaly detection",
                    "SDKs, webhooks, and data connectors (Jira, Slack, Stripe, S3, Postgres)",
                    "Compliance: SOC 2 Type II, ISO 27001 aligned",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="#product"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Explore product
                  </a>
                  <a
                    href="#references"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Show references
                  </a>
                </div>
              </div>

              <div className="pt-8">
                <Statistics />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
