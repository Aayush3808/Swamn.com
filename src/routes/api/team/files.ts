import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";
import { deleteBytes, saveBytes } from "@/server/drive";

export const Route = createFileRoute("/api/team/files")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const own = await q<{
          id: string;
          drive_file_id: string;
          file_name: string;
          mime_type: string | null;
          size: string | null;
          created_at: string;
        }>("SELECT id, drive_file_id, file_name, mime_type, size, created_at FROM drive_files WHERE owner_id = ? ORDER BY created_at DESC LIMIT 100", [me.id]);
        const shared = await q<{
          file_id: string;
          file_name: string;
          mime_type: string | null;
          owner_id: string;
        }>(
          "SELECT s.file_id as file_id, f.file_name as file_name, f.mime_type as mime_type, s.owner_id as owner_id FROM file_shares s LEFT JOIN drive_files f ON f.id = s.file_id WHERE s.shared_with = ? ORDER BY s.created_at DESC",
          [me.id],
        );
        const owners = await q<{ id: string; display_name: string }>("SELECT id, display_name FROM users");
        const names = new Map(owners.map((o) => [o.id, o.display_name]));
        return Response.json({
          files: own.map((f) => ({
            id: f.id,
            driveFileId: f.drive_file_id,
            name: f.file_name,
            mimeType: f.mime_type ?? "application/octet-stream",
            size: f.size ?? "",
            modifiedTime: f.created_at,
          })),
          shared: shared.map((s) => ({
            id: s.file_id,
            name: s.file_name ?? "Shared file",
            mimeType: s.mime_type ?? "application/octet-stream",
            sharedBy: names.get(s.owner_id) ?? "Team member",
          })),
        });
      },
      POST: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const form = await request.formData().catch(() => null);
        const upload = form?.get("file") as File | null;
        if (!upload) return Response.json({ error: "No file" }, { status: 400 });
        if (upload.size > 10 * 1024 * 1024) {
          return Response.json({ error: "Files must be smaller than 10 MB." }, { status: 400 });
        }
        const bytes = new Uint8Array(await upload.arrayBuffer());
        const saved = await saveBytes({
          userId: me.id,
          username: me.username,
          fileName: upload.name,
          mimeType: upload.type || "application/octet-stream",
          bytes,
        });
        const id = newId();
        await q(
          "INSERT INTO drive_files (id, drive_file_id, owner_id, file_name, mime_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [id, saved.driveFileId, me.id, upload.name, upload.type || "application/octet-stream", String(upload.size), nowIso()],
        );
        await q("INSERT INTO activity_log (id, user_id, kind, detail, created_at) VALUES (?, ?, ?, ?, ?)", [
          newId(),
          me.id,
          "upload",
          `Uploaded ${upload.name}`,
          nowIso(),
        ]);
        return Response.json({ ok: true, id, name: upload.name });
      },
      DELETE: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        const rows = await q<{ owner_id: string; drive_file_id: string; file_name: string }>(
          "SELECT owner_id, drive_file_id, file_name FROM drive_files WHERE id = ? LIMIT 1",
          [id],
        );
        const file = rows[0];
        if (!file || (file.owner_id !== me.id && me.role !== "admin")) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        await deleteBytes(file.drive_file_id);
        await q("DELETE FROM drive_files WHERE id = ?", [id]);
        await q("DELETE FROM file_shares WHERE file_id = ?", [id]);
        await q("INSERT INTO activity_log (id, user_id, kind, detail, created_at) VALUES (?, ?, ?, ?, ?)", [
          newId(),
          me.id,
          "delete",
          `Removed ${file.file_name}`,
          nowIso(),
        ]);
        return Response.json({ ok: true });
      },
    },
  },
});
