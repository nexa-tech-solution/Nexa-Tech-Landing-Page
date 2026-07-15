type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mx-auto flex max-w-4xl flex-col items-center text-center ${className}`}
    >
      <h2
        className={`text-3xl font-bold tracking-tight text-ink sm:text-4xl ${titleClassName}`}
      >
        {title}
      </h2>
      <p
        className={`mt-5 max-w-3xl text-base leading-8 text-copy sm:text-lg ${subtitleClassName}`}
      >
        {subtitle}
      </p>
    </div>
  );
}
