import { FormEvent, useCallback, useEffect, useState } from "react";
import { Megaphone, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/team-api";

type Member = { user_id: string; id?: string; username: string; display_name: string; displayName?: string };
type Announcement = { id: string; title: string; body: string; created_at: string; createdAt?: string };
type AssignedTask = { id: string; title: string; status: string; due_date: string | null; dueDate?: string | null; user_id: string; userId?: string };

export const AdminPanel = ({ onChanged }: { onChanged?: () => void }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assigned, setAssigned] = useState<AssignedTask[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [taskMember, setTaskMember] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplay, setNewDisplay] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const [membersResult, announcementsResult, tasksResult] = await Promise.all([
      api<{ members: Member[] }>("/api/team/members").catch(() => ({ members: [] })),
      api<{ announcements: Announcement[] }>("/api/team/announcements").catch(() => ({ announcements: [] })),
      api<{ tasks: AssignedTask[] }>("/api/team/tasks").catch(() => ({ tasks: [] })),
    ]);
    setMembers(
      (membersResult.members ?? []).map((m) => ({
        user_id: m.user_id ?? m.id ?? "",
        username: m.username,
        display_name: m.display_name ?? m.displayName ?? "",
      })),
    );
    setAnnouncements(
      (announcementsResult.announcements ?? []).map((a) => ({
        ...a,
        created_at: a.created_at ?? a.createdAt ?? "",
      })),
    );
    setAssigned(
      (tasksResult.tasks ?? []).map((t) => ({
        ...t,
        due_date: t.due_date ?? t.dueDate ?? null,
        user_id: t.user_id ?? t.userId ?? "",
      })),
    );
  }, []);

  useEffect(() => { void load(); }, [load]);

  const postAnnouncement = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setBusy(true);
    setNotice("");
    try {
      await api("/api/team/announcements", { method: "POST", body: JSON.stringify({ title: title.trim(), body: body.trim() }) });
      setNotice("Announcement posted to the whole team.");
      setTitle(""); setBody(""); await load(); onChanged?.();
    } catch {
      setNotice("That announcement could not be posted.");
    }
    setBusy(false);
  };

  const removeAnnouncement = async (id: string) => {
    setBusy(true);
    await api(`/api/team/announcements?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => null);
    await load();
    onChanged?.();
    setBusy(false);
  };

  const assignTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!taskMember || !taskTitle.trim()) return;
    setBusy(true);
    setNotice("");
    try {
      await api("/api/team/tasks", {
        method: "POST",
        body: JSON.stringify({ userId: taskMember, title: taskTitle.trim(), details: taskDetails.trim(), dueDate: taskDue || undefined }),
      });
      setNotice("Task assigned — it now shows on their page.");
      setTaskTitle(""); setTaskDetails(""); setTaskDue(""); await load(); onChanged?.();
    } catch {
      setNotice("That task could not be assigned.");
    }
    setBusy(false);
  };

  const memberName = (id: string) => members.find((member) => member.user_id === id)?.display_name ?? "Team member";

  const createUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!newUsername.trim() || newPassword.length < 8 || !newDisplay.trim()) {
      setNotice("Give a username, 8+ character password and display name.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await api("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          username: newUsername.trim().toLowerCase(),
          password: newPassword,
          displayName: newDisplay.trim(),
          avatarUrl: newAvatar.trim() || null,
        }),
      });
      setNotice(`Login created for ${newUsername.trim().toLowerCase()}.`);
      setNewUsername(""); setNewPassword(""); setNewDisplay(""); setNewAvatar("");
      await load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "That login could not be created.");
    }
    setBusy(false);
  };

  return (
    <section className="rounded-2xl border border-aqua/40 bg-secondary/40 p-6">
      <h2 className="flex items-center gap-2 font-medium text-navy"><ShieldCheck className="h-4 w-4 text-aqua" /> Admin controls</h2>
      <p className="mt-1 text-xs text-muted-foreground">Only you can see this panel.</p>
      {notice && <p role="status" className="mt-4 rounded-xl bg-card px-4 py-2 text-sm text-navy">{notice}</p>}

      <form onSubmit={createUser} className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-medium text-navy">Create team login</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="u-username">Username</Label>
            <Input id="u-username" value={newUsername} onChange={(event) => setNewUsername(event.target.value)} maxLength={40} placeholder="rishi.singh" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="u-display">Display name</Label>
            <Input id="u-display" value={newDisplay} onChange={(event) => setNewDisplay(event.target.value)} maxLength={80} placeholder="Rishi Singh" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="u-password">Password (8+ chars)</Label>
            <Input id="u-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" placeholder="Set a password" />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <Label htmlFor="u-avatar">Profile photo URL (optional)</Label>
          <Input id="u-avatar" value={newAvatar} onChange={(event) => setNewAvatar(event.target.value)} maxLength={255} placeholder="/images/team/Rishi.jpeg" />
        </div>
        <Button type="submit" disabled={busy} className="mt-4 rounded-full">Create login</Button>
      </form>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={postAnnouncement} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-medium text-navy"><Megaphone className="h-4 w-4 text-aqua" /> Post an announcement</h3>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="a-title">Title</Label>
              <Input id="a-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="Meeting on Saturday" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="a-body">Message</Label>
              <Textarea id="a-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={1200} rows={4} placeholder="Write what the team needs to know…" />
            </div>
            <Button type="submit" disabled={busy} className="rounded-full">Post to team</Button>
          </div>
          <ul className="mt-5 space-y-2">
            {announcements.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <button type="button" onClick={() => void removeAnnouncement(item.id)} aria-label={`Delete ${item.title}`} className="text-muted-foreground transition-colors hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </form>

        <form onSubmit={assignTask} className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-navy">Assign a task</h3>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-member">Team member</Label>
              <select id="t-member" value={taskMember} onChange={(event) => setTaskMember(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Choose a member…</option>
                {members.map((member) => <option key={member.user_id} value={member.user_id}>{member.display_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-title">Task</Label>
              <Input id="t-title" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} maxLength={200} placeholder="Prepare the pitch deck" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-details">Details (optional)</Label>
              <Textarea id="t-details" value={taskDetails} onChange={(event) => setTaskDetails(event.target.value)} maxLength={800} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-due">Due date (optional)</Label>
              <Input id="t-due" type="date" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} />
            </div>
            <Button type="submit" disabled={busy} className="rounded-full">Assign task</Button>
          </div>
          <ul className="mt-5 space-y-2">
            {assigned.map((task) => (
              <li key={task.id} className="rounded-xl bg-secondary/60 px-3 py-2 text-sm">
                <span className="font-medium text-navy">{memberName(task.user_id)}</span>
                <span className="text-muted-foreground"> · {task.title}{task.due_date ? ` · due ${new Date(task.due_date).toLocaleDateString()}` : ""} · {task.status === "done" ? "done" : "open"}</span>
              </li>
            ))}
          </ul>
        </form>
      </div>
    </section>
  );
};

export default AdminPanel;
