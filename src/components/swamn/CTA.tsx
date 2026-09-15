import { Link } from "@tanstack/react-router";

export const CTA = () => (
  <section id="cta" className="relative overflow-hidden py-28 md:py-36">
    <div aria-hidden className="absolute inset-0 bg-navy" />
    {/* Animated mesh */}
    <div aria-hidden className="absolute inset-0 bg-mesh opacity-50 animate-mesh-shift" />
    <div aria-hidden className="absolute inset-0 opacity-60"
         style={{ background: "radial-gradient(60% 60% at 50% 0%, hsl(var(--aqua)/0.55), transparent 70%)" }} />
    <div aria-hidden className="absolute -bottom-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full opacity-30 blur-3xl animate-float-slow"
         style={{ background: "hsl(var(--sky))" }} />

    <div className="container relative">
      <div className="reveal mx-auto max-w-3xl text-center text-primary-foreground">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em]">
          <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
          Join SWAMN
        </div>
        <h2 className="h-display text-4xl md:text-6xl">
          Be part of a <span className="h-serif italic text-aqua">cleaner tomorrow.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
          SWAMN is building intelligent systems for cleaner, smarter, and more sustainable
          aquatic ecosystems. The mission is open — collaborators welcome.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="mailto:support@swamn.com"
             className="inline-flex h-12 items-center rounded-full bg-primary-foreground px-6 text-sm font-medium text-navy transition-transform hover:-translate-y-0.5">
            Contact Team
          </a>
          <Link to="/join"
             className="inline-flex h-12 items-center rounded-full border border-primary-foreground/30 px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10">
            Join the Mission
          </Link>
          <a href="#impact"
             className="inline-flex h-12 items-center px-2 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground">
            Explore the vision →
          </a>
        </div>
      </div>
    </div>
  </section>
);
