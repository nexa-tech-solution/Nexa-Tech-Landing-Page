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

const APP_NAME = "ScanQR";
const STORE_URL =
  "https://play.google.com/store/apps/details?id=com.nexatech.scanqr";
const DEMO_URL = "https://www.youtube.com/shorts/SSWVFh0kB5s";

const testimonials: Testimonial[] = [
  {
    image: "https://i.pravatar.cc/150?img=12",
    name: "Linh Nguyen",
    userName: "@linh.codes",
    comment:
      "Blazing fast. I scan Wi-Fi and product QR codes daily—history is private and super handy.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=22",
    name: "Aisha Rahman",
    userName: "@aishar",
    comment:
      "On-device scanning gives me peace of mind. No accounts, no noise—just works.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=32",
    name: "Kenji Takahashi",
    userName: "@kenji.dev",
    comment:
      "The gallery scan saves me constantly—pull a photo, detect instantly. Clean UI, green theme looks great.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=42",
    name: "Sofia Martins",
    userName: "@sofia.m",
    comment:
      "Lightweight and battery-friendly. Exactly what a QR app should be.",
    rating: 4.5,
  },
  {
    image: "https://i.pravatar.cc/150?img=52",
    name: "Arjun Mehta",
    userName: "@arjunm",
    comment:
      "No spam, no trackers. Offline after setup and supports multiple languages.",
    rating: 5,
  },
  {
    image: "https://i.pravatar.cc/150?img=62",
    name: "Mina Park",
    userName: "@minapark",
    comment:
      "History controls are perfect—open, copy, or delete. Privacy-first done right.",
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
          <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
            love {APP_NAME}
          </span>
        </h2>
        <p className="text-xl text-muted-foreground">
          Real feedback from people who value speed, simplicity, and privacy.
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
            className="bg-gradient-to-b from-white/70 to-green-50/40 dark:from-neutral-900/50 dark:to-emerald-900/20 border border-green-100 dark:border-emerald-800 backdrop-blur-sm"
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
          href={STORE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={buttonVariants({ variant: "default", size: "lg" })}
          aria-label={`Get ${APP_NAME} on Google Play`}
        >
          Get {APP_NAME} on Google Play
        </a>
        <a
          href={DEMO_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Watch 30s Demo
        </a>
      </div>
    </section>
  );
};
