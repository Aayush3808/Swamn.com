import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/useReveal";
import { Nav } from "@/components/swamn/Nav";
import { Hero } from "@/components/swamn/Hero";
import { Problem } from "@/components/swamn/Problem";
import { About } from "@/components/swamn/About";
import { Architecture } from "@/components/swamn/Architecture";
import { Workflow } from "@/components/swamn/Workflow";
import { Performance } from "@/components/swamn/Performance";
import { Impact } from "@/components/swamn/Impact";
import { Commercial } from "@/components/swamn/Commercial";
import { Algae } from "@/components/swamn/Algae";
import { Challenges } from "@/components/swamn/Challenges";
import { FutureScope } from "@/components/swamn/FutureScope";
import { Achievements } from "@/components/swamn/Achievements";
import { Team } from "@/components/swamn/Team";
import { Gallery } from "@/components/swamn/Gallery";
import { Roadmap } from "@/components/swamn/Roadmap";
import { CTA } from "@/components/swamn/CTA";
import { FAQ } from "@/components/swamn/FAQ";
import { Footer } from "@/components/swamn/Footer";
import { Chatbot } from "@/components/swamn/Chatbot";
import { ScrollProgress } from "@/components/swamn/ScrollProgress";
import { BackToTop } from "@/components/swamn/BackToTop";


export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SWAMN — Autonomous AI Cleanup for Rivers & Oceans" },
    { name: "description", content: "SWAMN deploys autonomous AI bots and self-sealing pods to clean rivers, lakes and harbours." },
    { property: "og:title", content: "SWAMN — Autonomous AI Cleanup for Rivers & Oceans" },
    { property: "og:description", content: "A three-part autonomous fleet cleaning waterways around the clock." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: Index,
});
function Index() {
  useReveal();
  return (
    <main className="min-h-screen bg-background">
      <ScrollProgress />
      <Nav />
      <Hero />
      <Problem />
      <About />
      <Architecture />
      <Workflow />
      <Performance />
      <Impact />
      <Commercial />
      <Algae />
      <Challenges />
      <Gallery />
      <Roadmap />
      <Achievements />
      <Team />
      <FutureScope />
      <CTA />
      <FAQ />
      <Footer />
      <Chatbot />
      <BackToTop />
    </main>
  );
}
