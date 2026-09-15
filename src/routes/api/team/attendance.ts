import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/attendance")({
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
        const userId = url.searchParams.get("userId") ?? me.id;
        if (userId !== me.id && me.role !== "admin") {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        const rows = await q("SELECT id, day, status FROM member_attendance WHERE user_id = ? ORDER BY day DESC LIMIT 180", [userId]);
        return Response.json({ attendance: rows });
      },
      POST: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const body = (await request.json().catch(() => null)) as { status?: string; day?: string } | null;
        const status = body?.status === "remote" ? "remote" : "present";
        const day = String(body?.day ?? "").match(/^\d{4}-\d{2}-\d{2}$/)
          ? String(body?.day)
          : new Date().toISOString().slice(0, 10);
        await q(
          "INSERT INTO member_attendance (id, user_id, day, status, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, day) DO UPDATE SET status = excluded.status",
          [newId(), me.id, day, status, nowIso()],
        );
        await q("INSERT INTO activity_log (id, user_id, kind, detail, created_at) VALUES (?, ?, ?, ?, ?)", [
          newId(),
          me.id,
          "attendance",
          status === "present" ? "Checked in" : "Checked in (remote)",
          nowIso(),
        ]);
        return Response.json({ ok: true, day, status });
      },
    },
  },
});
