import { MouseEvent } from "react";
import { SectionHeader } from "./SectionHeader";

const team = [
  {
    name: "Rishi Singh",
    role: "Lead Innovator",
    sub: "Bot & Dock Designer",
    desc: "Leads the technical vision of SWAMN — designs the autonomous bot and docking model, and drives AI, embedded systems, and end-to-end engineering.",
    initials: "RS",
    email: "rishisingh@swamn.com",
    photo: "/images/team/Rishi.jpeg",
  },
  {
    name: "Vaibhav Raj",
    role: "Electronics, Mechanics and Website",
    sub: "Systems & Web",
    desc: "Builds and wires the electronics behind the bot — power, sensors, and control boards — handles the mechanical assembly, and designs and maintains the SWAMN website.",
    initials: "VR",
    email: "",
    photo: "/images/team/Vaibhav.jpeg",
  },
  {
    name: "Aayush Kumar Singh",
    role: "Branding, Media & Communications",
    sub: "Identity & Outreach",
    desc: "Shapes SWAMN's visual identity, social presence, and digital communications — building a strong, premium identity for the initiative.",
    initials: "AK",
    email: "",
  },
  {
    name: "Manan",
    role: "Mechatronics and Documentation",
    sub: "Integration & Records",
    desc: "Brings the mechanical and electronic sides together during build and testing, and keeps every design decision, test run, and result properly documented for the team.",
    initials: "MN",
    email: "",
    photo: "/images/team/Manan.jpeg",
  },
  {
    name: "Adarsh Kumar",
    role: "Team Management and HR",
    sub: "People & Operations",
    desc: "Coordinates day-to-day operations and people management at SWAMN — ensuring smooth collaboration, clear ownership, and steady progress across every workstream.",
    initials: "AK",
    email: "",
    photo: "/images/team/Adarsh.jpeg",
  },
  {
    name: "Satvik",
    role: "Pitch Handler",
    sub: "Narrative & Presentation",
    desc: "Owns SWAMN's pitch end-to-end — shapes the narrative, builds the deck, and delivers it. Translates complex engineering and real-world impact into a clear, persuasive story that resonates with judges, partners, and investors.",
    initials: "SK",
    email: "",
  },
  {
    name: "Annapurna",
    role: "Pitching and Presentation",
    sub: "",
    desc: "Leads people operations at SWAMN — onboarding, team coordination, and culture. Keeps the team aligned, motivated, and moving in sync, ensuring every member has the clarity and support they need to do their best work.",
    initials: "AN",
    email: "",
    photo: "/images/team/Annapurna.jpeg",
  },
];

const onMove = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export const Team = () => (
  <section id="team" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Team"
        title={<>The minds behind <span className="h-serif text-gradient">SWAMN</span></>}
        description="A young team of innovators building the next generation of autonomous environmental systems."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m, i) => (
          <article
            key={m.name}
            onMouseMove={onMove}
            className="reveal group card-premium spotlight-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-glow"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <div aria-hidden className="absolute inset-0 bg-aqua opacity-90" style={{ background: "var(--gradient-aqua)" }} />
              <div aria-hidden className="absolute inset-0 animate-drift opacity-30"
                   style={{ background: "radial-gradient(50% 50% at 30% 30%, hsl(0 0% 100%/0.6), transparent)" }} />
              {m.photo ? (
                <div
                  role="img"
                  aria-label={`${m.name} — ${m.role}`}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url("${m.photo}")` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <div className="h-display text-7xl text-primary-foreground/90">{m.initials}</div>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 group-hover:-translate-y-1">
                <div className="rounded-xl glass p-4">
                  <div className="h-display text-lg text-navy">{m.name}</div>
                  {m.role && (
                    <div className="text-xs text-muted-foreground">{m.sub ? `${m.role} · ${m.sub}` : m.role}</div>
                  )}
                </div>
              </div>
            </div>
            {(m.desc || m.email) && (
              <div className="p-7">
                {m.desc && <p className="text-sm leading-relaxed text-muted-foreground">{m.desc}</p>}
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className="story-link mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-navy transition-colors hover:text-aqua"
                  >
                    {m.email}
                    <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  </section>
);
