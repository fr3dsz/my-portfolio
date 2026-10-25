import { Briefcase, ImageOff } from "lucide-react";
import { imageUrl } from "../lib";
import { CollectionList } from "../components/CollectionList";
import { DocumentEditor } from "../components/DocumentEditor";
import { ImageField, StringListField, TechRefsField, TextField } from "../components/fields";
import { Section } from "../components/ui";

const PROJECTS_QUERY = `*[_type == "project"] | order(orderRank asc, order asc) {
  _id, _originalId, title, description, orderRank, "imageRef": image.asset._ref, "tags": tags[]->name
}`;

const isUrl = (value) => (/^https?:\/\/\S+\.\S+/.test(value) ? null : "Use a full link starting with https://");

export function ProjectList() {
  return (
    <CollectionList
      title="Projects"
      description="Shown in the Selected Work section, in this order."
      documentType="project"
      basePath="/admin/projects"
      itemLabel="project"
      newDocument={{ title: "Untitled project" }}
      ordered
      query={PROJECTS_QUERY}
      emptyIcon={Briefcase}
      emptyTitle="No projects yet"
      emptyText="Add your first project: a title, a short description, an image and the tech you used."
      renderRow={(project) => {
        const thumb = imageUrl(project.imageRef, { w: 96, h: 72 });
        return (
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden border border-line bg-canvas">
              {thumb ? <img src={thumb} alt="" className="size-full object-cover" /> : <ImageOff aria-hidden="true" className="size-3.5 text-stone" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">{project.title || "Untitled project"}</p>
              <p className="truncate text-xs text-stone">{project.tags?.filter(Boolean).join(" · ") || project.description || "No description yet"}</p>
            </div>
          </div>
        );
      }}
    />
  );
}

export function ProjectEditor({ id }) {
  const handle = { documentId: id, documentType: "project" };
  return (
    <DocumentEditor handle={handle} title="Untitled project" titlePath="title" backTo="/admin/projects" backLabel="All projects" canDelete>
      <Section title="Basics" description="The row title and summary on the site.">
        <TextField handle={handle} path="title" label="Title" placeholder="e.g. E-learning platform" />
        <TextField handle={handle} path="description" label="Description" hint="One or two sentences. Shown on the row and at the top of the project modal." multiline rows={3} />
        <TextField handle={handle} path="href" label="Live link" hint="Optional. Leave blank if it isn't deployed." placeholder="https://" type="url" validate={isUrl} />
      </Section>
      <Section title="Image" description="Shown on hover and in the modal. Landscape works best.">
        <ImageField handle={handle} path="image" previewClass="aspect-[4/3] w-64 max-w-full" />
      </Section>
      <Section title="Details" description="Bullet points inside the project modal.">
        <StringListField handle={handle} path="subDescription" multiline addLabel="Add point" itemLabel="Point" placeholder="What you built, how, and what came of it" />
      </Section>
      <Section title="Tech used" description="Pick from your tech stack. Add new items under Tech stack.">
        <TechRefsField handle={handle} path="tags" />
      </Section>
    </DocumentEditor>
  );
}
