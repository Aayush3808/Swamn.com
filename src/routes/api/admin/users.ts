import { createFileRoute } from "@tanstack/react-router";
import { migrate, q, newId, nowIso } from "@/server/db";
import { requireUser, hashPassword } from "@/server/auth";
import bcrypt from "bcryptjs";

type UserRow = {
  id: string;
  username: string;
  display_name: string;
  designation: string | null;
  avatar_url: string | null;
  password_hash: string;
  role: string;
};

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await migrate();
        try {
          requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const body = (await request.json().catch(() => null)) as {
          username?: string;
          password?: string;
          displayName?: string;
          avatarUrl?: string | null;
        } | null;
        const username = (body?.username ?? "").trim().toLowerCase();
        const password = body?.password ?? "";
        const displayName = body?.displayName ?? "";
        const avatarUrl = body?.avatarUrl ?? null;
        if (!username || password.length < 8 || !displayName) {
          return Response.json({ error: "Username, password (8+ chars), and display name are required." }, { status: 400 });
        }
        const existing = await q<UserRow>("SELECT id FROM users WHERE username = ? LIMIT 1", [username]);
        if (existing.length > 0) {
          return Response.json({ error: "That username already exists." }, { status: 409 });
        }
        const hash = await bcrypt.hash(password, 10);
        const id = newId();
        await q(
          "INSERT INTO users (id, username, display_name, designation, avatar_url, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [id, username, displayName, null, avatarUrl, hash, "user", nowIso()],
        );
        return Response.json({ ok: true, id });
      },
      GET: async ({ request }) => {
        await migrate();
        try {
          requireUser(request);
        } catch (res) {
          return res as Response;
        }
        const rows = await q<UserRow>("SELECT id, username, display_name, designation, avatar_url, role FROM users ORDER BY display_name");
        return Response.json({
          users: rows.map((r) => ({
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
