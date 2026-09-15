import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/notes")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await migrate();
        try {
          requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const rows = await q("SELECT id, title, body, meeting_date as meetingDate FROM meeting_notes ORDER BY meeting_date DESC LIMIT 100");
        return Response.json({ notes: rows });
      },
      POST: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        if (me.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
        const body = (await request.json().catch(() => null)) as { title?: string; body?: string; meetingDate?: string } | null;
        const title = String(body?.title ?? "").trim().slice(0, 140);
        const text = String(body?.body ?? "").trim().slice(0, 4000);
        if (!title || !text) return Response.json({ error: "Title and notes required" }, { status: 400 });
        const id = newId();
        await q(
          "INSERT INTO meeting_notes (id, title, body, meeting_date, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          [id, title, text, String(body?.meetingDate ?? "") || new Date().toISOString().slice(0, 10), me.id, nowIso()],
        );
        return Response.json({ ok: true, id });
      },
    },
  },
});
