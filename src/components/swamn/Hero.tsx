import { Logo } from "./Logo";
import { WordRotate } from "./WordRotate";
import heroOcean from "@/assets/hero-ocean.jpg";

const stats = [
  { v: "Autonomous", l: "Self-navigating operation" },
  { v: "AI-Assisted", l: "Vision-based detection" },
  { v: "Solar-Powered", l: "Sustainable energy" },
  { v: "Modular", l: "Scalable by design" },
];

export const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Soft floating gradient field */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-aqua opacity-30 blur-3xl animate-float-slow" />
        <div className="absolute top-40 -left-24 h-[380px] w-[380px] rounded-full opacity-25 blur-3xl animate-drift"
             style={{ background: "hsl(var(--sky))" }} />
        <div className="absolute top-24 -right-24 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl animate-drift"
             style={{ background: "hsl(var(--teal))", animationDelay: "-6s" }} />
      </div>

      <div className="container relative">
        {/* Logo with water ripples */}
        <div className="flex flex-col items-center text-center animate-fade-up">
          <div className="relative animate-float-slow">
            {/* Ripple layers */}
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-aqua/40"
                  style={{ animation: "ripple-out 4.5s ease-out infinite" }} />
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-aqua/30"
                  style={{ animation: "ripple-out 4.5s ease-out infinite", animationDelay: "1.5s" }} />
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[132px] w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-aqua/20"
                  style={{ animation: "ripple-out 4.5s ease-out infinite", animationDelay: "3s" }} />
            <span aria-hidden className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-70"
                  style={{ background: "radial-gradient(closest-side, hsl(var(--aqua)/0.5), transparent)" }} />
            <Logo size={132} withWordmark={false} />
          </div>
          <div className="mt-6 h-display text-[1.75rem] tracking-[0.42em] text-navy">
            SWAMN
          </div>
          <div className="mt-2 text-[0.72rem] uppercase tracking-[0.32em] text-muted-foreground">
            Intelligent Ocean Systems
          </div>
        </div>

        {/* Headline */}
        <div className="mx-auto mt-12 max-w-4xl text-center animate-fade-up" style={{ animationDelay: "120ms" }}>
          <h1 className="h-display text-[2.4rem] sm:text-5xl md:text-[4.25rem] text-navy">
            Cleaner oceans through{" "}
            <WordRotate words={["intelligent systems", "autonomous fleets", "circular cleanup"]} />
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
            SWAMN is developing autonomous environmental systems that detect and collect floating
            plastic waste from water bodies — uniting AI-assisted monitoring, embedded engineering,
            and sustainable design.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#technology"
               className="group inline-flex h-12 items-center gap-2 rounded-full bg-navy px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-navy-deep shadow-glow">
              Explore Technology
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a href="#performance"
               className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-medium text-navy transition-all hover:border-navy/40 hover:bg-secondary">
              View Results
            </a>
            <a href="#team"
               className="inline-flex h-12 items-center rounded-full px-6 text-sm font-medium text-navy/80 transition-colors hover:text-navy">
              Meet the Team
            </a>
          </div>
        </div>

        {/* Hero ocean visual with animated border beam */}
        <div className="relative mx-auto mt-20 max-w-6xl animate-fade-up" style={{ animationDelay: "240ms" }}>
          <div className="border-beam relative overflow-hidden rounded-[2rem] border border-border/70 shadow-card">
            <img
              src={heroOcean}
              alt="Calm open ocean at sunrise"
              width={1920}
              height={1280}
              loading="lazy"
              decoding="async"
              className="h-[42vh] min-h-[320px] w-full object-cover md:h-[58vh]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent" />
          </div>

          {/* Stats — overlap card */}
          <div className="relative mx-auto -mt-16 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 shadow-card md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="group bg-card px-6 py-7 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary md:py-9">
                <div className="h-display text-xl text-navy md:text-2xl">{s.v}</div>
                <div className="mt-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
