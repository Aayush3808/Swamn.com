import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getToken, login as teamLogin } from "@/lib/team-api";

export const MemberLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) navigate({ to: "/team/files", replace: true });
  }, [navigate]);

  const normalized = username.trim().toLowerCase();
  const validUsername = /^[a-z0-9._-]{3,40}$/.test(normalized);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!validUsername) {
      setError("Enter your assigned team username.");
      return;
    }

    setLoading(true);
    try {
      await teamLogin(normalized, password);
    } catch {
      setError("That username or password is not recognised.");
      setLoading(false);
      return;
    }

    navigate({ to: "/team/files", replace: true });
  };

  const onReset = async () => {
    setError("");
    setNotice("");
    setNotice("Password resets are handled by your team administrator in the Admin panel.");
  };

  return (
    <main className="min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-hero" />
      <header className="relative z-10 container flex items-center justify-between py-6">
        <Link to="/" aria-label="SWAMN home"><Logo size={26} /></Link>
        <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-navy">Back home</Link>
      </header>

      <section className="relative z-10 container flex min-h-[calc(100vh-96px)] items-start justify-center pb-20 pt-12 md:pt-20">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-card md:p-9">
          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-aqua" /> Team workspace
            </div>
            <h1 className="h-display text-3xl text-navy">Welcome back, team.</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sign in to open your private SWAMN files folder.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="your username" autoComplete="username" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your team password" autoComplete="current-password" className="pl-10" required />
              </div>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {notice && <p role="status" className="text-sm text-navy">{notice}</p>}
            <Button type="submit" className="h-11 w-full rounded-full" disabled={loading}>
              {loading ? "Opening workspace…" : "Open my files"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
            <button type="button" onClick={() => void onReset()} disabled={loading} className="w-full text-center text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-navy hover:underline">
              Forgot your password? Send a reset link to your email
            </button>
          </form>
          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            Team accounts are created privately by SWAMN. If you need access, contact the team administrator.
          </p>
        </div>
      </section>
    </main>
  );
};

export default MemberLogin;