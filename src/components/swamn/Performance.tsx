import { SectionHeader } from "./SectionHeader";

const stages = [
  { t: "Patrol & Detection", d: "Aggregation Bots autonomously patrol assigned zones while onboard AI analyses live video and sensor data to locate elevated debris density." },
  { t: "Containment Deployment", d: "On detecting a hotspot, the bot deploys its U-shaped boom from the rear chamber, expanding 50–60 m wide across the surface." },
  { t: "Waste Aggregation", d: "Moving forward at low speed, the vessel uses hydrodynamic flow to passively funnel floating debris into the containment zone — no suction, no conveyors." },
  { t: "Autonomous Sealing", d: "Once fill level is reached, neodymium magnets at both ends connect automatically, sealing the boom into a self-contained floating pod." },
  { t: "Pod Release & Continued Ops", d: "The sealed pod is released and broadcasts its GPS position. The Aggregation Bot deploys a fresh boom and immediately resumes cleanup." },
  { t: "Retrieval & Transport", d: "A Retrieval Bot homes in on the pod's beacon, docks via magnetic connectors, and tows it to the nearest shore recovery or recycling station." },
];

export const Performance = () => (
  <section id="performance" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Methodology"
        title={<>How SWAMN <span className="h-serif text-gradient">actually works</span></>}
        description="Six continuous stages that run quietly in the background — cleaning a waterway while the city around it sleeps, wakes, or goes about its day."
      />

      <div className="relative mx-auto mt-16 max-w-3xl">
        {/* Vertical connector line */}
        <div aria-hidden className="pointer-events-none absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-aqua/60 via-border to-transparent md:left-1/2 md:-translate-x-1/2" />

        <ol className="space-y-10">
          {stages.map((c, i) => (
            <li
              key={c.t}
              className={`reveal relative md:flex md:items-center md:gap-10 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Dot */}
              <span
                aria-hidden
                className="absolute left-[7px] top-3 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-aqua shadow-glow md:left-1/2 md:-translate-x-1/2"
              />

              {/* Card */}
              <div className={`card-premium ml-12 p-6 md:ml-0 md:w-[calc(50%-2.5rem)] ${i % 2 === 1 ? "md:text-right" : ""}`}>
                <div className={`flex items-center gap-3 ${i % 2 === 1 ? "md:justify-end" : ""}`}>
                  <span aria-hidden className="h-2 w-2 rounded-full bg-aqua" />
                  <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                    Stage {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="mt-4 h-display text-xl text-navy">{c.t}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>

              {/* Spacer for opposite column on desktop */}
              <div aria-hidden className="hidden md:block md:w-[calc(50%-2.5rem)]" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
