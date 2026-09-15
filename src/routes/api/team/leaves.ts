import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/leaves")({
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
            ? await q("SELECT id, user_id as userId, start_date as startDate, end_date as endDate, reason, status FROM leave_requests ORDER BY start_date DESC LIMIT 100")
            : await q("SELECT id, user_id as userId, start_date as startDate, end_date as endDate, reason, status FROM leave_requests WHERE user_id = ? ORDER BY start_date DESC", [me.id]);
        return Response.json({ leaves: rows });
      },
      POST: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const body = (await request.json().catch(() => null)) as { startDate?: string; endDate?: string; reason?: string } | null;
        const start = String(body?.startDate ?? "");
        const end = String(body?.endDate ?? "");
        if (!start || !end) return Response.json({ error: "Dates required" }, { status: 400 });
        const id = newId();
        await q(
          "INSERT INTO leave_requests (id, user_id, start_date, end_date, reason, status, created_at) VALUES (?, ?, ?, ?, ?, 'pending', ?)",
          [id, me.id, start, end, String(body?.reason ?? "").slice(0, 200) || null, nowIso()],
        );
        return Response.json({ ok: true, id });
      },
      PATCH: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        if (me.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
        const body = (await request.json().catch(() => null)) as { id?: string; status?: string } | null;
        const id = String(body?.id ?? "");
        const status = body?.status === "approved" ? "approved" : "declined";
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        await q("UPDATE leave_requests SET status = ?, decided_by = ? WHERE id = ?", [status, me.id, id]);
        return Response.json({ ok: true });
      },
    },
  },
});
