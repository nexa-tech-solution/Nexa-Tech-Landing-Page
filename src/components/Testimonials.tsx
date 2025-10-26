import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Star, Verified } from "lucide-react";

type Testimonial = {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating?: number;
};

const APP_NAME = "Nexa";
const DEMO_URL = "#demo";
const CONTACT_URL = "#contact";

const testimonials: Testimonial[] = [
  {
    image: "https://i.pravatar.cc/150?img=5",
    name: "Jayden Tran",
    userName: "@jayden.pm",
    comment:
      "We launched a lucky-draw campaign in hours, not weeks. QR check-in, prize tiers, and live winner feed were plug-and-play.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=16",
    name: "Eunji Park",
    userName: "@eunji.ops",
    comment:
      "Multi-language flows and kiosk mode just worked. Staff only needed a short brief—UI is clean and obvious.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=28",
    name: "Kenji Takahashi",
    userName: "@kenji.dev",
    comment:
      "The real-time analytics are gold—unique scans, winners, conversions. Exports go straight to our CRM.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=37",
    name: "Sofia Martins",
    userName: "@sofia.m",
    comment:
      "Offline-first at events was clutch. When the venue Wi-Fi dropped, Nexa kept scanning smoothly.",
    rating: 4.5,
  },
  {
    image: "https://i.pravatar.cc/150?img=44",
    name: "Arjun Mehta",
    userName: "@arjunm",
    comment:
      "Flexible prize logic and audit-ready logs. Legal approved it in one pass thanks to clear history and controls.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=53",
    name: "Mina Park",
    userName: "@mina.p",
    comment:
      "From QR landing pages to winner modals, branding stayed consistent. Theme tokens made it painless.",
    rating: 5,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Stars({ value = 5 }: { value?: number }) {
  const v = Math.max(0, Math.min(5, value));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${v} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-green-500 text-green-500"
        />
      ))}
      {half && (
        <div className="relative h-4 w-4">
          <Star className="absolute inset-0 h-4 w-4 text-green-500" />
          <Star
            className="absolute inset-0 h-4 w-4 text-green-500"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-green-500/40" />
      ))}
    </div>
  );
}

function averageRating(list: Testimonial[]) {
  if (!list.length) return 0;
  const sum = list.reduce((s, t) => s + (t.rating ?? 5), 0);
  return Math.round((sum / list.length) * 10) / 10;
}

export const Testimonials = () => {
  const avg = averageRating(testimonials);
  const count = testimonials.length;

  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="max-w-3xl space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">
          Why users{" "}
          <span className="bg-gradient-to-b from-green-400 to-green-700 text-transparent bg-clip-text">
            love {APP_NAME}
          </span>
        </h2>
        <p className="text-xl text-muted-foreground">
          Real feedback from teams running QR campaigns, lucky draws, and
          on-site activations.
        </p>
        <div className="flex items-center gap-3 pt-1">
          <Badge variant="secondary" className="text-sm">
            {avg} / 5
          </Badge>
          <Stars value={avg} />
          <span className="text-sm text-muted-foreground">
            ({count}+ reviews)
          </span>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(({ image, name, userName, comment, rating = 5 }) => (
          <Card
            key={userName}
            className="bg-gradient-to-b from-white/70 to-green-50/40 dark:from-neutral-900/50 dark:to-green-900/20 border border-green-100 dark:border-green-800 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar className="ring-1 ring-green-500/20">
                <AvatarImage alt={name} src={image} loading="lazy" />
                <AvatarFallback>{initials(name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <Badge variant="secondary" className="gap-1">
                    <Verified className="h-3.5 w-3.5 text-green-600" />
                    Verified
                  </Badge>
                </div>
                <CardDescription>{userName}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                “{comment}”
              </p>
              <Stars value={rating} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
        <a
          href={CONTACT_URL}
          className={buttonVariants({ variant: "default", size: "lg" })}
          aria-label={`Request a demo of ${APP_NAME}`}
        >
          Request a Demo
        </a>
        <a
          href={DEMO_URL}
          className={buttonVariants({ variant: "outline", size: "lg" })}
          aria-label={`Watch a quick demo of ${APP_NAME}`}
        >
          Watch 30s Demo
        </a>
      </div>
    </section>
  );
};
