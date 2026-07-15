"use client";

import SplitText from "@/components/landing/split-text";

interface HeroHeadingProps {
  lead: string;
  accentTop: string;
  bottom: string;
  accentBottom: string;
}

export default function HeroHeading({
  lead,
  accentTop,
  bottom,
  accentBottom,
}: HeroHeadingProps) {
  const leadLen = lead.length;
  const topLen = leadLen + 1 + accentTop.length;
  const bottomLen = bottom.length;

  return (
    <h1
      id="hero-heading"
      className="font-heading font-semibold leading-[1.3] text-ink text-[1.75rem] sm:text-[2rem] md:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] max-w-6xl tracking-tight"
    >
      <SplitText baseDelay={100} charDelay={25}>
        {lead}
      </SplitText>{" "}
      <SplitText className="text-heading" baseDelay={100 + leadLen * 25 + 25} charDelay={25}>
        {accentTop}
      </SplitText>
      <br className="hidden sm:block" />{" "}
      <SplitText baseDelay={100 + topLen * 25 + 50} charDelay={25}>
        {bottom}
      </SplitText>{" "}
      <SplitText
        className="text-heading"
        baseDelay={100 + (topLen + bottomLen + 1) * 25 + 75}
        charDelay={25}
      >
        {accentBottom}
      </SplitText>
    </h1>
  );
}
