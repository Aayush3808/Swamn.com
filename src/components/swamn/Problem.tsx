import { SectionHeader } from "./SectionHeader";

const facts = [
  { v: "14M", l: "Metric tonnes of plastic enter our oceans every year." },
  { v: "700+", l: "Marine species threatened by plastic pollution." },
  { v: "88%", l: "Of ocean surface contains traces of plastic debris." },
  { v: "1 in 3", l: "Fish caught for human consumption contains microplastics." },
];

export const Problem = () => (
  <section className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="The Problem"
        title={<>Oceans are <span className="h-serif text-gradient">drowning in plastic</span></>}
        description="Every minute, the equivalent of a truckload of plastic enters our oceans. Marine ecosystems, biodiversity, and the water systems that sustain life are being silently degraded — and the scale demands intelligent, scalable response."
      />

      <div className="reveal mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f.l} className="group bg-card p-8 transition-colors hover:bg-secondary/60">
            <div className="h-display text-5xl text-gradient">{f.v}</div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.l}</p>
          </div>
        ))}
      </div>

      <div className="reveal mx-auto mt-14 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
        Without scalable, autonomous cleanup systems, plastic accumulation will outpace marine life
        biomass within a generation. SWAMN exists to change that trajectory.
      </div>
    </div>
  </section>
);
