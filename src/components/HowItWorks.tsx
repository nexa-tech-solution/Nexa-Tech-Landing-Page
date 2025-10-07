import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";
import { motion } from "framer-motion";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Accessibility",
    description:
      "Designed with everyone in mind — simple, intuitive interfaces that make Nexa Tech accessible to all users.",
  },
  {
    icon: <MapIcon />,
    title: "Community",
    description:
      "Join a growing ecosystem of teams building together, sharing insights, and expanding innovation across industries.",
  },
  {
    icon: <PlaneIcon />,
    title: "Scalability",
    description:
      "From startups to enterprises, Nexa Tech scales seamlessly with your growth — without extra setup or complexity.",
  },
  {
    icon: <GiftIcon />,
    title: "Gamification",
    description:
      "Motivate engagement and reward progress with built-in gamification and smart interaction tracking.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          How{" "}
          <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
            Nexa Tech{" "}
          </span>
          Works Step-by-Step
        </h2>
        <p className="text-lg text-muted-foreground">
          Our platform streamlines every step — from concept to launch — helping
          your team innovate faster, smarter, and greener.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }, idx) => (
          <motion.div
            key={title}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card className="group relative bg-gradient-to-b from-white/70 to-green-50/40 dark:from-neutral-900/50 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-400/20 hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="grid gap-3 place-items-center text-xl font-semibold">
                  <div className="p-3 rounded-full bg-gradient-to-tr from-green-400/20 via-emerald-500/20 to-green-600/20 group-hover:from-green-400/40 group-hover:to-emerald-600/40 transition-all duration-300">
                    {icon}
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  {description}
                </p>
              </CardContent>

              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <a
          href="#about"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-medium shadow-lg hover:shadow-emerald-400/30 transition-all duration-300"
        >
          Learn more about Nexa Tech
        </a>
      </div>
    </section>
  );
};
