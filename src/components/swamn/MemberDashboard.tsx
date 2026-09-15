import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarCheck, CheckCircle2, Circle, Megaphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, me as fetchMe } from "@/lib/team-api";

type Attendance = { id: string; day: string; status: string };
type Task = { id: string; title: string; status: string; due_date: string | null; details: string | null; assigned_by: string | null };
type Announcement = { id: string; title: string; body: string; created_at: string };

const CHART_COLORS = ["hsl(var(--primary))", "#38bdf8", "#0ea5e9", "#94a3b8", "#cbd5f5"];

const todayKey = () => new Date().toISOString().slice(0, 10);

const lastDays = (count: number) => {
  const days: string[] = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
};

const fileGroup = (name: string, mimeType: string) => {
  const type = mimeType.toLowerCase();
  if (type.startsWith("image/")) return "Images";
  if (type.includes("pdf")) return "PDFs";
  if (type.startsWith("video/")) return "Videos";
  if (type.includes("sheet") || name.endsWith(".csv") || name.endsWith(".xlsx")) return "Sheets";
  return "Documents";
};

const monthGrid = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const cells: { key: string; label: number | null }[] = [];
  for (let index = 0; index < first.getDay(); index += 1) cells.push({ key: `pad-${index}`, label: null });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ key, label: day });
  }
  return { cells, monthLabel: now.toLocaleDateString(undefined, { month: "long", year: "numeric" }) };
};

