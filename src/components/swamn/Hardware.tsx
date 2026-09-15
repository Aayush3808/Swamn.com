import { SectionHeader } from "./SectionHeader";
import hwPi from "@/assets/hw-pi.jpg";
import hwCamera from "@/assets/hw-camera.jpg";
import hwSolar from "@/assets/hw-solar.jpg";

const hardware = [
  { title: "Raspberry Pi 5", tag: "Compute", desc: "Quad-core onboard brain orchestrating perception and decision logic.", img: hwPi },
  { title: "Pi Camera Module v2", tag: "Vision", desc: "High-resolution imaging feeding the AI detection pipeline.", img: hwCamera },
  { title: "Solar Charging Setup", tag: "Power", desc: "Off-grid renewable energy with battery management and docking.", img: hwSolar },
];

const more = [
  { title: "ESP32 Modules", tag: "Sensor mesh" },
  { title: "GPS Telemetry", tag: "Navigation" },
  { title: "Waterproof Motors", tag: "Propulsion" },
  { title: "Collection Mechanism", tag: "Recovery" },
];

export const Hardware = () => (
  <section className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Hardware & Engineering"
        title={<>Engineering the <span className="h-serif text-gradient">system</span></>}
        description="Every component selected for resilience, repairability, and real-world deployment — assembled into a coherent, sustainable platform."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {hardware.map((h, i) => (
          <article key={h.title} className="reveal group card-premium overflow-hidden" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <img src={h.img} alt={h.title} loading="lazy" width={1024} height={768}
                   className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-7">
              <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">{h.tag}</div>
              <h3 className="mt-2 h-display text-xl text-navy">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="reveal mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {more.map((m) => (
          <div key={m.title} className="bg-card p-6 transition-colors hover:bg-secondary/60">
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">{m.tag}</div>
            <div className="mt-2 h-display text-base text-navy">{m.title}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
