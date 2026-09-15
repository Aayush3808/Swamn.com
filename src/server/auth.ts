import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type SessionUser = { id: string; username: string; role: string; displayName: string };

function jwtSecret() {
  return process.env["JWT_SECRET"] ?? "dev-only-secret-change-me";
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: SessionUser) {
  return jwt.sign(user, jwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, jwtSecret()) as SessionUser;
  } catch {
    return null;
  }
}

export function getBearerToken(request: Request): string | null {
  const header =
    request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  try {
    const url = new URL(request.url);
    const t = url.searchParams.get("t");
    if (t) return t;
  } catch {
    /* ignore */
  }
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)swamn_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function requireUser(request: Request): SessionUser {
  const token = getBearerToken(request);
  const user = token ? verifyToken(token) : null;
  if (!user) throw Response.json({ error: "Unauthorized" }, { status: 401 });
  return user;
}

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function validUsername(value: string) {
  return /^[a-z0-9._-]{3,40}$/.test(value);
}
