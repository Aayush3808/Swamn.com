import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/share")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const body = (await request.json().catch(() => null)) as { fileId?: string; sharedWith?: string } | null;
        const fileId = String(body?.fileId ?? "");
        const sharedWith = String(body?.sharedWith ?? "");
        if (!fileId || !sharedWith) return Response.json({ error: "Missing fields" }, { status: 400 });
        const rows = await q<{ owner_id: string }>("SELECT owner_id FROM drive_files WHERE id = ? LIMIT 1", [fileId]);
        if (!rows[0] || rows[0].owner_id !== me.id) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        await q(
          "INSERT INTO file_shares (id, file_id, owner_id, shared_with, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(file_id, shared_with) DO NOTHING",
          [newId(), fileId, me.id, sharedWith, nowIso()],
        );
        return Response.json({ ok: true });
      },
    },
  },
});
