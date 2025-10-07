import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { motion } from "framer-motion";

export const HeroCards = () => {
  return (
    <div className="relative hidden h-[520px] w-[760px] lg:flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(400px_300px_at_60%_45%,#000_20%,transparent_70%)]">
        <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-gradient-to-tr from-[#7C3AED]/25 via-[#4F46E5]/25 to-[#06B6D4]/25 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gradient-to-tr from-[#06B6D4]/20 via-[#22D3EE]/20 to-[#4F46E5]/20 blur-3xl" />
      </div>

      <motion.div
        className="absolute -top-2 left-2 w-[360px]"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="backdrop-blur-xl border-white/10 bg-white/70 dark:bg-neutral-900/60 shadow-xl">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="ring-2 ring-white/50">
              <AvatarImage alt="" src="https://i.pravatar.cc/150?img=12" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-lg">AuroraBank</CardTitle>
              <CardDescription>VP Engineering</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-[15px] leading-relaxed">
            “Nexa Tech consolidated our tooling and cut MTTR by 43%. Rollouts
            are now hours, not weeks.”
          </CardContent>
          <CardFooter>
            <a
              href="/case-studies/aurorabank"
              className={buttonVariants({ variant: "link" })}
            >
              Read case study →
            </a>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        className="absolute right-4 top-2 w-80"
        initial={{ y: -10, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        whileHover={{ y: -4 }}
      >
        <Card className="group backdrop-blur-xl border-white/10 bg-white/70 dark:bg-neutral-900/60 shadow-2xl">
          <CardHeader className="items-center pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">New</Badge>
              <Badge>Automation</Badge>
            </div>
            <CardTitle className="text-center">Nexa Flows</CardTitle>
            <CardDescription className="text-primary">
              Workflow builder for product teams
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Drag-and-drop automations with developer handoffs, approvals, and
              audit trails.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["Jira", "Slack", "Postgres", "Stripe", "Webhooks", "S3"].map(
                (i) => (
                  <Badge key={i} variant="outline" className="border-dashed">
                    {i}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <a
              href="/docs/flows"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              View Docs
            </a>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        className="absolute left-[70px] top-[168px] w-72"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="backdrop-blur-xl border-white/10 bg-white/70 dark:bg-neutral-900/60 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Starter
              <Badge variant="secondary" className="text-sm text-primary">
                Most popular
              </Badge>
            </CardTitle>
            <div>
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground"> /month</span>
            </div>
            <CardDescription>
              Everything to prototype and launch your first workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Free Trial</Button>
          </CardContent>
          <div className="mx-auto mb-4 h-px w-4/5 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          <CardFooter className="flex">
            <div className="space-y-3 text-sm">
              {[
                "Up to 5 team members",
                "10K runs / month",
                "1 production project",
              ].map((benefit) => (
                <span key={benefit} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {benefit}
                </span>
              ))}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        className="absolute -right-2 bottom-6 w-[360px]"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
        whileHover={{ y: -4 }}
      >
        <Card className="backdrop-blur-xl border-white/10 bg-white/70 dark:bg-neutral-900/60 shadow-xl">
          <CardHeader className="flex items-start gap-4">
            <div className="mt-1 rounded-2xl p-2 bg-gradient-to-tr from-[#7C3AED]/20 via-[#4F46E5]/20 to-[#06B6D4]/20">
              <LightBulbIcon />
            </div>
            <div>
              <CardTitle>Enterprise-ready</CardTitle>
              <CardDescription className="mt-2 text-[15px]">
                SSO/SAML, role policies, audit logs. SOC 2 Type II and ISO 27001
                aligned.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="flex gap-2">
              <a
                href="#references"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Show references
              </a>
              <a
                href="/security"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Security overview
              </a>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