export const MemberDashboard = ({ files, refreshKey = 0 }: { files: { name: string; mimeType: string; size?: string }[]; refreshKey?: number }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newTask, setNewTask] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    let id: string | null = null;
    try {
      const user = await fetchMe();
      id = user.id;
    } catch {
      return;
    }
    setUserId(id);
    if (!id) return;

    const [attendanceResult, tasksResult, announcementsResult] = await Promise.all([
      api<{ attendance: Attendance[] }>("/api/team/attendance").catch(() => ({ attendance: [] })),
      api<{ tasks: Task[] }>("/api/team/tasks?mine=1").catch(() => ({ tasks: [] })),
      api<{ announcements: Announcement[] }>("/api/team/announcements").catch(() => ({ announcements: [] })),
    ]);

    setAttendance(attendanceResult.attendance ?? []);
    setTasks(
      (tasksResult.tasks ?? []).map((t) => ({
        ...t,
        due_date: (t as unknown as { dueDate?: string | null }).dueDate ?? t.due_date ?? null,
        assigned_by: (t as unknown as { assignedBy?: string | null }).assignedBy ?? t.assigned_by ?? null,
      })),
    );
    setAnnouncements(
      (announcementsResult.announcements ?? []).map((a) => ({
        ...a,
        created_at: (a as unknown as { createdAt?: string }).createdAt ?? a.created_at,
      })),
    );
  }, []);

  useEffect(() => { void load(); }, [load, refreshKey]);

  const days = useMemo(() => lastDays(14), []);
  const attendanceMap = useMemo(() => new Map(attendance.map((entry) => [entry.day, entry.status])), [attendance]);
  const checkedInToday = attendanceMap.has(todayKey());

  const attendanceChart = days.map((day) => ({
    label: new Date(day).toLocaleDateString(undefined, { day: "numeric", month: "short" }),
    value: attendanceMap.get(day) === "present" ? 1 : attendanceMap.get(day) === "remote" ? 0.6 : 0,
  }));

  const presentDays = attendance.filter((entry) => entry.status !== "absent").length;
  const doneTasks = tasks.filter((task) => task.status === "done").length;

  const storageChart = useMemo(() => {
    const groups = new Map<string, number>();
    files.forEach((file) => {
      const key = fileGroup(file.name, file.mimeType ?? "");
      groups.set(key, (groups.get(key) ?? 0) + 1);
    });
    return [...groups.entries()].map(([name, value]) => ({ name, value }));
  }, [files]);

  const totalBytes = files.reduce((sum, file) => sum + (Number(file.size) || 0), 0);

  const month = useMemo(() => monthGrid(), []);

  const checkIn = async (status: "present" | "remote") => {
    if (!userId) return;
    setBusy(true);
    await api("/api/team/attendance", { method: "POST", body: JSON.stringify({ status }) }).catch(() => null);
    await load();
    setBusy(false);
  };

  const addTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId || !newTask.trim()) return;
    setBusy(true);
    await api("/api/team/tasks", { method: "POST", body: JSON.stringify({ title: newTask.trim() }) }).catch(() => null);
    setNewTask("");
    await load();
    setBusy(false);
  };

  const toggleTask = async (task: Task) => {
    setBusy(true);
    await api("/api/team/tasks", {
      method: "PATCH",
      body: JSON.stringify({ id: task.id, status: task.status === "done" ? "todo" : "done" }),
    }).catch(() => null);
    await load();
    setBusy(false);
  };

  const removeTask = async (task: Task) => {
    setBusy(true);
    await api(`/api/team/tasks?id=${encodeURIComponent(task.id)}`, { method: "DELETE" }).catch(() => null);
    await load();
    setBusy(false);
  };

  const stats = [
    { label: "Days active (30 days)", value: presentDays },
    { label: "Tasks completed", value: doneTasks },
    { label: "Open tasks", value: tasks.length - doneTasks },
    { label: "Files stored", value: files.length },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="h-display text-3xl text-navy">{stat.value}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-medium text-navy"><CalendarCheck className="h-4 w-4 text-aqua" /> Attendance</h2>
            {checkedInToday ? (
              <span className="rounded-full bg-secondary px-3 py-1 text-xs text-navy">Checked in today</span>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" className="rounded-full" disabled={busy} onClick={() => void checkIn("present")}>Check in</Button>
                <Button size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={() => void checkIn("remote")}>Remote</Button>
              </div>
            )}
          </div>
          <div className="mt-6 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChart} margin={{ left: -28, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={1} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 1]} ticks={[0, 1]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ opacity: 0.08 }} formatter={(value: number) => (value === 1 ? "Present" : value > 0 ? "Remote" : "No check-in")} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-medium text-navy">Your files at a glance</h2>
          <p className="mt-1 text-xs text-muted-foreground">{files.length} files · {(totalBytes / (1024 * 1024)).toFixed(1)} MB stored</p>
          <div className="mt-4 h-52">
            {storageChart.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Add files to see the breakdown.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={storageChart} dataKey="value" nameKey="name" innerRadius={44} outerRadius={76} paddingAngle={3}>
                    {storageChart.map((entry, index) => <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            {storageChart.map((entry, index) => (
              <span key={entry.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
                {entry.name} ({entry.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium text-navy">Monthly tracker</h2>
          <span className="text-xs text-muted-foreground">{month.monthLabel}</span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-[0.65rem] text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
        </div>
        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {month.cells.map((cell) => {
            if (cell.label === null) return <span key={cell.key} />;
            const status = attendanceMap.get(cell.key);
            const isToday = cell.key === todayKey();
            const tone = status === "present" ? "bg-primary text-primary-foreground" : status === "remote" ? "bg-secondary text-navy" : "bg-muted/40 text-muted-foreground";
            return (
              <span key={cell.key} title={`${cell.key} · ${status ?? "no check-in"}`} className={`flex aspect-square items-center justify-center rounded-lg text-xs ${tone} ${isToday ? "ring-2 ring-aqua" : ""}`}>
                {cell.label}
              </span>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Present</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" /> Remote</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted" /> No check-in</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-medium text-navy">Your tasks</h2>
          <form onSubmit={addTask} className="mt-4 flex gap-2">
            <Input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task…" maxLength={200} />
            <Button type="submit" size="icon" className="shrink-0 rounded-full" disabled={busy} aria-label="Add task"><Plus className="h-4 w-4" /></Button>
          </form>
          <ul className="mt-4 divide-y divide-border">
            {tasks.length === 0 && <li className="py-6 text-sm text-muted-foreground">No tasks yet. Add your first one above.</li>}
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-3 py-3">
                <button type="button" onClick={() => void toggleTask(task)} aria-label={`Toggle ${task.title}`} className="mt-0.5 text-aqua">
                  {task.status === "done" ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm ${task.status === "done" ? "text-muted-foreground line-through" : "text-navy"}`}>{task.title}</p>
                  {task.details && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{task.details}</p>}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.7rem] text-muted-foreground">
                    {task.assigned_by && <span className="rounded-full bg-secondary px-2 py-0.5 text-navy">Assigned by admin</span>}
                    {task.due_date && <span>Due {new Date(task.due_date).toLocaleDateString()}</span>}
                  </div>
                </div>
                <button type="button" onClick={() => void removeTask(task)} aria-label={`Delete ${task.title}`} className="mt-0.5 text-muted-foreground transition-colors hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-medium text-navy"><Megaphone className="h-4 w-4 text-aqua" /> Team announcements</h2>
          <ul className="mt-4 space-y-4">
            {announcements.length === 0 && <li className="text-sm text-muted-foreground">No announcements yet.</li>}
            {announcements.map((item) => (
              <li key={item.id} className="rounded-xl bg-secondary/60 p-4">
                <p className="text-sm font-medium text-navy">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
