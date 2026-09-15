import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { CalendarCheck, FolderLock, LogOut, Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/swamn/Logo";
import { api, clearToken, getToken, me as fetchMe } from "@/lib/team-api";

export const Route = createFileRoute("/team/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — SWAMN Team Workspace" },
      { name: "description", content: "Your SWAMN member details, attendance record and private files." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "My Profile — SWAMN Team Workspace" },
      { property: "og:description", content: "Your SWAMN member details, attendance record and private files." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MemberProfile,
});

const BUCKET = "team-files";

type Attendance = { id: string; day: string; status: string; note: string | null };
type OwnFile = { name: string; size: number; updatedAt: string };

const todayKey = () => new Date().toISOString().slice(0, 10);

const formatSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 1) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function monthGrid() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const cells: { key: string; label: number | null }[] = [];
  for (let index = 0; index < first.getDay(); index += 1) cells.push({ key: `pad-${index}`, label: null });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ key, label: day });
  }
  return { cells, monthLabel: now.toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
}

function MemberProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [designation, setDesignation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [ownFiles, setOwnFiles] = useState<OwnFile[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    if (!getToken()) {
      navigate({ to: "/team", replace: true });
      return;
    }
    let user;
    try {
      user = await fetchMe();
    } catch {
      navigate({ to: "/team", replace: true });
      return;
    }
    const id = user.id;
    setUserId(id);
    setEmail(user.username);
    setJoined("");

    const [profileRes, daysRes, filesRes] = await Promise.all([
      api<{ profile: { username: string; displayName: string; designation: string | null; role: string } }>("/api/team/profile").catch(() => null),
      api<{ attendance: Attendance[] }>("/api/team/attendance").catch(() => ({ attendance: [] })),
      api<{ files: { name: string; size?: string; modifiedTime?: string }[] }>("/api/team/files").catch(() => ({ files: [] })),
    ]);

    setUsername(profileRes?.profile.username ?? user.username);
    setDisplayName(profileRes?.profile.displayName ?? user.displayName);
    setDesignation(profileRes?.profile.designation ?? user.designation ?? "");
    setIsAdmin(user.role === "admin");
    setAttendance((daysRes?.attendance ?? []) as Attendance[]);
    setOwnFiles(
      (filesRes?.files ?? []).map((entry) => ({
        name: entry.name,
        size: Number(entry.size ?? 0),
        updatedAt: entry.modifiedTime ?? "",
      })),
    );
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const attendanceMap = useMemo(() => new Map(attendance.map((entry) => [entry.day, entry.status])), [attendance]);
  const month = useMemo(() => monthGrid(), []);
  const presentCount = attendance.filter((entry) => entry.status === "present").length;
  const remoteCount = attendance.filter((entry) => entry.status === "remote").length;
  const checkedInToday = attendanceMap.has(todayKey());
  const totalBytes = ownFiles.reduce((sum, file) => sum + file.size, 0);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId || !displayName.trim()) return;
    setBusy(true);
    setMessage("");
    try {
      await api("/api/team/profile", {
        method: "PATCH",
        body: JSON.stringify({ displayName: displayName.trim(), designation: designation.trim() }),
      });
      setMessage("Your details were saved.");
    } catch {
      setMessage("Your details could not be saved.");
    }
    setBusy(false);
  };

  const checkIn = async (status: "present" | "remote") => {
    if (!userId) return;
    setBusy(true);
    await api("/api/team/attendance", { method: "POST", body: JSON.stringify({ status }) }).catch(() => null);
    await load();
    setBusy(false);
  };

  const signOut = async () => {
    clearToken();
    navigate({ to: "/team", replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80">
        <div className="container flex items-center justify-between py-5">
          <a href="/" aria-label="SWAMN home">
            <Logo size={26} />
          </a>
          <div className="flex items-center gap-2">
            <Link to="/team/files">
              <Button variant="outline" size="sm" className="rounded-full">
                <FolderLock className="h-4 w-4" /> My files
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => void signOut()} className="rounded-full">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="container max-w-4xl py-12 md:py-16">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <UserRound className="h-4 w-4 text-aqua" /> My profile
        </div>
        <h1 className="h-display text-4xl text-navy">{displayName || "Your profile"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {designation || "SWAMN team member"}
          {isAdmin ? " · Administrator" : ""}
        </p>

        {loading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading your details…</p>
        ) : (
          <div className="mt-10 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Days present", value: presentCount },
                { label: "Remote days", value: remoteCount },
                { label: "Files stored", value: ownFiles.length },
                { label: "Storage used", value: `${(totalBytes / (1024 * 1024)).toFixed(1)} MB` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
                  <p className="h-display text-3xl text-navy">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-medium text-navy">Your details</h2>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Username</dt>
                  <dd className="mt-1 text-navy">{username || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Sign-in email</dt>
                  <dd className="mt-1 break-all text-navy">{email || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Access level</dt>
                  <dd className="mt-1 text-navy">{isAdmin ? "Administrator" : "Member"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Member since</dt>
                  <dd className="mt-1 text-navy">{joined ? new Date(joined).toLocaleDateString() : "—"}</dd>
                </div>
              </dl>

              <form onSubmit={saveProfile} className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Role in the team</Label>
                  <Input id="designation" value={designation} onChange={(event) => setDesignation(event.target.value)} maxLength={80} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={busy} className="rounded-full">
                    <Save className="h-4 w-4" /> Save details
                  </Button>
                  {message && <span className="ml-3 text-sm text-muted-foreground">{message}</span>}
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-medium text-navy">
                  <CalendarCheck className="h-4 w-4 text-aqua" /> Attendance · {month.monthLabel}
                </h2>
                {checkedInToday ? (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-navy">Checked in today</span>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-full" disabled={busy} onClick={() => void checkIn("present")}>
                      Check in
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={() => void checkIn("remote")}>
                      Remote
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[0.65rem] text-muted-foreground">
                {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
                  <span key={`${label}-${index}`}>{label}</span>
                ))}
              </div>
              <div className="mt-1.5 grid grid-cols-7 gap-1.5">
                {month.cells.map((cell) => {
                  if (cell.label === null) return <span key={cell.key} />;
                  const status = attendanceMap.get(cell.key);
                  const tone =
                    status === "present"
                      ? "bg-primary text-primary-foreground"
                      : status === "remote"
                        ? "bg-secondary text-navy"
                        : "bg-muted/40 text-muted-foreground";
                  return (
                    <span
                      key={cell.key}
                      title={`${cell.key} · ${status ?? "no check-in"}`}
                      className={`flex aspect-square items-center justify-center rounded-lg text-xs ${tone} ${cell.key === todayKey() ? "ring-2 ring-aqua" : ""}`}
                    >
                      {cell.label}
                    </span>
                  );
                })}
              </div>
              <ul className="mt-6 divide-y divide-border text-sm">
                {attendance.slice(0, 8).map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between py-2">
                    <span className="text-navy">{new Date(entry.day).toLocaleDateString()}</span>
                    <span className="text-xs capitalize text-muted-foreground">{entry.status}</span>
                  </li>
                ))}
                {attendance.length === 0 && <li className="py-3 text-muted-foreground">No check-ins recorded yet.</li>}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-medium text-navy">
                  <FolderLock className="h-4 w-4 text-aqua" /> Your files
                </h2>
                <Link to="/team/files" className="text-sm text-aqua underline-offset-4 hover:underline">
                  Manage files
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-border text-sm">
                {ownFiles.length === 0 && <li className="py-3 text-muted-foreground">You haven't added any files yet.</li>}
                {ownFiles.map((file) => (
                  <li key={file.name} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <span className="truncate text-navy">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(file.size)}
                      {file.updatedAt ? ` · ${new Date(file.updatedAt).toLocaleDateString()}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
