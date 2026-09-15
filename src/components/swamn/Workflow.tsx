import { SectionHeader } from "./SectionHeader";

const steps = [
  { n: "01", title: "Capture", desc: "Continuous live visual monitoring of the surface." },
  { n: "02", title: "Detect", desc: "Intelligent classification isolates plastic from noise." },
  { n: "03", title: "Navigate", desc: "Coordinated movement converges toward the target." },
  { n: "04", title: "Collect", desc: "Surface mechanism gathers the floating waste." },
  { n: "05", title: "Return", desc: "Autonomous docking for offload and recharge." },
];

export const Workflow = () => (
  <section className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Workflow"
        title={<>From detection to <span className="h-serif text-gradient">collection</span></>}
        description="A single elegant loop powers every cleanup cycle — designed for reliability, efficiency, and uninterrupted environmental operation."
      />

      <div className="reveal mt-16 hidden md:block">
        <div className="relative">
          <div aria-hidden className="absolute left-[6%] right-[6%] top-[28px] h-px bg-gradient-to-r from-transparent via-aqua/60 to-transparent" />
          <ol className="relative grid grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <li key={s.n} className="text-center">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-soft">
                  <span className="h-display text-sm text-navy">{s.n}</span>
                  {i === 0 && <span aria-hidden className="absolute inset-0 rounded-full animate-pulse-ring" />}
                </div>
                <h4 className="mt-5 h-display text-lg text-navy">{s.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <ol className="reveal mt-12 md:hidden space-y-4">
        {steps.map((s) => (
          <li key={s.n} className="card-premium flex gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-secondary">
              <span className="h-display text-xs text-navy">{s.n}</span>
            </div>
            <div>
              <h4 className="h-display text-base text-navy">{s.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
