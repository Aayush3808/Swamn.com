import { SectionHeader } from "./SectionHeader";

export const About = () => (
  <section className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="reveal">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            What is SWAMN
          </div>
          <h2 className="h-display text-4xl text-navy md:text-5xl">
            An autonomous ecosystem for{" "}
            <span className="h-serif text-gradient">cleaner waterways.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            SWAMN is the Autonomous Marine Waste Aggregation and Retrieval Ecosystem — a
            specialised team of Aggregation Bots, self-sealing Containment Pods, and Retrieval
            Bots that work in coordination across rivers, harbours, urban lakes and
            flood-affected zones. Detection, containment and transport are split into separate
            roles so each unit stays lean and the fleet can operate 12-hour shifts.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            {[
              ["Specialised", "Three-role fleet"],
              ["Continuous", "12-hour operation"],
              ["Circular", "Waste-to-worth chain"],
            ].map(([t, s]) => (
              <div key={t} className="card-premium p-4">
                <div className="font-medium text-navy">{t}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden className="reveal relative hidden lg:block">
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-aqua opacity-40 blur-3xl" />
        </div>
      </div>
    </div>
  </section>
);
