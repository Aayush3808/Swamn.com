import { SectionHeader } from "./SectionHeader";

const items = [
  {
    t: "Oil Spill Containment",
    d: "The containment pod mechanism can be adapted with absorbent boom materials for oil and chemical spill response in coastal waters.",
  },
  {
    t: "Algae Bloom Harvesting",
    d: "Modified skirt depth and AI detection models enable targeted removal of surface algal blooms in freshwater lakes.",
  },
  {
    t: "Underwater Debris Extension",
    d: "Future bot variants may combine surface collection with shallow underwater debris retrieval arms.",
  },
  {
    t: "International Deployment",
    d: "Directly applicable to river systems and coastal zones across South & Southeast Asia, Africa and Latin America.",
  },
  {
    t: "Environmental Research Platform",
    d: "Sensor arrays on deployed units can monitor water quality, temperature, pH and microplastic density — feeding live data to research databases.",
  },
];

export const FutureScope = () => (
  <section id="future" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Future Scope"
        title={<>Where the platform <span className="h-serif text-gradient">goes next</span></>}
        description="The same architecture extends well beyond plastic. Each direction below is a natural adaptation of the deployable boom, the autonomous closure mechanism, and the floating-pod logistics model."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div
            key={it.t}
            className="reveal card-premium p-7"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
              Direction {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-3 h-display text-xl text-navy">{it.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
