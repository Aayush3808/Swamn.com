// Single-account file storage.
// - Default ($0): local disk ./data/files/{userId}/ — server owns everything,
//   per-member isolation enforced by API checks (owner_id / file_shares).
// - Personal Gmail Drive (optional): set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
//   GOOGLE_REFRESH_TOKEN and DRIVE_ROOT_FOLDER_ID. Then uploads go to ONE Drive
//   account under per-member subfolders, but members still only see their own
//   files because listing is filtered by DB ownership, never by Drive sharing.
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_ROOT = path.join(process.cwd(), "data", "files");

function driveConfigured() {
  return Boolean(
    process.env["GOOGLE_CLIENT_ID"] &&
      process.env["GOOGLE_CLIENT_SECRET"] &&
      process.env["GOOGLE_REFRESH_TOKEN"],
  );
}

async function driveClient() {
  const { google } = await import("googleapis");
  const oauth = new google.auth.OAuth2(
    process.env["GOOGLE_CLIENT_ID"],
    process.env["GOOGLE_CLIENT_SECRET"],
  );
  oauth.setCredentials({ refresh_token: process.env["GOOGLE_REFRESH_TOKEN"] });
  return google.drive({ version: "v3", auth: oauth });
}

async function ensureUserFolder(drive: Awaited<ReturnType<typeof driveClient>>, userId: string, username: string) {
  const root = process.env["DRIVE_ROOT_FOLDER_ID"]!;
  const name = `${username}_${userId}`;
  const found = await drive.files.list({
    q: `'${root}' in parents and name = '${name.replace(/'/g, "")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
  });
  const existing = found.data.files?.[0]?.id;
  if (existing) return existing;
  const created = await drive.files.create({
    requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: [root] },
    fields: "id",
  });
  return created.data.id!;
}

export async function saveBytes(opts: {
  userId: string;
  username: string;
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
}): Promise<{ driveFileId: string }> {
  if (driveConfigured()) {
    const drive = await driveClient();
    const folderId = await ensureUserFolder(drive, opts.userId, opts.username);
    const created = await drive.files.create({
      requestBody: { name: opts.fileName, parents: [folderId] },
      media: { mimeType: opts.mimeType || "application/octet-stream", body: Buffer.from(opts.bytes) },
      fields: "id",
    });
    return { driveFileId: created.data.id! };
  }
  const dir = path.join(DATA_ROOT, opts.userId);
  await fs.mkdir(dir, { recursive: true });
  const safe = opts.fileName.replace(/[\\/]/g, "_");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safe}`;
  await fs.writeFile(path.join(dir, id), Buffer.from(opts.bytes));
  return { driveFileId: `${opts.userId}/${id}` };
}

export async function readBytes(driveFileId: string): Promise<{ bytes: Buffer; name: string } | null> {
  if (driveConfigured() && !driveFileId.includes("/")) {
    const drive = await driveClient();
    const meta = await drive.files.get({ fileId: driveFileId, fields: "name" });
    const res = await drive.files.get({ fileId: driveFileId, alt: "media" }, { responseType: "arraybuffer" });
    return { bytes: Buffer.from(res.data as ArrayBuffer), name: String(meta.data.name ?? "file") };
  }
  const full = path.join(DATA_ROOT, driveFileId);
  try {
    const bytes = await fs.readFile(full);
    const name = driveFileId.split("/").slice(1).join("/").replace(/^\d+-.{0,8}-/, "") || "file";
    return { bytes, name };
  } catch {
    return null;
  }
}

export async function deleteBytes(driveFileId: string) {
  if (driveConfigured() && !driveFileId.includes("/")) {
    const drive = await driveClient();
    await drive.files.update({ fileId: driveFileId, requestBody: { trashed: true } }).catch(() => null);
    return;
  }
  await fs.unlink(path.join(DATA_ROOT, driveFileId)).catch(() => null);
}
