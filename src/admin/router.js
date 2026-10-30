import { useSyncExternalStore } from "react";

// Minimal History-API router for the admin's handful of routes; the public
// site has no routing at all, so a dependency isn't worth it here.

const subscribe = (onChange) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname.replace(/\/+$/, "") || "/");

export const navigate = (to) => {
  if (to === window.location.pathname) return;
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
};

// "/admin/projects/:id" against "/admin/projects/abc" → { id: "abc" }; null when it doesn't match
export const matchPath = (pattern, path) => {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    else if (patternParts[i] !== pathParts[i]) return null;
  }
  return params;
};
