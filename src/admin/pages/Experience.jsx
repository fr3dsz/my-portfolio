import { FileUser } from "lucide-react";
import { CollectionList } from "../components/CollectionList";
import { DocumentEditor } from "../components/DocumentEditor";
import { StringListField, TextField } from "../components/fields";
import { Section } from "../components/ui";

const EXPERIENCE_QUERY = `*[_type == "experience"] | order(orderRank asc, order asc) {
  _id, _originalId, title, job, date, orderRank
}`;

export function ExperienceList() {
  return (
    <CollectionList
      title="Experience"
      description="Shown on the Experience timeline, top to bottom in this order."
      documentType="experience"
      basePath="/admin/experience"
      itemLabel="entry"
      newDocument={{ title: "Untitled role" }}
      ordered
      query={EXPERIENCE_QUERY}
      emptyIcon={FileUser}
      emptyTitle="No experience yet"
      emptyText="Add roles, internships or major projects with dates and a few highlights."
      renderRow={(entry) => (
        <div className="flex min-w-0 items-baseline gap-4">
          <span className="w-28 shrink-0 font-mono text-xs text-stone">{entry.date || "No dates"}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm text-ink">{entry.title || "Untitled role"}</span>
            {entry.job && <span className="block truncate text-xs text-stone">{entry.job}</span>}
          </span>
        </div>
      )}
    />
  );
}

export function ExperienceEditor({ id }) {
  const handle = { documentId: id, documentType: "experience" };
  return (
    <DocumentEditor handle={handle} title="Untitled role" titlePath="title" backTo="/admin/experience" backLabel="All experience" canDelete>
      <Section title="Role">
        <TextField handle={handle} path="title" label="Title" placeholder="e.g. Software Engineering Intern" />
        <TextField handle={handle} path="job" label="Organisation" placeholder="Company, school or client" />
        <TextField handle={handle} path="date" label="Dates" hint='Free text, e.g. "2023 – 2024" or "2025 – Present".' placeholder="2025 – Present" />
      </Section>
      <Section title="Highlights" description="One line each: what you did and what it achieved.">
        <StringListField handle={handle} path="contents" addLabel="Add highlight" itemLabel="Highlight" placeholder="Built …" />
      </Section>
    </DocumentEditor>
  );
}
