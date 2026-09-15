import { SectionHeader } from "./SectionHeader";

const items = [
  {
    c: "Large-scale boom deployment in waves",
    r: "Boom twist, tangle or asymmetric expansion in rough water",
    m: "Anti-twist spool systems; segmented flexible boom design",
  },
  {
    c: "Autonomous sealing reliability",
    r: "Neodymium magnets misaligning under cross-currents",
    m: "Hybrid sealing — magnet plus mechanical latch backup; wave-damped hull",
  },
  {
    c: "Marine-life safety",
    r: "Skirt entanglement risk for aquatic fauna",
    m: "Open-bottom skirt; AI-based obstacle detection with automated abort",
  },
  {
    c: "Energy supply in overcast conditions",
    r: "Solar output insufficient for round-the-clock operation",
    m: "High-capacity battery buffers; reduced-function low-power mode",
  },
  {
    c: "Communication range in remote zones",
    r: "Loss of coordination signal between units",
    m: "LoRa long-range mesh with store-and-forward; autonomous fallback patrol",
  },
];

export const Challenges = () => (
  <section id="challenges" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Challenges & Mitigations"
        title={<>Honest about what we <span className="h-serif text-gradient">haven't solved yet</span></>}
        description="Every engineering project has problems it has not fully solved, and SWAMN is no different. Here are the known risks and the design choices being built to address them."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <article
            key={it.c}
            className="reveal card-premium p-7"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Challenge</div>
            <h3 className="mt-3 h-display text-lg text-navy">{it.c}</h3>
            <div className="mt-5 border-t border-border pt-5">
              <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Risk</div>
              <p className="mt-1.5 text-sm text-navy/80">{it.r}</p>
            </div>
            <div className="mt-4">
              <div className="text-[0.65rem] uppercase tracking-[0.22em] text-aqua">Mitigation</div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{it.m}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
