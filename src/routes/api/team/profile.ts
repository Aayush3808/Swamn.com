import { createFileRoute } from "@tanstack/react-router";
import { migrate, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/profile")({
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
        const rows = await q<{
          username: string;
          display_name: string;
          designation: string | null;
          avatar_url: string | null;
          role: string;
        }>("SELECT username, display_name, designation, avatar_url, role FROM users WHERE id = ? LIMIT 1", [me.id]);
        const user = rows[0];
        if (!user) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json({
          profile: {
            username: user.username,
            displayName: user.display_name,
            designation: user.designation,
            avatarUrl: user.avatar_url,
            role: user.role,
          },
        });
      },
      PATCH: async ({ request }) => {
        await migrate();
        let me;
        try {
          me = requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const body = (await request.json().catch(() => null)) as { displayName?: string; designation?: string } | null;
        const displayName = String(body?.displayName ?? "").trim().slice(0, 80);
        if (!displayName) return Response.json({ error: "Display name required" }, { status: 400 });
        await q("UPDATE users SET display_name = ?, designation = ? WHERE id = ?", [
          displayName,
          String(body?.designation ?? "").trim().slice(0, 80) || null,
          me.id,
        ]);
        return Response.json({ ok: true });
      },
    },
  },
});
