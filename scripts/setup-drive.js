// scripts/setup-drive.js
// Run: node scripts/setup-drive.js
// Walks you through getting Google Drive OAuth credentials for the single
// team Drive account. Prints the values to paste into .env.
//
// Prerequisites:
//   1. Go to https://console.cloud.google.com/
//      Create a project -> Enable "Google Drive API"
//      APIs & Services -> Credentials -> Create OAuth 2.0 Client ID
//      Application type: Desktop app -> Copy CLIENT_ID and CLIENT_SECRET
//   2. Put them in .env (or pass as env vars)
//
import { google } from "googleapis";
import readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const q = (msg) => new Promise((r) => rl.question(msg, r));

const SCOPE = "https://www.googleapis.com/auth/drive.file";
const REDIRECT = "http://localhost:5199/api/auth/drive/callback";

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? (await q("GOOGLE_CLIENT_ID: "));
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? (await q("GOOGLE_CLIENT_SECRET: "));
  const folderId = (await q("DRIVE_ROOT_FOLDER_ID (create a folder in Drive, get its ID from URL): ")).trim();

  const oauth = new google.auth.OAuth2(clientId, clientSecret, REDIRECT);
  const url = oauth.generateAuthUrl({ access_type: "offline", scope: SCOPE, prompt: "consent" });

  console.log("\nOpen this URL, sign in, allow access:\n");
  console.log(url);
  const code = await q("\nPaste the authorization code here: ");

  const { tokens } = await oauth.getToken(code.trim());
  if (!tokens.refresh_token) {
    console.error("No refresh token received. Try again, consent was not given.");
    process.exit(1);
  }

  console.log("\nAdd these lines to your .env file:\n");
  console.log(`GOOGLE_CLIENT_ID=${clientId}`);
  console.log(`GOOGLE_CLIENT_SECRET=${clientSecret}`);
  console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log(`DRIVE_ROOT_FOLDER_ID=${folderId}`);
  console.log("\nThen restart the dev server. File storage will automatically switch to your Gmail Drive.\n");
  rl.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
