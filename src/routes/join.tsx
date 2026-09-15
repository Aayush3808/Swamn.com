import { useState, FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/swamn/Logo";

export const Route = createFileRoute("/join")({
 head: () => ({ meta: [
  { title: "Join the Mission — SWAMN" }, { name: "description", content: "Partner, sponsor, or join SWAMN's mission for cleaner waterways." },
  { property: "og:title", content: "Join the Mission — SWAMN" }, { property: "og:description", content: "Partner, sponsor, or join SWAMN's mission for cleaner waterways." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }
 ]}), component: Join,
});

function Join() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("suggestion");
  const [benefit, setBenefit] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      intent === "join"
        ? `Joining SWAMN — ${name}`
        : `Suggestion for SWAMN — ${name}`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nIntent: ${
        intent === "join" ? "Wants to join SWAMN" : "Suggestion / Idea"
      }\n\nHow they can benefit SWAMN:\n${benefit}\n\nMessage:\n${message}\n`
    );
    window.location.href = `mailto:support@swamn.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero" />
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-aqua opacity-25 blur-3xl" />

      <header className="relative z-10 container flex items-center justify-between py-6">
        <Link to="/" aria-label="SWAMN home">
          <Logo size={26} />
        </Link>
        <Link
          to="/"
          className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-navy transition-colors hover:bg-secondary"
        >
          ← Back home
        </Link>
      </header>

      <section className="relative z-10 container pb-24 pt-10 md:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
            Join the Mission
          </div>
          <h1 className="h-display text-4xl text-navy md:text-5xl">
            Help shape <span className="h-serif text-gradient">cleaner waters</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Share an idea, suggest an improvement, or tell us you want to join SWAMN —
            and how you can contribute. Your message goes directly to{" "}
            <span className="text-navy">support@swamn.com</span>.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-card p-7 shadow-card md:p-10"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Your name
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-navy/40"
                placeholder="XYZ Name"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-navy/40"
                placeholder="xyz@gmail.com"
              />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              I'd like to
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { v: "suggestion", l: "Share a suggestion" },
                { v: "join", l: "Join the SWAMN team" },
              ].map((o) => (
                <label
                  key={o.v}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition-all ${
                    intent === o.v
                      ? "border-navy bg-navy text-primary-foreground"
                      : "border-border bg-background text-navy hover:border-navy/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="intent"
                    value={o.v}
                    checked={intent === o.v}
                    onChange={() => setIntent(o.v)}
                    className="sr-only"
                  />
                  {o.l}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-6 block">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              How can you benefit SWAMN?
            </span>
            <textarea
              required
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              maxLength={1000}
              rows={3}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-navy/40"
              placeholder="Skills, experience, or ideas you bring to the mission."
            />
          </label>

          <label className="mt-5 block">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Your message
            </span>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              rows={5}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-navy/40"
              placeholder="Tell us about your idea, suggestion, or why you want to join."
            />
          </label>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-navy px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-navy-deep shadow-glow"
            >
              Send message →
            </button>
            <a
              href="mailto:support@swamn.com"
              className="inline-flex h-12 items-center px-2 text-sm font-medium text-navy/80 hover:text-navy"
            >
              Or email us directly
            </a>
          </div>

          {sent && (
            <p className="mt-5 text-xs text-muted-foreground">
              Your email app should now open with your message ready to send to support@swamn.com.
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
