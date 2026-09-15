import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

let client: Client | null = null;
let db: LibSQLDatabase<typeof schema> | null = null;

function dbUrl() {
  // Turso when env is set (serverless free tier), local file otherwise ($0 dev).
  return process.env["TURSO_DATABASE_URL"] ?? "file:./data/team.db";
}

export function getDb(): LibSQLDatabase<typeof schema> {
  if (db) return db;
  const url = dbUrl();
  client = createClient({
    url,
    authToken: process.env["TURSO_AUTH_TOKEN"],
  });
  db = drizzle(client, { schema });
  return db;
}

export function getClient(): Client {
  getDb();
  return client!;
}

export async function q<T = Record<string, unknown>>(sql: string, args: unknown[] = []): Promise<T[]> {
  const c = getClient();
  const res = await c.execute({ sql, args: args as never[] });
  return (res.rows ?? []) as unknown as T[];
}
const DDL = `
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, designation TEXT, avatar_url TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS member_attendance (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, day TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'present', note TEXT, created_at TEXT NOT NULL, UNIQUE(user_id, day));
CREATE TABLE IF NOT EXISTS member_tasks (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, details TEXT, due_date TEXT, status TEXT NOT NULL DEFAULT 'todo', assigned_by TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS announcements (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, created_by TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS leave_requests (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, reason TEXT, status TEXT NOT NULL DEFAULT 'pending', decided_by TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS meeting_notes (id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL, meeting_date TEXT NOT NULL, created_by TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS activity_log (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, kind TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS drive_files (id TEXT PRIMARY KEY, drive_file_id TEXT NOT NULL, owner_id TEXT NOT NULL, file_name TEXT NOT NULL, mime_type TEXT, size TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS file_shares (id TEXT PRIMARY KEY, file_id TEXT NOT NULL, owner_id TEXT NOT NULL, shared_with TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(file_id, shared_with));
`;

let migrated = false;

export async function migrate() {
  if (migrated) return;
  migrated = true;
  const { promises: fs } = await import("node:fs");
  await fs.mkdir("./data/files", { recursive: true });
  for (const stmt of DDL.split(";").map((s) => s.trim()).filter(Boolean)) {
    await q(stmt);
  }
  await seedAdmin();
}

export function newId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  );
}

export function nowIso() {
  return new Date().toISOString();
}

async function seedAdmin() {
  const username = (process.env["ADMIN_USERNAME"] ?? "admin").trim().toLowerCase();
  const password = process.env["ADMIN_PASSWORD"] ?? "Admin@123";
  const existing = await q("SELECT id FROM users WHERE username = ?", [username]);
  if (existing.length > 0) return;
  const hash = await bcrypt.hash(password, 10);
  await q(
    "INSERT INTO users (id, username, display_name, designation, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [newId(), username, "Team Admin", "Administrator", hash, "admin", nowIso()],
  );
  console.log(`[team-db] seeded admin user "${username}"`);
}
