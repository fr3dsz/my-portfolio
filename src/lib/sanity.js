import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "cnu9hemn",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // fine for public, read-only, non-time-critical data
});
