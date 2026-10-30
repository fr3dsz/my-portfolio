import { defaultSections } from "../../constants";
import { DocumentEditor } from "../components/DocumentEditor";
import { InlineInput, ObjectListField, StringListEditor, Switch } from "../components/fields";
import { Section } from "../components/ui";

const handle = { documentId: "homePage", documentType: "homePage" };

const TYPE_LABELS = {
  heroSection: "Hero",
  aboutSection: "About",
  projectsSection: "Projects",
  experienceSection: "Experience",
  contactSection: "Contact",
  textSection: "Text",
};

const SOURCES = {
  aboutSection: "Content comes from About.",
  projectsSection: "Lists every project, in the order set on Projects.",
  experienceSection: "Lists every experience entry, in the order set on Experience.",
  contactSection: "Email and résumé come from Site settings.",
};

// New sections start from the same defaults the site falls back to (src/constants).
const newSection = (type) => {
  const fields = { ...(defaultSections.find((section) => section._type === type) || { title: "New section", navLabel: "", anchor: "" }) };
  delete fields._key;
  return { ...fields, _type: type, enabled: true };
};

const isAnchor = (value) => (!value || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) ? null : "Lowercase letters, numbers and dashes only, e.g. selected-work.");

// position among visible sections → the "01", "02"… the site shows; null when hidden
const sectionCode = (section, sections) => {
  if (section.enabled === false) return null;
  const position = sections.filter((other) => other.enabled !== false).findIndex((other) => other._key === section._key);
  return String(position + 1).padStart(2, "0");
};

function SectionFields({ section, update }) {
  return (
    <>
      {SOURCES[section._type] && <p className="text-xs text-stone">{SOURCES[section._type]}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        {section._type !== "heroSection" && <InlineInput label="Title" value={section.title} onChange={(title) => update({ title })} />}
        <InlineInput label="Nav label" hint="Blank keeps it out of the nav." value={section.navLabel} onChange={(navLabel) => update({ navLabel })} />
        <InlineInput label="Anchor" hint={section.anchor ? `Links to /#${section.anchor}` : "Blank: made from the title."} value={section.anchor} onChange={(anchor) => update({ anchor })} error={isAnchor(section.anchor)} mono />
      </div>

      {section._type === "heroSection" && (
        <>
          <InlineInput label="Intro" hint="Wrap words in *asterisks* to emphasise them." value={section.standfirst} onChange={(standfirst) => update({ standfirst })} multiline />
          <InlineInput label="Stack line" value={section.stackLine} placeholder="React · Node · C# · Tailwind" onChange={(stackLine) => update({ stackLine })} />
        </>
      )}
      {section._type === "contactSection" && <InlineInput label="Intro" value={section.intro} onChange={(intro) => update({ intro })} multiline />}
      {section._type === "textSection" && (
        <div>
          <p className="text-sm font-medium text-ink">Paragraphs</p>
          <div className="mt-2">
            <StringListEditor items={section.body || []} onChange={(body) => update({ body })} multiline addLabel="Add paragraph" itemLabel="Paragraph" />
          </div>
        </div>
      )}
    </>
  );
}

export default function Layout() {
  return (
    <DocumentEditor handle={handle} title="Page layout" description="The sections of your home page, top to bottom. Numbers and the navigation follow this order.">
      <Section title="Sections" description="Drag or use the arrows to reorder. Switch a section off to hide it without losing its settings.">
        <ObjectListField
          handle={handle}
          path="sections"
          itemLabel="section"
          addLabel="Add section"
          emptyText="No sections — the site falls back to its default layout."
          addOptions={Object.entries(TYPE_LABELS).map(([type, label]) => ({ label, newItem: () => newSection(type) }))}
          itemTitle={(section) => section.title || TYPE_LABELS[section._type]}
          headerExtra={(section, update, sections) => <SectionHeader section={section} update={update} code={sectionCode(section, sections)} />}
          renderItem={(section, update) => <SectionFields section={section} update={update} />}
        />
      </Section>
    </DocumentEditor>
  );
}

function SectionHeader({ section, update, code }) {
  const visible = section.enabled !== false;
  return (
    <span className="flex shrink-0 items-center gap-3">
      <span className="hidden text-xs text-stone sm:inline">
        {TYPE_LABELS[section._type] ?? section._type}
        {code && <span className="ml-2 font-mono tabular-nums text-ink">{code}</span>}
      </span>
      <span className={`text-xs ${visible ? "text-ink" : "text-stone"}`}>{visible ? "Visible" : "Hidden"}</span>
      <Switch checked={visible} onChange={(enabled) => update({ enabled })} label={`Show ${section.title || TYPE_LABELS[section._type]} on the site`} />
    </span>
  );
}

