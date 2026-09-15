import { SectionHeader } from "./SectionHeader";

const adaptations = [
  {
    t: "Fine-mesh skirt",
    d: "Standard skirt replaced with 0.5–1 mm fine-mesh, adjustable to 0.3–0.8 m depth to match bloom layer thickness — captures algae biomass while letting water drain.",
  },
  {
    t: "Hyperspectral AI detection",
    d: "Optical sensors trained on algae spectral signatures distinguish toxic cyanobacteria from benign algae and aquatic plants, enabling species-specific targeting.",
  },
  {
    t: "Algae-specific sealed pod",
    d: "Enclosed pod with mesh floor and airtight cover; HDPE-lined interior resists cyanotoxin leaching during transit to shore.",
  },
  {
    t: "GPS bloom density mapping",
    d: "AI maps bloom density and extent in real time, building heatmaps that direct fleet routing for maximum removal per kWh.",
  },
];

const lakes = ["Dal Lake, Kashmir", "Hussain Sagar, Hyderabad", "Powai Lake, Mumbai", "Bellandur Lake, Bengaluru"];

export const Algae = () => (
  <section id="algae" className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Algae Removal & Recycling"
        title={<>The same architecture, <span className="h-serif text-gradient">tuned for algal blooms</span></>}
        description="SWAMN wasn't originally designed with algae in mind — but the core collection mechanism is already most of the way there. A few targeted upgrades turn the fleet into a bloom-harvesting platform without a new vehicle."
      />

      {/* Problem strip */}
      <div className="reveal mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-card p-7 md:p-9">
        <div className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">The problem at scale</div>
        <p className="mt-3 text-base leading-relaxed text-navy/85">
          Dissolved-oxygen collapse and fish kills. Cyanotoxins lethal to livestock and dangerous in drinking water.
          Sunlight blocked from submerged plants. Methane and CO₂ from decomposing mats. Tourism, fisheries and
          waterfront livelihoods all degraded.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {lakes.map((l) => (
            <span key={l} className="rounded-full border border-border px-3 py-1 text-xs text-navy/75">{l}</span>
          ))}
        </div>
      </div>

      {/* Adaptations */}
      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {adaptations.map((a, i) => (
          <div key={a.t} className="reveal card-premium p-7" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-aqua">Adaptation 0{i + 1}</div>
            <h3 className="mt-3 h-display text-xl text-navy">{a.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.d}</p>
          </div>
        ))}
      </div>

      {/* Safety note */}
      <p className="reveal mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
        Onboard AI classifies bloom toxicity before collection. Pods arrive tagged hazardous or safe.
        Workers handling cyanobacteria use PPE and trained protocols. Every batch of digester effluent is
        pH-tested before going anywhere near farmland.
      </p>
    </div>
  </section>
);
