import { createFileRoute } from "@tanstack/react-router";
import { migrate, newId, nowIso, q } from "@/server/db";
import { normalizeUsername, signToken, validUsername, verifyPassword } from "@/server/auth";
import { hashPassword } from "@/server/auth";

type UserRow = {
  id: string;
  username: string;
  display_name: string;
  designation: string | null;
  avatar_url: string | null;
  password_hash: string;
  role: string;
};

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        await migrate();
        const body = (await request.json().catch(() => null)) as {
          username?: string;
          password?: string;
        } | null;
        const username = normalizeUsername(String(body?.username ?? ""));
        const password = String(body?.password ?? "");
        if (!validUsername(username) || !password) {
          return Response.json({ error: "That username or password is not recognised." }, { status: 401 });
        }
        const rows = await q<UserRow>("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
        const user = rows[0];
        if (!user || !(await verifyPassword(password, user.password_hash))) {
          return Response.json({ error: "That username or password is not recognised." }, { status: 401 });
        }
        const token = signToken({
          id: user.id,
          username: user.username,
          role: user.role,
          displayName: user.display_name,
        });
        return Response.json(
          {
            token,
            user: {
              id: user.id,
              username: user.username,
              displayName: user.display_name,
              designation: user.designation,
              avatarUrl: user.avatar_url,
              role: user.role,
            },
          },
          {
            headers: {
              "Set-Cookie": `swamn_token=${encodeURIComponent(token)}; Path=/; Max-Age=604800; SameSite=Lax`,
            },
          },
        );
      },
    },
  },
});

export async function createUserRecord(input: {
  username: string;
  password: string;
  displayName: string;
  role?: string;
  designation?: string | null;
  avatarUrl?: string | null;
}) {
  await migrate();
  const hash = await hashPassword(input.password);
  const id = newId();
  await q(
    "INSERT INTO users (id, username, display_name, designation, avatar_url, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, input.username, input.displayName, input.designation ?? null, input.avatarUrl ?? null, hash, input.role ?? "user", nowIso()],
  );
  return id;
}
