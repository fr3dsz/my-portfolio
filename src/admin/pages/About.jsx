import { DocumentEditor } from "../components/DocumentEditor";
import { ImageField, InlineInput, ObjectListField, StringListField, TechPicker, TextField } from "../components/fields";
import { Section } from "../components/ui";

const handle = { documentId: "about", documentType: "about" };

export default function About() {
  return (
    <DocumentEditor handle={handle} title="About" description="The About section. Blocks you leave empty don't appear on the site.">
      <Section title="Introduction">
        <TextField handle={handle} path="heading" label="Heading" hint="Leave blank to use “Hi, I'm <your name>”." placeholder="Hi, I'm Luis Conda" />
        <StringListField
          handle={handle}
          path="bio"
          label="Bio"
          hint="One box per paragraph. Lead with what you do now and what you want next."
          multiline
          addLabel="Add paragraph"
          itemLabel="Paragraph"
        />
      </Section>

      <Section title="Photo" description="Optional portrait in the sidebar. Cropped to 4:5.">
        <ImageField handle={handle} path="photo" withAlt previewClass="aspect-[4/5] w-40" />
      </Section>

      <Section title="Currently" description="Short status lines, e.g. Building / Learning / Reading.">
        <ObjectListField
          handle={handle}
          path="currently"
          itemLabel="line"
          addLabel="Add line"
          emptyText="Nothing listed — the block is hidden on the site."
          newItem={() => ({ _type: "currentItem", label: "", value: "" })}
          itemTitle={(item) => [item.label, item.value].filter(Boolean).join(": ")}
          renderItem={(item, update) => (
            <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
              <InlineInput label="Label" value={item.label} placeholder="Building" onChange={(label) => update({ label })} />
              <InlineInput label="Text" value={item.value} placeholder="An AI study-notes app" onChange={(value) => update({ value })} />
            </div>
          )}
        />
      </Section>

      <Section title="Education">
        <ObjectListField
          handle={handle}
          path="education"
          itemLabel="entry"
          addLabel="Add education"
          emptyText="Nothing listed — the block is hidden on the site."
          newItem={() => ({ _type: "educationItem", school: "", credential: "", period: "" })}
          itemTitle={(item) => item.school}
          renderItem={(item, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <InlineInput label="School" value={item.school} onChange={(school) => update({ school })} />
              <InlineInput label="Degree, course or certificate" value={item.credential} onChange={(credential) => update({ credential })} />
              <InlineInput label="Period" value={item.period} placeholder="2021 – 2025" onChange={(period) => update({ period })} mono />
            </div>
          )}
        />
      </Section>

      <Section title="Tech stack groups" description="Grouped lists of your tools. Until you add one, the site shows its built-in list.">
        <ObjectListField
          handle={handle}
          path="techGroups"
          itemLabel="group"
          addLabel="Add group"
          emptyText="No groups yet."
          newItem={() => ({ _type: "techGroup", label: "", items: [] })}
          itemTitle={(group) => group.label}
          renderItem={(group, update) => (
            <>
              <InlineInput label="Group name" value={group.label} placeholder="Frontend" onChange={(label) => update({ label })} />
              <div>
                <p className="text-sm font-medium text-ink">Items</p>
                <div className="mt-2">
                  <TechPicker value={group.items || []} onChange={(items) => update({ items })} />
                </div>
              </div>
            </>
          )}
        />
      </Section>
    </DocumentEditor>
  );
}
