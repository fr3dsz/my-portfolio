import { createClient } from "@sanity/client";

// public identifiers — also used by the admin (src/admin) to configure the App SDK
export const projectId = "cnu9hemn";
export const dataset = "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // fine for public, read-only, non-time-critical data
});
