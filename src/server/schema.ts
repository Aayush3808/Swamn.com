import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// Single users table replaces Supabase auth.users + public.profiles + public.user_roles.
// role: 'admin' | 'user'
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  designation: text("designation"),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: text("created_at").notNull(),
});

export const attendance = sqliteTable("member_attendance", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  day: text("day").notNull(),
  status: text("status").notNull().default("present"),
  note: text("note"),
  createdAt: text("created_at").notNull(),
});

export const tasks = sqliteTable("member_tasks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  details: text("details"),
  dueDate: text("due_date"),
  status: text("status").notNull().default("todo"),
  assignedBy: text("assigned_by"),
  createdAt: text("created_at").notNull(),
});

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdBy: text("created_by"),
  createdAt: text("created_at").notNull(),
});

export const leaves = sqliteTable("leave_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  reason: text("reason"),
  status: text("status").notNull().default("pending"),
  decidedBy: text("decided_by"),
  createdAt: text("created_at").notNull(),
});

export const notes = sqliteTable("meeting_notes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  meetingDate: text("meeting_date").notNull(),
  createdBy: text("created_by"),
  createdAt: text("created_at").notNull(),
});

export const activity = sqliteTable("activity_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  detail: text("detail"),
  createdAt: text("created_at").notNull(),
});

// File metadata. Bytes live in ONE place (local ./data/files or single Google
// Drive account when GOOGLE_* env is set). Isolation is enforced by owner_id /
// file_shares checks in API routes — never by Drive sharing.
export const files = sqliteTable("drive_files", {
  id: text("id").primaryKey(),
  driveFileId: text("drive_file_id").notNull(),
  ownerId: text("owner_id").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type"),
  size: text("size"),
  createdAt: text("created_at").notNull(),
});

export const shares = sqliteTable("file_shares", {
  id: text("id").primaryKey(),
  fileId: text("file_id").notNull(),
  ownerId: text("owner_id").notNull(),
  sharedWith: text("shared_with").notNull(),
  createdAt: text("created_at").notNull(),
});
