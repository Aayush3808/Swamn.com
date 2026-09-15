import { createFileRoute } from "@tanstack/react-router";
import { migrate, q } from "@/server/db";
import { hashPassword, requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/auth/password")({
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
        const body = (await request.json().catch(() => null)) as { password?: string } | null;
        const password = String(body?.password ?? "");
        if (password.length < 8) {
          return Response.json({ error: "Use at least 8 characters." }, { status: 400 });
        }
        const hash = await hashPassword(password);
        await q("UPDATE users SET password_hash = ? WHERE id = ?", [hash, me.id]);
        return Response.json({ ok: true });
      },
    },
  },
});
