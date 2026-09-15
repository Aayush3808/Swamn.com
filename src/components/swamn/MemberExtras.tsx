import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, ClipboardList, NotebookPen, Search, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/team-api";

type Profile = { user_id: string; id?: string; display_name: string; displayName?: string; avatar_url: string | null; avatarUrl?: string | null };
type Task = { id: string; title: string; status: string; user_id: string; userId?: string; due_date: string | null; dueDate?: string | null };
type Leave = { id: string; user_id: string; userId?: string; start_date: string; startDate?: string; end_date: string; endDate?: string; reason: string | null; status: string };
type Activity = { id: string; kind: string; detail: string | null; created_at: string; createdAt?: string };
type Note = { id: string; title: string; body: string; meeting_date: string; meetingDate?: string };

const COLUMNS: { key: string; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "doing", label: "Doing" },
  { key: "done", label: "Done" },
];

export const MemberExtras = ({ userId, isAdmin, refreshKey = 0 }: { userId: string | null; isAdmin: boolean; refreshKey?: number }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    if (!userId) return;
    const [profilesResult, tasksResult, leavesResult, activityResult, notesResult] = await Promise.all([
      api<{ members: Profile[] }>("/api/team/members").catch(() => ({ members: [] })),
      api<{ tasks: Task[] }>("/api/team/tasks").catch(() => ({ tasks: [] })),
      api<{ leaves: Leave[] }>("/api/team/leaves").catch(() => ({ leaves: [] })),
      api<{ activity: Activity[] }>("/api/team/activity").catch(() => ({ activity: [] })),
      api<{ notes: Note[] }>("/api/team/notes").catch(() => ({ notes: [] })),
    ]);
    setProfiles(
      (profilesResult.members ?? []).map((p) => ({
        user_id: p.user_id ?? p.id ?? "",
        display_name: p.display_name ?? p.displayName ?? "Team member",
        avatar_url: p.avatar_url ?? p.avatarUrl ?? null,
      })),
    );
    setTasks(
      (tasksResult.tasks ?? []).map((t) => ({
        ...t,
        user_id: t.user_id ?? t.userId ?? "",
        due_date: t.due_date ?? t.dueDate ?? null,
      })),
    );
    setLeaves(
      (leavesResult.leaves ?? []).map((l) => ({
        ...l,
        user_id: l.user_id ?? l.userId ?? "",
        start_date: l.start_date ?? l.startDate ?? "",
        end_date: l.end_date ?? l.endDate ?? "",
      })),
    );
    setActivity(
      (activityResult.activity ?? []).map((a) => ({
        ...a,
        created_at: a.created_at ?? a.createdAt ?? "",
      })),
    );
    setNotes(
      (notesResult.notes ?? []).map((n) => ({
        ...n,
        meeting_date: n.meeting_date ?? n.meetingDate ?? "",
      })),
    );
  }, [userId]);

  useEffect(() => { void load(); }, [load, refreshKey]);

  const nameOf = useCallback((id: string) => profiles.find((profile) => profile.user_id === id)?.display_name ?? "Team member", [profiles]);

  const myTasks = useMemo(() => tasks.filter((task) => task.user_id === userId), [tasks, userId]);

  const leaderboard = useMemo(() => {
    const rows = profiles.map((profile) => {
      const mine = tasks.filter((task) => task.user_id === profile.user_id);
      return {
        id: profile.user_id,
        name: profile.display_name,
        avatar: profile.avatar_url,
        done: mine.filter((task) => task.status === "done").length,
        open: mine.filter((task) => task.status !== "done").length,
      };
    });
    return rows.sort((a, b) => b.done - a.done || a.name.localeCompare(b.name));
  }, [profiles, tasks]);

  const filteredNotes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(term));
  }, [notes, search]);

  const moveTask = async (task: Task, status: string) => {
    setBusy(true);
    await api("/api/team/tasks", { method: "PATCH", body: JSON.stringify({ id: task.id, status }) }).catch(() => null);
    await load();
    setBusy(false);
  };

  const requestLeave = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId || !leaveStart || !leaveEnd) return;
    setBusy(true);
    setNotice("");
    try {
      await api("/api/team/leaves", { method: "POST", body: JSON.stringify({ startDate: leaveStart, endDate: leaveEnd, reason: leaveReason.trim() }) });
      setNotice("Leave request sent for approval.");
      setLeaveStart(""); setLeaveEnd(""); setLeaveReason(""); await load();
    } catch {
      setNotice("That leave request could not be sent.");
    }
    setBusy(false);
  };

  const decideLeave = async (leave: Leave, status: "approved" | "declined") => {
    setBusy(true);
    await api("/api/team/leaves", { method: "PATCH", body: JSON.stringify({ id: leave.id, status }) }).catch(() => null);
    await load();
    setBusy(false);
  };

  const postNote = async (event: FormEvent) => {
    event.preventDefault();
    if (!noteTitle.trim() || !noteBody.trim()) return;
    setBusy(true);
    setNotice("");
    try {
      await api("/api/team/notes", {
        method: "POST",
        body: JSON.stringify({ title: noteTitle.trim(), body: noteBody.trim(), meetingDate: noteDate || undefined }),
      });
      setNotice("Meeting notes saved.");
      setNoteTitle(""); setNoteBody(""); setNoteDate(""); await load();
    } catch {
      setNotice("Those notes could not be saved.");
    }
    setBusy(false);
  };

  const myLeaves = leaves.filter((leave) => leave.user_id === userId);
  const pendingLeaves = leaves.filter((leave) => leave.status === "pending");

  return (
    <div className="mt-8 space-y-8">
      {notice && <p role="status" className="rounded-xl bg-secondary px-4 py-2 text-sm text-navy">{notice}</p>}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 font-medium text-navy"><ClipboardList className="h-4 w-4 text-aqua" /> Progress board</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.key} className="rounded-xl bg-secondary/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{column.label}</p>
              <ul className="mt-3 space-y-2">
                {myTasks.filter((task) => task.status === column.key).length === 0 && <li className="text-xs text-muted-foreground">Nothing here.</li>}
                {myTasks.filter((task) => task.status === column.key).map((task) => (
                  <li key={task.id} className="rounded-lg bg-card p-3">
                    <p className="text-sm text-navy">{task.title}</p>
                    {task.due_date && <p className="mt-1 text-[0.7rem] text-muted-foreground">Due {new Date(task.due_date).toLocaleDateString()}</p>}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {COLUMNS.filter((target) => target.key !== column.key).map((target) => (
                        <Button key={target.key} size="sm" variant="outline" disabled={busy} className="h-7 rounded-full px-3 text-[0.7rem]" onClick={() => void moveTask(task, target.key)}>
                          {target.label}
                        </Button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-medium text-navy"><Trophy className="h-4 w-4 text-aqua" /> Team leaderboard</h2>
          <ol className="mt-4 space-y-3">
            {leaderboard.map((row, index) => (
              <li key={row.id} className="flex items-center gap-3">
                <span className="w-5 text-sm text-muted-foreground">{index + 1}</span>
                <span aria-hidden className="h-9 w-9 shrink-0 rounded-full border border-border bg-secondary bg-cover bg-center" style={row.avatar ? { backgroundImage: `url(${row.avatar})` } : undefined} />
                <span className="flex-1 text-sm text-navy">{row.name}</span>
                <span className="text-xs text-muted-foreground">{row.done} done · {row.open} open</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-medium text-navy"><Activity className="h-4 w-4 text-aqua" /> Activity log</h2>
          <ul className="mt-4 space-y-2">
            {activity.length === 0 && <li className="text-sm text-muted-foreground">Nothing recorded yet.</li>}
            {activity.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 border-b border-border pb-2 text-sm last:border-0">
                <span className="text-navy">{entry.detail ?? entry.kind}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-medium text-navy"><CalendarDays className="h-4 w-4 text-aqua" /> Leave requests</h2>
          <form onSubmit={requestLeave} className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="l-start">From</Label>
              <Input id="l-start" type="date" value={leaveStart} onChange={(event) => setLeaveStart(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-end">To</Label>
              <Input id="l-end" type="date" value={leaveEnd} onChange={(event) => setLeaveEnd(event.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="l-reason">Reason (optional)</Label>
              <Input id="l-reason" value={leaveReason} onChange={(event) => setLeaveReason(event.target.value)} maxLength={200} />
            </div>
            <Button type="submit" disabled={busy} className="rounded-full sm:col-span-2 sm:justify-self-start">Request leave</Button>
          </form>
          <ul className="mt-5 space-y-2">
            {myLeaves.map((leave) => (
              <li key={leave.id} className="rounded-xl bg-secondary/60 px-3 py-2 text-sm text-navy">
                {new Date(leave.start_date).toLocaleDateString()} – {new Date(leave.end_date).toLocaleDateString()}
                <span className="text-muted-foreground"> · {leave.status}</span>
              </li>
            ))}
          </ul>
          {isAdmin && (
            <div className="mt-5 rounded-xl border border-aqua/40 p-4">
              <p className="text-sm font-medium text-navy">Waiting for your approval</p>
              <ul className="mt-3 space-y-2">
                {pendingLeaves.length === 0 && <li className="text-xs text-muted-foreground">No pending requests.</li>}
                {pendingLeaves.map((leave) => (
                  <li key={leave.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-navy">{nameOf(leave.user_id)} · {new Date(leave.start_date).toLocaleDateString()} – {new Date(leave.end_date).toLocaleDateString()}</span>
                    <span className="flex gap-2">
                      <Button size="sm" disabled={busy} className="h-7 rounded-full px-3 text-[0.7rem]" onClick={() => void decideLeave(leave, "approved")}>Approve</Button>
                      <Button size="sm" variant="outline" disabled={busy} className="h-7 rounded-full px-3 text-[0.7rem]" onClick={() => void decideLeave(leave, "declined")}>Decline</Button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-medium text-navy"><NotebookPen className="h-4 w-4 text-aqua" /> Meeting notes</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes…" className="pl-9" />
          </div>
          <ul className="mt-4 space-y-3">
            {filteredNotes.length === 0 && <li className="text-sm text-muted-foreground">No notes found.</li>}
            {filteredNotes.map((note) => (
              <li key={note.id} className="rounded-xl bg-secondary/60 p-4">
                <p className="text-sm font-medium text-navy">{note.title}</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{note.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(note.meeting_date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
          {isAdmin && (
            <form onSubmit={postNote} className="mt-5 space-y-3 rounded-xl border border-aqua/40 p-4">
              <p className="text-sm font-medium text-navy">Add meeting notes</p>
              <div className="space-y-1.5">
                <Label htmlFor="n-title">Title</Label>
                <Input id="n-title" value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} maxLength={140} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="n-date">Date</Label>
                <Input id="n-date" type="date" value={noteDate} onChange={(event) => setNoteDate(event.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="n-body">Notes</Label>
                <Textarea id="n-body" rows={4} value={noteBody} onChange={(event) => setNoteBody(event.target.value)} maxLength={4000} />
              </div>
              <Button type="submit" disabled={busy} className="rounded-full">Save notes</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberExtras;
