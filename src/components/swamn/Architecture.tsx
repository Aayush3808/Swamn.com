import { SectionHeader } from "./SectionHeader";

const layers = [
  {
    n: "01",
    title: "Aggregation Bot",
    tag: "Detect & Contain",
    desc: "An AI-powered surface vessel that patrols autonomously, identifies floating debris in real time, and deploys a U-shaped containment boom (50–60 m wide) from its rear chamber. It never carries waste — it herds, seals, and moves on.",
    points: ["RGB cameras + ultrasonic sensing", "U-shaped hydrodynamic boom", "Autonomous magnet sealing"],
  },
  {
    n: "02",
    title: "Containment Pod",
    tag: "Self-Sealing Storage",
    desc: "A buoyant U-shaped boom with a 0.5 m submerged skirt and no bottom — minimising drag and marine-life entanglement. High-strength neodymium magnets close the loop automatically once fill threshold is reached, turning it into a GPS-broadcasting floating pod.",
    points: ["Neodymium magnet self-closure", "Open-bottom skirt for fauna safety", "Zero propulsion, zero power"],
  },
  {
    n: "03",
    title: "Retrieval Bot",
    tag: "Tow & Transport",
    desc: "A solar-powered, catamaran-inspired vessel built purely for endurance towing. It homes in on a sealed pod's GPS beacon, docks via magnetic connectors, and tows it to the nearest recovery station — while Aggregation Bots keep cleaning, uninterrupted.",
    points: ["Catamaran hull, solar drive", "GPS beacon homing", "High-endurance towing"],
  },
];

export const Architecture = () => (
  <section id="technology" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="The Ecosystem"
        title={<>A three-component <span className="h-serif text-gradient">cleanup ecosystem</span></>}
        description="SWAMN is not a single robot — it is a team. Detection, containment and transport are split across three specialised roles that work alongside each other, enabling continuous 12-hour operation without ever stopping to ferry waste back to shore."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {layers.map((l, i) => (
          <article
            key={l.n}
            className="reveal group relative card-premium overflow-hidden p-8 transition-all duration-500 hover:-translate-y-1"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aqua/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="flex items-center justify-between">
              <span className="h-display text-sm tracking-[0.22em] text-muted-foreground">{l.n}</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {l.tag}
              </span>
            </div>
            <h3 className="mt-6 h-display text-2xl text-navy">{l.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l.desc}</p>
            <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
              {l.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-navy/90">
                  <span className="h-1 w-1 rounded-full bg-aqua" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);
