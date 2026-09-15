import { FormEvent, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/swamn/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, getToken } from "@/lib/team-api";

export const Route = createFileRoute("/team/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password — SWAMN Team" },
      { name: "description", content: "Choose a new password for your SWAMN team account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Set a New Password — SWAMN Team" },
      { property: "og:description", content: "Choose a new password for your SWAMN team account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MemberResetPassword,
});

function MemberResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) setReady(true);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Both passwords need to match.");
      return;
    }
    setLoading(true);
    try {
      await api("/api/auth/password", { method: "POST", body: JSON.stringify({ password }) });
    } catch {
      setError("Please sign in again, then set a new password. Resets are otherwise handled by your administrator.");
      setLoading(false);
      return;
    }
    setLoading(false);
    navigate({ to: "/team/files", replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80">
        <div className="container flex items-center justify-between py-5">
          <Link to="/" aria-label="SWAMN home">
            <Logo size={26} />
          </Link>
          <Link to="/team" className="text-sm text-muted-foreground hover:text-navy">
            Back to sign in
          </Link>
        </div>
      </header>

      <section className="container max-w-md py-16">
        <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <LockKeyhole className="h-4 w-4 text-aqua" /> Account recovery
        </div>
        <h1 className="h-display text-4xl text-navy">Set a new password</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {ready
            ? "Choose a new password for your SWAMN team account."
            : "Open this page from the reset link in your email to continue."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!ready || loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              disabled={!ready || loading}
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={!ready || loading} className="w-full rounded-full">
            {loading ? "Saving…" : "Save new password"}
          </Button>
        </form>
      </section>
    </main>
  );
}
