import { SectionHeader } from "./SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What exactly is SWAMN?",
    a: "SWAMN — the Autonomous Marine Waste Aggregation and Retrieval Ecosystem — is a three-component fleet of Aggregation Bots, self-sealing Containment Pods and Retrieval Bots that clean rivers, harbours, urban lakes and flood-affected zones around the clock.",
  },
  {
    q: "Why split the system into three units instead of one robot?",
    a: "Role separation. The Aggregation Bot never carries waste, the Retrieval Bot is purpose-built for towing, and the pods need no power at all. This keeps each unit lean, dramatically lowers cost per tonne recovered, and enables true 12-hour operation.",
  },
  {
    q: "How does the autonomous sealing work?",
    a: "Once onboard AI detects that the U-shaped containment boom is full, high-strength neodymium magnets at both ends connect automatically, closing it into a sealed floating pod that broadcasts its GPS location for retrieval.",
  },
  {
    q: "Is it safe for marine and aquatic life?",
    a: "Yes. The 0.5 m submerged skirt deliberately has no bottom, reducing entanglement risk, and AI-based obstacle detection triggers an automated abort if fauna is detected near the boom.",
  },
  {
    q: "Where will SWAMN be deployed?",
    a: "Pilot zones include the Ganga, Yamuna and Godavari, followed by harbours, urban lakes and flood-response deployments — scaling toward open-water and coastal applications.",
  },
  {
    q: "How does it pay for itself?",
    a: "Recovered PET and HDPE fetch ₹6,000–15,000 per tonne, coconut shells become activated carbon, and ceremonial flowers turn into natural dyes and compost. Combined with municipal contracts, CSR funding and Namami Gange schemes, the river funds its own cleanup.",
  },
  {
    q: "How can I support or join the mission?",
    a: "Use the Join the Mission button to send us a message, suggest an idea, or apply to join the team. Anything you submit goes straight to support@swamn.com.",
  },
];

export const FAQ = () => (
  <section id="faq" className="relative py-28 md:py-36">
    <div className="container">
      <SectionHeader
        eyebrow="FAQ"
        title={
          <>
            Frequently <span className="h-serif text-gradient">asked</span>
          </>
        }
        description="Quick answers about SWAMN, the team, and how to get involved."
      />

      <div className="mx-auto mt-14 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="reveal rounded-2xl border border-border bg-card px-6 shadow-card"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <AccordionTrigger className="text-left text-base font-medium text-navy hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);
