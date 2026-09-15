import { SectionHeader } from "./SectionHeader";

const items = [
  "Selected among 1.5 lakh student innovations at IIT Guwahati",
  "Registered participant for IIT Delhi innovation competition",
  "INSPIRE Awards — District Level Recognition",
  "Self-initiated student innovation — independently designed and built",
  "Autonomous cleanup prototype successfully demonstrated",
];

export const Achievements = () => (
  <section className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Recognition"
        title={<>Recognition & <span className="h-serif text-gradient">achievements</span></>}
        description="Validated, recognized, and supported by India's leading innovation ecosystems."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div key={it} className="reveal card-premium group p-7 transition-all hover:-translate-y-0.5"
               style={{ transitionDelay: `${i * 50}ms` }}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-aqua text-primary-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">Milestone</div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-navy">{it}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
