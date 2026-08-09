export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  description,
  subDescription,
  href,
  image { asset->{url} },
  tags[]->{ _id, name, icon { asset->{url} } }
}`;

export const EXPERIENCES_QUERY = `*[_type == "experience"] | order(order asc) {
  _id,
  title,
  job,
  date,
  contents
}`;
