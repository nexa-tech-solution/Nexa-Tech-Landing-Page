export default function Brand() {
  return (
    <div className="flex items-center gap-2 text-ink-soft">
      <img
        src="/favicon.png"
        alt="Nexa Tech logo"
        width={32}
        height={32}
        className="h-8 w-8 shrink-0"
        loading="eager"
        decoding="async"
      />
      <span className="hidden font-heading text-lg font-semibold tracking-tight sm:inline sm:text-xl md:text-2xl">
        Nexa Tech
      </span>
    </div>
  );
}
