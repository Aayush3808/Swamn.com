import { createFileRoute } from "@tanstack/react-router";
import { migrate, q } from "@/server/db";
import { requireUser } from "@/server/auth";

export const Route = createFileRoute("/api/team/members")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await migrate();
        try {
          requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const rows = await q<{
          id: string;
          username: string;
          display_name: string;
          designation: string | null;
          avatar_url: string | null;
          role: string;
        }>("SELECT id, username, display_name, designation, avatar_url, role FROM users ORDER BY display_name");
        return Response.json({
          members: rows.map((r) => ({
            id: r.id,
            userId: r.id,
            username: r.username,
            displayName: r.display_name,
            display_name: r.display_name,
            designation: r.designation,
            avatarUrl: r.avatar_url,
            avatar_url: r.avatar_url,
            role: r.role,
          })),
        });
      },
    },
  },
});
