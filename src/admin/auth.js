import { createContext, useContext } from "react";
import { projectId } from "../lib/sanity";

// sanity.io/login and api.sanity.io reject origins outside Sanity's own domains. The project
// host accepts any origin in the project's CORS list, so sign-in goes through it instead.
const API_URL = `https://${projectId}.api.sanity.io/v2021-06-07`;

const request = async (path, token) => {
  const res = await fetch(`${API_URL}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error(`Sanity responded with ${res.status}`);
  return res.json();
};

// The sid is single-use and shouldn't linger in the address bar or browser history.
const takeSid = () => {
  const url = new URL(window.location.href);
  const sid = url.searchParams.get("sid") || new URLSearchParams(url.hash.slice(1)).get("sid");
  if (!sid) return null;
  url.searchParams.delete("sid");
  url.hash = "";
  window.history.replaceState(window.history.state, "", url);
  return sid;
};

// The token stays in memory on purpose, so a reload means signing in again.
const startSession = async () => {
  const sid = takeSid();
  if (!sid) return null;
  const { token } = await request(`/auth/fetch?sid=${encodeURIComponent(sid)}`);
  const user = await request("/users/me", token);
  return user?.id ? { token, user } : null;
};

// Shared so StrictMode's second effect run doesn't try to spend the same sid again.
let pendingSession = null;
export const loadSession = () => (pendingSession ??= startSession());

export const endSession = async (token) => {
  pendingSession = null;
  await fetch(`${API_URL}/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
};

export const loginUrl = (provider) => {
  const { origin, pathname } = window.location;
  const params = new URLSearchParams({ origin: `${origin}${pathname}`, type: "token", withSid: "true" });
  return `${API_URL}/auth/login/${provider}?${params}`;
};

export const AuthContext = createContext(null);
export const useAdminAuth = () => useContext(AuthContext);
