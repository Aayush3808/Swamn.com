import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/activity")({
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
        const rows =
          me.role === "admin"
            ? await q("SELECT id, kind, detail, created_at as createdAt FROM activity_log ORDER BY created_at DESC LIMIT 20")
            : await q("SELECT id, kind, detail, created_at as createdAt FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 20", [me.id]);
        return Response.json({ activity: rows });
      },
      POST: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const body = (await request.json().catch(() => null)) as { kind?: string; detail?: string } | null;
        await q("INSERT INTO activity_log (id, user_id, kind, detail, created_at) VALUES (?, ?, ?, ?, ?)", [
          newId(),
          me.id,
          String(body?.kind ?? "note").slice(0, 40),
          String(body?.detail ?? "").slice(0, 300) || null,
          nowIso(),
        ]);
        return Response.json({ ok: true });
      },
    },
  },
});
