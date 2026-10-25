import { LexoRank } from "lexorank";
import { dataset, projectId } from "../lib/sanity";

export const API_VERSION = "2024-01-01";

export const STUDIO_URL = "https://fr3dsz-portfolio.sanity.studio";

// Array items in Sanity need a unique _key.
export const newKey = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

export const baseId = (id = "") => id.replace(/^drafts\./, "");

export const isDraftId = (id = "") => id.startsWith("drafts.");

// "image-<hash>-<w>x<h>-<ext>" → CDN URL, resized server-side
export const imageUrl = (ref, { w, h } = {}) => {
  const match = /^image-([a-zA-Z0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref || "");
  if (!match) return "";
  const [, hash, size, ext] = match;
  const params = new URLSearchParams({ auto: "format", ...(w && { w: String(w) }), ...(h && { h: String(h), fit: "crop" }) });
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${size}.${ext}?${params}`;
};

// "file-<hash>-<ext>" → CDN URL
export const fileUrl = (ref) => {
  const match = /^file-([a-zA-Z0-9]+)-(\w+)$/.exec(ref || "");
  return match ? `https://cdn.sanity.io/files/${projectId}/${dataset}/${match[1]}.${match[2]}` : "";
};

// LexoRank strings, compatible with @sanity/orderable-document-list in the Studio.
export const rankAfter = (last) => (last ? LexoRank.parse(last).genNext().genNext() : LexoRank.min().genNext()).toString();

// Rank for an item dropped between `prev` and `next` (either may be missing).
export const rankBetween = (prev, next) => {
  if (prev && next) return LexoRank.parse(prev).between(LexoRank.parse(next)).toString();
  if (prev) return LexoRank.parse(prev).genNext().toString();
  if (next) return LexoRank.parse(next).genPrev().toString();
  return LexoRank.middle().toString();
};

export const moveItem = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export const formatRelative = (iso) => {
  if (!iso) return "";
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) if (seconds >= size) return rtf.format(-Math.floor(seconds / size), unit);
  return "just now";
};

// Admin page that edits a given document.
export const routeForDocument = (type, id) =>
  ({
    project: `/admin/projects/${baseId(id)}`,
    experience: `/admin/experience/${baseId(id)}`,
    techStack: `/admin/tech/${baseId(id)}`,
    about: "/admin/about",
    siteSettings: "/admin/settings",
    homePage: "/admin/layout",
  })[type] ?? "/admin";

export const TYPE_LABELS = {
  project: "Project",
  experience: "Experience",
  techStack: "Tech stack",
  about: "About",
  siteSettings: "Site settings",
  homePage: "Page layout",
};
