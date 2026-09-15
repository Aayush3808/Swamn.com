import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Download, Eye, FileUp, FolderLock, LogOut, RefreshCw, Share2, Trash2, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/swamn/Logo";
import { MemberDashboard } from "@/components/swamn/MemberDashboard";
import { MemberExtras } from "@/components/swamn/MemberExtras";
import { AdminPanel } from "@/components/swamn/AdminPanel";
import { api, clearToken, getToken, me as fetchMe } from "@/lib/team-api";

export const Route = createFileRoute("/team/files")({
  head: () => ({
    meta: [
      { title: "My Files — SWAMN Team Workspace" },
      { name: "description", content: "Private SWAMN team member file workspace." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "My Files — SWAMN Team Workspace" },
      { property: "og:description", content: "Private SWAMN team member file workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MemberWorkspace,
});

const BUCKET = "team-files";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  sharedBy?: string;
};

type Member = { user_id: string; display_name: string };

const formatSize = (size?: string) => {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes < 1) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function MemberWorkspace() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [sharedFiles, setSharedFiles] = useState<DriveFile[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("Team member");
  const [designation, setDesignation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ name: string; mimeType: string; url: string } | null>(null);
  const [shareFile, setShareFile] = useState<DriveFile | null>(null);
  const [shareTarget, setShareTarget] = useState("");

  const logActivity = useCallback(
    async (kind: string, detail: string) => {
      if (!userId) return;
      await api("/api/team/activity", { method: "POST", body: JSON.stringify({ kind, detail }) }).catch(() => null);
    },
    [userId],
  );

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError("");
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
    setDisplayName(user.displayName || "Team member");
    setAvatarUrl(user.avatarUrl ?? null);
    setDesignation(user.designation ?? "");
    setIsAdmin(user.role === "admin");

    const membersRes = await api<{ members: { userId: string; displayName: string }[] }>("/api/team/members").catch(() => ({ members: [] }));
    setMembers(
      (membersRes.members ?? [])
        .filter((m) => m.userId !== id)
        .map((m) => ({ user_id: m.userId, display_name: m.displayName })),
    );

    const filesRes = await api<{ files: DriveFile[]; shared: DriveFile[] }>("/api/team/files").catch(() => null);
    if (!filesRes) {
      setError("Your folder could not be opened. Please try again.");
    } else {
      setFiles(filesRes.files ?? []);
      setSharedFiles(filesRes.shared ?? []);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !userId) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Files must be smaller than 10 MB.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      const token = getToken();
      const res = await fetch("/api/team/files", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) throw new Error("upload");
      setMessage(`${file.name} was added to your folder.`);
      await loadFiles();
      setRefreshKey((value) => value + 1);
    } catch {
      setError("That file could not be uploaded. Please try again.");
    }
    setBusy(false);
  };

  const fileUrl = async (file: DriveFile) => {
    const token = getToken();
    return `/api/team/download?id=${encodeURIComponent(file.id)}${token ? `&t=${encodeURIComponent(token)}` : ""}`;
  };

  const authedFetch = async (url: string) => {
    const token = getToken();
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) throw new Error("open");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const previewFile = async (file: DriveFile) => {
    setBusy(true);
    setError("");
    try {
      const url = await authedFetch(await fileUrl(file));
      setPreview({ name: file.name, mimeType: file.mimeType, url });
    } catch {
      setError("Could not open that file.");
    }
    setBusy(false);
  };

  const downloadFile = async (file: DriveFile) => {
    setBusy(true);
    setError("");
    try {
      const url = await authedFetch(await fileUrl(file));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.name;
      anchor.rel = "noopener";
      anchor.click();
    } catch {
      setError("Could not open that file.");
    }
    setBusy(false);
  };

  const deleteFile = async (file: DriveFile) => {
    if (!window.confirm(`Remove ${file.name} from your folder?`)) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/team/files?id=${encodeURIComponent(file.id)}`, { method: "DELETE" });
      setMessage(`${file.name} was removed.`);
      await loadFiles();
    } catch {
      setError("That file could not be removed.");
    }
    setBusy(false);
  };

  const confirmShare = async () => {
    if (!shareFile || !shareTarget || !userId) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/team/share", {
        method: "POST",
        body: JSON.stringify({ fileId: shareFile.id, sharedWith: shareTarget }),
      });
      setMessage(`${shareFile.name} was shared.`);
    } catch {
      setError("That file could not be shared.");
    }
    setShareFile(null);
    setShareTarget("");
    setBusy(false);
  };

  const signOut = async () => {
    clearToken();
    navigate({ to: "/team", replace: true });
  };

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const renderFileRow = (file: DriveFile, owned: boolean) => (
    <div key={file.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-navy">{file.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {owned ? formatSize(file.size) : `Shared by ${file.sharedBy ?? "a teammate"}`}
          {owned && file.modifiedTime ? ` · Updated ${new Date(file.modifiedTime).toLocaleDateString()}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => void previewFile(file)} disabled={busy} className="rounded-full">
          <Eye className="h-4 w-4" /> Preview
        </Button>
        <Button variant="outline" size="sm" onClick={() => void downloadFile(file)} disabled={busy} className="rounded-full">
          <Download className="h-4 w-4" /> Download
        </Button>
        {owned && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShareFile(file);
                setShareTarget("");
              }}
              disabled={busy}
              className="rounded-full"
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void deleteFile(file)}
              disabled={busy}
              aria-label={`Delete ${file.name}`}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80">
        <div className="container flex items-center justify-between py-5">
          <a href="/" aria-label="SWAMN home">
            <Logo size={26} />
          </a>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary bg-cover bg-center text-xs font-medium text-navy sm:flex"
              style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
            >
              {avatarUrl ? "" : initials}
            </span>
            <span className="hidden text-sm text-muted-foreground sm:inline">{displayName}</span>
            <Link to="/team/profile">
              <Button variant="outline" size="sm" className="rounded-full">
                <UserRound className="h-4 w-4" /> Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => void signOut()} className="rounded-full">

              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="container max-w-5xl py-12 md:py-16">
        <h1 className="sr-only">SWAMN member workspace</h1>
        <div className="mb-10 flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-secondary bg-cover bg-center text-lg font-medium text-navy"
            style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
          >
            {avatarUrl ? "" : initials}
          </span>
          <div>
            <p className="h-display text-2xl text-navy">{displayName}</p>
            <p className="text-sm text-muted-foreground">{designation || (isAdmin ? "Team Lead" : "SWAMN team member")}</p>
            {isAdmin && <p className="mt-1 text-xs uppercase tracking-[0.18em] text-aqua">Administrator</p>}
          </div>
        </div>
        {isAdmin && (
          <div className="mb-10">
            <AdminPanel onChanged={() => setRefreshKey((value) => value + 1)} />
          </div>
        )}
        <MemberDashboard files={files} refreshKey={refreshKey} />
        <MemberExtras userId={userId} isAdmin={isAdmin} refreshKey={refreshKey} />

        <div className="mt-12 flex flex-col justify-between gap-6 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <FolderLock className="h-4 w-4 text-aqua" /> Private workspace
            </div>
            <h2 className="h-display text-4xl text-navy">Your SWAMN files</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Only files in your own private folder appear here.
            </p>
          </div>
          <div className="flex gap-2">
            <input ref={inputRef} type="file" className="hidden" onChange={onUpload} />
            <Button onClick={() => inputRef.current?.click()} disabled={busy} className="rounded-full">
              <FileUp className="h-4 w-4" /> Add file
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => void loadFiles()}
              disabled={loading || busy}
              aria-label="Refresh files"
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {message && (
          <div role="status" className="mt-6 rounded-xl border border-aqua/30 bg-secondary px-4 py-3 text-sm text-navy">
            {message}
          </div>
        )}
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {loading ? (
            <div className="p-8 text-sm text-muted-foreground">Loading your folder…</div>
          ) : files.length === 0 ? (
            <div className="p-12 text-center">
              <FolderLock className="mx-auto h-8 w-8 text-aqua" />
              <h2 className="mt-4 font-medium text-navy">Your folder is ready</h2>
              <p className="mt-2 text-sm text-muted-foreground">Add your first file to start building your private workspace.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">{files.map((file) => renderFileRow(file, true))}</div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-medium text-navy">
            <Users className="h-4 w-4 text-aqua" /> Shared with you
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
            {sharedFiles.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No teammate has shared a file with you yet.</p>
            ) : (
              <div className="divide-y divide-border">{sharedFiles.map((file) => renderFileRow(file, false))}</div>
            )}
          </div>
        </div>
      </section>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview?.mimeType.startsWith("image/") && (
            <img src={preview.url} alt={preview.name} className="max-h-[70vh] w-full rounded-xl object-contain" />
          )}
          {preview?.mimeType.includes("pdf") && (
            <iframe title={preview.name} src={preview.url} className="h-[70vh] w-full rounded-xl border border-border" />
          )}
          {preview && !preview.mimeType.startsWith("image/") && !preview.mimeType.includes("pdf") && (
            <p className="text-sm text-muted-foreground">This file type can't be shown here — use Download to open it.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(shareFile)} onOpenChange={(open) => { if (!open) setShareFile(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="truncate">Share {shareFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="share-target">Team member</Label>
            <select
              id="share-target"
              value={shareTarget}
              onChange={(event) => setShareTarget(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose a member…</option>
              {members.map((member) => (
                <option key={member.user_id} value={member.user_id}>
                  {member.display_name}
                </option>
              ))}
            </select>
            <Button onClick={() => void confirmShare()} disabled={busy || !shareTarget} className="rounded-full">
              Share file
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
