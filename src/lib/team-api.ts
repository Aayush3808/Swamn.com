// Own-backend client (Turso + JWT). Replaces Supabase client for team features.
// UI/CSS untouched — same components call these helpers instead of supabase.*.
// Lovable AI chatbot (/api/public/chat) is intentionally left as-is.
const KEY = "swamn_token";

export function getToken() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = "swamn_token=; Path=/; Max-Age=0; SameSite=Lax";
  } catch {
    /* ignore */
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && typeof init.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(path, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  return (await res.json().catch(() => ({}))) as T;
}

export type TeamUser = {
  id: string;
  username: string;
  displayName: string;
  designation: string | null;
  avatarUrl: string | null;
  role: string;
};

export async function login(username: string, password: string) {
  const data = await api<{ token: string; user: TeamUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  try {
    document.cookie = `swamn_token=${encodeURIComponent(data.token)}; Path=/; Max-Age=604800; SameSite=Lax`;
  } catch {
    /* ignore */
  }
  return data;
}

export async function me() {
  const data = await api<{ user: TeamUser }>("/api/auth/me");
  return data.user;
}
