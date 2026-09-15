import { SectionHeader } from "./SectionHeader";

const costs = [
  { label: "Aggregation Bot", scope: "River / Lake", v: "₹60k–70k", note: "Per unit at prototype scale" },
  { label: "Aggregation Bot", scope: "Ocean Variant", v: "₹2 Lakh", note: "Ruggedised for open-water ops" },
  { label: "Containment Pod", scope: "Passive Unit", v: "₹3k–5k", note: "No motor · No battery · Passive" },
];

export const Commercial = () => (
  <section id="commercial" className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Unit Economics"
        title={<>What each unit <span className="h-serif text-gradient">actually costs</span></>}
        description="Role separation keeps every unit lean — the pods need no power at all, which is where most of the cost savings come from."
      />

      {/* Cost cards */}
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {costs.map((c, i) => (
          <div key={c.label + c.scope} className="reveal card-premium p-8" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">{c.scope}</div>
            <div className="mt-3 h-display text-2xl text-navy">{c.label}</div>
            <div className="mt-5 h-serif text-4xl text-gradient">{c.v}</div>
            <div className="mt-2 text-xs text-muted-foreground">{c.note}</div>
          </div>
        ))}
      </div>

    </div>
  </section>
);
