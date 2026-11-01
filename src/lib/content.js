import { client } from "./sanity";
import { ABOUT_QUERY, HOME_PAGE_QUERY, SITE_SETTINGS_QUERY } from "./queries";
import { defaultAbout, defaultSections, defaultSettings } from "../constants";

const isFilled = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Field-by-field: a CMS value wins only when it is actually filled in, so a
// half-finished singleton never blanks out parts of the page.
const withDefaults = (data, defaults) =>
  Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, isFilled(data?.[key]) ? data[key] : fallback]));

// The admin's link validation only warns, so a stored link is rechecked before it becomes an href.
export const isSafeUrl = (value) => {
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

export const fetchSiteSettings = async () => {
  const data = await client.fetch(SITE_SETTINGS_QUERY);
  const settings = withDefaults(
    { ...data, socials: data?.socials?.filter((social) => social?.name && isSafeUrl(social?.url)) },
    defaultSettings
  );
  // The default label claims availability, so it must not stand in when the owner is unavailable.
  if (data?.availableForWork === false && !isFilled(data?.availabilityLabel)) return { ...settings, availabilityLabel: "" };
  return settings;
};

export const fetchAbout = async () => {
  const data = await client.fetch(ABOUT_QUERY);
  return withDefaults(
    {
      ...data,
      bio: data?.bio?.filter(isFilled),
      photo: data?.photo?.asset?.url ? { url: data.photo.asset.url, alt: data.photo.alt || "" } : null,
      techGroups: data?.techGroups
        ?.map((group) => ({ label: group.label, items: (group.items || []).filter((item) => item?.name) }))
        .filter((group) => group.label && group.items.length > 0),
    },
    defaultAbout
  );
};

const typeDefaults = Object.fromEntries(defaultSections.map((section) => [section._type, section]));

const slugify = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Drops hidden and unknown sections, fills blank fields from the type's
// defaults, and assigns each section a unique anchor and its display number.
export const normalizeSections = (sections, knownTypes) => {
  const pickVisible = (list) => (list || []).filter((section) => section?._type && knownTypes.has(section._type) && section.enabled !== false);
  let visible = pickVisible(sections);
  if (visible.length === 0) visible = pickVisible(defaultSections);

  const usedAnchors = new Set();
  return visible.map((section, index) => {
    const defaults = typeDefaults[section._type] || {};
    const merged = { ...defaults, ...Object.fromEntries(Object.entries(section).filter(([, value]) => isFilled(value))) };
    // a blank navLabel means "not in nav", so it is never refilled from defaults
    merged.navLabel = isFilled(section.navLabel) ? section.navLabel.trim() : "";

    const base = slugify(merged.anchor) || slugify(merged.title) || `section-${index + 1}`;
    let anchor = base;
    for (let n = 2; usedAnchors.has(anchor); n++) anchor = `${base}-${n}`;
    usedAnchors.add(anchor);

    return { ...merged, key: section._key || anchor, anchor, code: String(index + 1).padStart(2, "0") };
  });
};

export const fetchHomeSections = async (knownTypes) => {
  const data = await client.fetch(HOME_PAGE_QUERY);
  return normalizeSections(data?.sections, knownTypes);
};

// ── experience dates ─────────────────────────────────────────────────────
// Keep the type and month lists in sync with backend/my-portfolio/schemaTypes/experience.ts.

export const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "self-employed", label: "Self-employed" },
  { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "apprenticeship", label: "Apprenticeship" },
  { value: "seasonal", label: "Seasonal" },
];

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((label, index) => ({ value: index + 1, label }));

export const employmentTypeLabel = (value) => EMPLOYMENT_TYPES.find((type) => type.value === value)?.label ?? "";

const hasYear = (date) => Number.isInteger(date?.year);
const hasMonth = (date) => Number.isInteger(date?.month) && date.month >= 1 && date.month <= 12;
const isComplete = (date) => hasYear(date) && hasMonth(date);

// "Jan 2023", or just "2023" when only the year is stored.
const formatDate = (date) => {
  if (!hasYear(date)) return "";
  return hasMonth(date) ? `${MONTHS[date.month - 1].label} ${date.year}` : String(date.year);
};

// New fields win once the start date has a year; before that the legacy check on `date` applies.
export const isCurrentRole = (item) => (hasYear(item?.startDate) ? item.isCurrent === true : Boolean(item?.date?.toLowerCase().includes("present")));

export const formatExperienceDates = (item) => {
  if (!hasYear(item?.startDate)) return item?.date?.trim() || "";
  const start = formatDate(item.startDate);
  const end = item.isCurrent === true ? "Present" : formatDate(item.endDate);
  return end ? `${start} – ${end}` : start;
};

// Inclusive month count, e.g. "2 yrs 3 mos"; empty when either end lacks a month and year.
export const formatExperienceDuration = (item, now = new Date()) => {
  if (!isComplete(item?.startDate)) return "";
  const current = item.isCurrent === true;
  const end = current ? { month: now.getMonth() + 1, year: now.getFullYear() } : item.endDate;
  if (!isComplete(end)) return "";

  const total = (end.year - item.startDate.year) * 12 + (end.month - item.startDate.month) + 1;
  if (total < 1) return "";

  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years} ${years === 1 ? "yr" : "yrs"}`, months && `${months} ${months === 1 ? "mo" : "mos"}`].filter(Boolean).join(" ");
};
