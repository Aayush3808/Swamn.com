import { createFileRoute } from "@tanstack/react-router";
import { migrate, q } from "@/server/db";
import { requireUser } from "@/server/auth";
import { readBytes } from "@/server/drive";

export const Route = createFileRoute("/api/team/download")({
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
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        const rows = await q<{
          owner_id: string;
          drive_file_id: string;
          file_name: string;
          mime_type: string | null;
        }>("SELECT owner_id, drive_file_id, file_name, mime_type FROM drive_files WHERE id = ? LIMIT 1", [id]);
        const file = rows[0];
        if (!file) return Response.json({ error: "Not found" }, { status: 404 });
        if (file.owner_id !== me.id) {
          const shared = await q("SELECT id FROM file_shares WHERE file_id = ? AND shared_with = ? LIMIT 1", [id, me.id]);
          if (shared.length === 0 && me.role !== "admin") {
            return Response.json({ error: "Forbidden" }, { status: 403 });
          }
        }
        const data = await readBytes(file.drive_file_id);
        if (!data) return Response.json({ error: "File missing" }, { status: 404 });
        return new Response(new Uint8Array(data.bytes), {
          headers: {
            "Content-Type": file.mime_type ?? "application/octet-stream",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(file.file_name)}"`,
          },
        });
      },
    },
  },
});
