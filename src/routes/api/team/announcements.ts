import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/announcements")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await migrate();
        try {
          requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const rows = await q("SELECT id, title, body, created_at as createdAt FROM announcements ORDER BY created_at DESC LIMIT 50");
        return Response.json({ announcements: rows });
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
        const body = (await request.json().catch(() => null)) as { title?: string; body?: string } | null;
        const title = String(body?.title ?? "").trim().slice(0, 120);
        const text = String(body?.body ?? "").trim().slice(0, 1200);
        if (!title || !text) return Response.json({ error: "Title and message required" }, { status: 400 });
        const id = newId();
        await q("INSERT INTO announcements (id, title, body, created_by, created_at) VALUES (?, ?, ?, ?, ?)", [
          id,
          title,
          text,
          me.id,
          nowIso(),
        ]);
        return Response.json({ ok: true, id });
      },
      DELETE: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        if (me.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        await q("DELETE FROM announcements WHERE id = ?", [id]);
        return Response.json({ ok: true });
      },
    },
  },
});
