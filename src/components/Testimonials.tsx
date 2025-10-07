import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star, Verified } from "lucide-react";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating?: number;
}

const storeUrl =
  "https://play.google.com/store/apps/details?id=com.nexatech.scanqr"; // update if needed

const testimonials: TestimonialProps[] = [
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

const Stars = ({ value = 5 }: { value?: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`f-${i}`}
          className="h-4 w-4 fill-green-500 text-green-500"
        />
      ))}
      {half && (
        <Star className="h-4 w-4 text-green-500">
          <title>Half star</title>
        </Star>
      )}
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold">
          Why users{" "}
          <span className="bg-gradient-to-b from-emerald-400 to-green-600 text-transparent bg-clip-text">
            love ScanQR
          </span>
        </h2>
        <p className="text-xl text-muted-foreground pt-4">
          Real feedback from people who value speed, simplicity, and privacy.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(({ image, name, userName, comment, rating = 5 }) => (
          <Card
            key={userName}
            className="bg-gradient-to-b from-white/70 to-green-50/40 dark:from-neutral-900/50 dark:to-emerald-900/20 border border-green-100 dark:border-emerald-800 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar className="ring-1 ring-green-500/20">
                <AvatarImage alt={name} src={image} />
                <AvatarFallback>
                  {name
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
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
          href={storeUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={buttonVariants({ variant: "default", size: "lg" })}
          aria-label="Get ScanQR on Google Play"
        >
          Get ScanQR on Google Play
        </a>
        <a
          href="https://www.youtube.com/shorts/SSWVFh0kB5s"
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
