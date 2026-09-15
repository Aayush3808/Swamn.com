import { createFileRoute } from "@tanstack/react-router";
import { migrate, q } from "@/server/db";
import { getBearerToken, verifyToken } from "@/server/auth";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await migrate();
        const token = getBearerToken(request);
        const session = token ? verifyToken(token) : null;
        if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const rows = await q<{
          id: string;
          username: string;
          display_name: string;
          designation: string | null;
          avatar_url: string | null;
          role: string;
        }>("SELECT id, username, display_name, designation, avatar_url, role FROM users WHERE id = ? LIMIT 1", [session.id]);
        const user = rows[0];
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
        return Response.json({
          user: {
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            designation: user.designation,
            avatarUrl: user.avatar_url,
            role: user.role,
          },
        });
      },
    },
  },
});
