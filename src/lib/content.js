import { client } from "./sanity";
import { ABOUT_QUERY, SITE_SETTINGS_QUERY } from "./queries";
import { defaultAbout, defaultSettings } from "../constants";

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
  return withDefaults(
    { ...data, socials: data?.socials?.filter((social) => social?.name && social?.url) },
    defaultSettings
  );
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
