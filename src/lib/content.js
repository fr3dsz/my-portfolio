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

export const fetchSiteSettings = async () => {
  const data = await client.fetch(SITE_SETTINGS_QUERY);
  const settings = withDefaults(
    { ...data, socials: data?.socials?.filter((social) => social?.name && social?.url) },
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
