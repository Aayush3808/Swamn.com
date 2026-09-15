interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

export const SectionHeader = ({ eyebrow, title, description, align = "center" }: SectionHeaderProps) => (
  <div className={`reveal mx-auto max-w-3xl ${align === "center" ? "text-center" : ""}`}>
    {eyebrow && (
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
        {eyebrow}
      </div>
    )}
    <h2 className="h-display text-3xl text-navy md:text-5xl">{title}</h2>
    {description && (
      <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
    )}
  </div>
);
