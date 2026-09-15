import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const links = [
  { href: "technology", label: "Ecosystem" },
  { href: "performance", label: "Methodology" },
  { href: "commercial", label: "Viability" },
  { href: "algae", label: "Algae" },
  { href: "roadmap", label: "Roadmap" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5" : "py-5"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border transition-all duration-500 container-px ${
          scrolled
            ? "glass border-border/60 shadow-soft py-2.5"
            : "border-transparent bg-transparent py-3"
        }`}
      >
        <a href="#top" aria-label="SWAMN home" className="transition-transform hover:scale-105">
          <Logo size={26} />
        </a>
        <nav className="hidden md:flex items-center gap-9 text-sm text-muted-foreground">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={`#${l.href}`}
                className={`relative transition-colors hover:text-navy ${isActive ? "text-navy" : ""}`}
              >
                {isActive && (
                  <span aria-hidden className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-aqua" />
                )}
                {l.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/join"
            className="hidden sm:inline-flex h-9 items-center rounded-full bg-navy px-4 text-xs font-medium tracking-wide text-primary-foreground transition-all hover:bg-navy-deep"
          >
            Join the Mission
          </Link>
          <Link
            to="/team"
            aria-label="Team login"
            className="hidden h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium tracking-wide text-navy transition-colors hover:bg-secondary sm:inline-flex"
          >
            Team login
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-navy md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`mx-auto mt-2 max-w-6xl overflow-hidden px-4 transition-all duration-300 md:hidden ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass rounded-2xl border border-border/60 p-4 shadow-soft">
          <nav className="flex flex-col gap-1 text-sm text-navy">
            {links.map((l) => (
              <a
                key={l.href}
                href={`#${l.href}`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/join"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-navy px-4 text-xs font-medium tracking-wide text-primary-foreground"
            >
              Join the Mission
            </Link>
            <Link
              to="/team"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-xs font-medium tracking-wide text-navy"
            >
              Team login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
