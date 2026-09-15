import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/tasks")({
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
        const mine = url.searchParams.get("mine") === "1";
        const rows = mine
          ? await q("SELECT id, title, status, due_date as dueDate, details, assigned_by as assignedBy, user_id as userId FROM member_tasks WHERE user_id = ? ORDER BY created_at DESC", [me.id])
          : await q("SELECT id, title, status, due_date as dueDate, details, assigned_by as assignedBy, user_id as userId FROM member_tasks ORDER BY created_at DESC LIMIT 200");
        return Response.json({ tasks: rows });
      },
      POST: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const body = (await request.json().catch(() => null)) as {
          title?: string;
          details?: string;
          dueDate?: string;
          userId?: string;
        } | null;
        const title = String(body?.title ?? "").trim().slice(0, 200);
        if (!title) return Response.json({ error: "Title required" }, { status: 400 });
        const targetUserId = String(body?.userId ?? me.id);
        if (targetUserId !== me.id && me.role !== "admin") {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        const id = newId();
        await q(
          "INSERT INTO member_tasks (id, user_id, title, details, due_date, status, assigned_by, created_at) VALUES (?, ?, ?, ?, ?, 'todo', ?, ?)",
          [
            id,
            targetUserId,
            title,
            String(body?.details ?? "").trim().slice(0, 800) || null,
            String(body?.dueDate ?? "") || null,
            targetUserId !== me.id ? me.id : null,
            nowIso(),
          ],
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
        const body = (await request.json().catch(() => null)) as { id?: string; status?: string } | null;
        const id = String(body?.id ?? "");
        const status = ["todo", "doing", "done"].includes(String(body?.status)) ? String(body?.status) : "todo";
        if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
        const rows = await q<{ user_id: string }>("SELECT user_id FROM member_tasks WHERE id = ? LIMIT 1", [id]);
        const owner = rows[0]?.user_id;
        if (!owner || (owner !== me.id && me.role !== "admin")) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        await q("UPDATE member_tasks SET status = ? WHERE id = ?", [status, id]);
        return Response.json({ ok: true });
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
        const rows = await q<{ user_id: string }>("SELECT user_id FROM member_tasks WHERE id = ? LIMIT 1", [id]);
        const owner = rows[0]?.user_id;
        if (!owner || (owner !== me.id && me.role !== "admin")) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        await q("DELETE FROM member_tasks WHERE id = ?", [id]);
        return Response.json({ ok: true });
      },
    },
  },
});
