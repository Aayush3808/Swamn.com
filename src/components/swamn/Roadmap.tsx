import { SectionHeader } from "./SectionHeader";

const phases = [
  {
    phase: "Phase 1",
    window: "0–6 months · by Nov 2026",
    title: "Core Mechanism Validation",
    points: [
      "Validate boom deployment and 50–60 m expansion in still water",
      "Test neodymium-magnet sealing reliability across current conditions",
      "Verify ESP32-S3-CAM fill-level detection and seal-trigger accuracy",
      "Demonstrate pod release and GPS beacon broadcast",
      "Complete first controlled waterway trial",
    ],
  },
  {
    phase: "Phase 2",
    window: "6–12 months · by May 2027",
    title: "AI Navigation & Autonomous Operation",
    points: [
      "YOLO-based debris detection integrated with autonomous patrol routing",
      "GPS + IMU navigation with ultrasonic obstacle avoidance",
      "LoRa mesh communication between Aggregation and Retrieval Bots",
      "Fully unmanned 8+ hour continuous operation in field conditions",
      "Solar charging validated for zero-fuel-cost ops",
    ],
  },
  {
    phase: "Phase 3",
    window: "12–18 months · by Nov 2027",
    title: "Multi-Unit Fleet Deployment",
    points: [
      "Coordinated swarm of 3+ Aggregation Bots and 1 Retrieval Bot",
      "Target environments: rivers, urban lakes, harbours",
      "Integration with municipal IoT and Smart Cities platforms",
      "Local employment and waste-sorting supply chain established",
      "Pilot recycling revenue with kabaadiwala and SHG partners",
    ],
  },
];

export const Roadmap = () => (
  <section id="roadmap" className="relative bg-soft py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="Development Roadmap"
        title={<>A three-phase path from <span className="h-serif text-gradient">prototype to fleet</span></>}
        description="Each phase builds directly on validated results from the previous. Timelines measured from current prototype state (May 2026)."
      />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {phases.map((p, i) => (
          <article
            key={p.phase}
            className="reveal card-premium relative overflow-hidden p-8"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div aria-hidden className="absolute right-6 top-6 h-display text-5xl text-aqua/15">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-aqua">{p.phase}</div>
            <div className="mt-1 text-xs text-muted-foreground">{p.window}</div>
            <h3 className="mt-5 h-display text-xl text-navy">{p.title}</h3>
            <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
              {p.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-sm text-navy/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-aqua" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* Patent badge */}
      <div className="reveal mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card p-7 text-center">
        <div className="text-[0.65rem] uppercase tracking-[0.32em] text-aqua">Patent Filed</div>
        <div className="mt-3 h-display text-lg text-navy">
          Autonomous Deployable Semi-Submerged Floating Waste Aggregation and Closure System for Marine Debris
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>Application No. <span className="font-medium text-navy/85">202611064509</span></span>
          <span>Filed 21 May 2026</span>
          <span>Docket No. 70488</span>
        </div>
      </div>
    </div>
  </section>
);
