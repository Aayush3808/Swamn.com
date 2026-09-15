import { SectionHeader } from "./SectionHeader";

const sdgs = [
  { id: "14", t: "Life Below Water", d: "Direct reduction of floating plastic to protect aquatic biodiversity and food chains." },
  { id: "11", t: "Sustainable Cities", d: "Harbour and urban-lake cleanup supports liveable, healthy city environments." },
  { id: "13", t: "Climate Action", d: "Removing decomposing waste cuts methane emissions from aquatic environments." },
  { id: "09", t: "Industry & Innovation", d: "Scalable autonomous infrastructure for national waterway management." },
  { id: "12", t: "Responsible Consumption", d: "Recovered PET and HDPE feed back into a circular recycling economy." },
];

const recycling = [
  { v: "PET Plastic", t: "Becomes rPET pellets for textile fibre and new packaging — ₹8,000–15,000 per tonne." },
  { v: "HDPE Plastic", t: "Recycled into granules for pipes, buckets and furniture — ₹6,000–12,000 per tonne." },
  { v: "Coconut Shells", t: "Converted into activated carbon for water filters and charcoal briquettes — ₹20,000–40,000 per tonne." },
  { v: "Ceremonial Flowers", t: "Marigold and rose waste turned into natural dyes and vermicompost for organic farming." },
  { v: "Organic Matter", t: "Anaerobic digestion produces biogas; remaining compost feeds urban farms." },
  { v: "Local Employment", t: "Operators, sorters, recyclers and technicians — trainable in weeks, paid from the value the river itself produces." },
];

export const Impact = () => (
  <section id="impact" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Commercial Viability & Impact"
        title={<>Built to actually <span className="h-serif text-gradient">pay for itself</span></>}
        description="Environmental projects fail for two reasons: they run out of money, or nobody wants to pay for them. SWAMN is engineered with both in mind — role separation drops unit cost, and what comes out of the water funds keeping it clean. Every step of the workflow is also a job for a local community member."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {recycling.map((i, idx) => (
          <div key={i.v} className="reveal card-premium p-8" style={{ transitionDelay: `${idx * 60}ms` }}>
            <div className="h-display text-2xl text-navy">{i.v}</div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.t}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-16">
        <div className="text-center text-[0.7rem] uppercase tracking-[0.32em] text-muted-foreground">
          Aligned with United Nations Sustainable Development Goals
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {sdgs.map((s) => (
            <div key={s.id} className="group relative overflow-hidden rounded-2xl border border-border bg-navy p-7 text-primary-foreground">
              <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-aqua opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40" />
              <div className="relative">
                <div className="text-[0.65rem] uppercase tracking-[0.32em] text-primary-foreground/60">SDG {s.id}</div>
                <div className="mt-3 h-display text-xl">{s.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
