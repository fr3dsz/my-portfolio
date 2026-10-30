import { Code2 } from "lucide-react";
import { imageUrl } from "../lib";
import { CollectionList } from "../components/CollectionList";
import { DocumentEditor } from "../components/DocumentEditor";
import { ImageField, TextField } from "../components/fields";
import { Section } from "../components/ui";

const TECH_QUERY = `*[_type == "techStack"] | order(lower(name) asc) { _id, _originalId, name, "iconRef": icon.asset._ref }`;

export function TechList() {
  return (
    <CollectionList
      title="Tech stack"
      description="Languages, frameworks and tools. Projects tag these, and About groups them."
      documentType="techStack"
      basePath="/admin/tech"
      itemLabel="item"
      newDocument={{ name: "New tech" }}
      query={TECH_QUERY}
      emptyIcon={Code2}
      emptyTitle="No tech stack items yet"
      emptyText="Add the tools you use. Each one can have a small logo."
      renderRow={(tech) => {
        const icon = imageUrl(tech.iconRef, { w: 40 });
        return (
          <span className="flex items-center gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center">{icon ? <img src={icon} alt="" className="size-5" /> : <Code2 aria-hidden="true" className="size-4 text-stone" />}</span>
            <span className="truncate text-sm text-ink">{tech.name || "Unnamed"}</span>
          </span>
        );
      }}
    />
  );
}

export function TechEditor({ id }) {
  const handle = { documentId: id, documentType: "techStack" };
  return (
    <DocumentEditor handle={handle} title="Unnamed" titlePath="name" backTo="/admin/tech" backLabel="All tech" canDelete>
      <Section title="Item">
        <TextField handle={handle} path="name" label="Name" placeholder="e.g. TypeScript" />
        <ImageField handle={handle} path="icon" label="Logo" hint="SVG or PNG, square. Shown at 16–20px." accept=".svg,.png,image/svg+xml,image/png" previewClass="size-20" />
      </Section>
    </DocumentEditor>
  );
}
