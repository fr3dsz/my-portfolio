import { DocumentEditor } from "../components/DocumentEditor";
import { FileField, InlineInput, ObjectListField, TextField, ToggleField } from "../components/fields";
import { Section } from "../components/ui";

const handle = { documentId: "siteSettings", documentType: "siteSettings" };

const isTimeZone = (value) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return null;
  } catch {
    return 'Not a recognised time zone. Use an IANA name like "Asia/Manila".';
  }
};

const isEmail = (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "That doesn't look like an email address.");

const isLink = (value) => (!value || /^(https?:\/\/\S+\.\S+|mailto:\S+@\S+)$/.test(value) ? null : "Use a full link starting with https:// (or mailto:).");

export default function Settings() {
  return (
    <DocumentEditor handle={handle} title="Site settings" description="Who you are and how to reach you. Used across the hero, About, Contact and footer.">
      <Section title="Identity">
        <TextField handle={handle} path="name" label="Name" placeholder="Luis Conda" />
        <TextField handle={handle} path="role" label="Role" placeholder="Full-stack developer" />
        <TextField handle={handle} path="location" label="Location" hint="Shown as written." placeholder="Manila, PH" />
        <TextField handle={handle} path="timeZone" label="Time zone" hint="Drives the live local-time line in About." placeholder="Asia/Manila" validate={isTimeZone} mono />
      </Section>

      <Section title="Availability" description="The status line in the hero and About.">
        <ToggleField handle={handle} path="availableForWork" label="Available for work" hint="Off shows a hollow dot and muted text." defaultValue />
        <TextField handle={handle} path="availabilityLabel" label="Status text" placeholder="Open to work · remote worldwide" />
      </Section>

      <Section title="Contact" description="The Contact section's email link, copy button and résumé download.">
        <TextField handle={handle} path="email" label="Email" type="email" placeholder="you@example.com" validate={isEmail} />
        <FileField handle={handle} path="resume" label="Résumé (PDF)" hint="The download button appears once a file is uploaded." />
      </Section>

      <Section title="Social links" description="Footer links, in this order.">
        <ObjectListField
          handle={handle}
          path="socials"
          itemLabel="link"
          addLabel="Add link"
          emptyText="No links yet."
          newItem={() => ({ _type: "social", name: "", url: "" })}
          itemTitle={(social) => social.name}
          renderItem={(social, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <InlineInput label="Label" value={social.name} placeholder="GitHub" onChange={(name) => update({ name })} />
              <InlineInput label="Link" value={social.url} placeholder="https://github.com/…" onChange={(url) => update({ url })} error={isLink(social.url)} />
            </div>
          )}
        />
      </Section>
    </DocumentEditor>
  );
}
