export const PROJECTS_QUERY = `*[_type == "project"] | order(orderRank asc, order asc) {
  _id,
  title,
  description,
  subDescription,
  href,
  image { asset->{url} },
  tags[]->{ _id, name, icon { asset->{url} } }
}`;

export const EXPERIENCES_QUERY = `*[_type == "experience"] | order(orderRank asc, order asc) {
  _id,
  title,
  job,
  date,
  contents
}`;


// Singletons live under fixed ids equal to their type (see backend sanity.config.ts).
export const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0] {
  name,
  role,
  location,
  timeZone,
  availableForWork,
  availabilityLabel,
  email,
  "resumeUrl": resume.asset->url,
  socials[] { name, url }
}`;

export const ABOUT_QUERY = `*[_id == "about"][0] {
  heading,
  bio,
  photo { alt, asset->{ url } },
  currently[] { label, value },
  education[] { school, credential, period },
  techGroups[] { label, items[]->{ name, "iconUrl": icon.asset->url } }
}`;

export const HOME_PAGE_QUERY = `*[_id == "homePage"][0] { sections[] }`;
