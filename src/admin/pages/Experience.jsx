import { Suspense } from "react";
import { FileUser } from "lucide-react";
import { useDocument } from "@sanity/sdk-react";
import { EMPLOYMENT_TYPES, MONTHS, formatExperienceDates, isComplete } from "../../lib/content";
import { CollectionList } from "../components/CollectionList";
import { DocumentEditor } from "../components/DocumentEditor";
import { ImageListField, MonthYearField, SelectField, StringListField, TextField, ToggleField } from "../components/fields";
import { Section, Skeleton } from "../components/ui";

const EXPERIENCE_QUERY = `*[_type == "experience"] | order(orderRank asc, order asc) {
  _id, _originalId, title, job, isCurrent, startDate, endDate, date, orderRank
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
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="sm:w-40 sm:shrink-0 truncate whitespace-nowrap font-mono text-xs text-stone">{formatExperienceDates(entry) || "No dates"}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm text-ink">{entry.title || "Untitled role"}</span>
            {entry.job && <span className="block truncate text-xs text-stone">{entry.job}</span>}
          </span>
        </div>
      )}
    />
  );
}

// Same range as the Studio: 1970 to five years ahead, newest first.
const YEARS = Array.from({ length: new Date().getFullYear() + 5 - 1970 + 1 }, (_, index) => new Date().getFullYear() + 5 - index);

const isEmpty = (date) => !date || (date.month == null && date.year == null);
const monthIndex = (date) => date.year * 12 + date.month;

// Errors are shown inline only; /admin never blocks publishing.
const dateError = (date, name) => (isEmpty(date) ? `${name} is required.` : isComplete(date) ? null : `Pick both a month and a year for the ${name.toLowerCase()}.`);

function DateFields({ handle }) {
  const { data: isCurrent } = useDocument({ ...handle, path: "isCurrent" });
  const { data: startDate } = useDocument({ ...handle, path: "startDate" });
  const { data: legacyDate } = useDocument({ ...handle, path: "date" });
  const current = isCurrent === true;

  const validateStart = (value) => {
    const error = dateError(value, "Start date");
    return error && typeof legacyDate === "string" && legacyDate.trim() ? `${error} Old value: "${legacyDate.trim()}".` : error;
  };
  const validateEnd = (value) => {
    const error = dateError(value, "End date");
    if (error) return error;
    if (isComplete(startDate) && monthIndex(value) < monthIndex(startDate)) return "End date is before the start date.";
    return null;
  };

  return (
    <>
      <ToggleField handle={handle} path="isCurrent" label="I currently work here" />
      <MonthYearField handle={handle} path="startDate" label="Start date" months={MONTHS} years={YEARS} validate={validateStart} />
      {!current && <MonthYearField handle={handle} path="endDate" label="End date" months={MONTHS} years={YEARS} validate={validateEnd} />}
    </>
  );
}

export function ExperienceEditor({ id }) {
  const handle = { documentId: id, documentType: "experience" };
  return (
    <DocumentEditor handle={handle} title="Untitled role" titlePath="title" backTo="/admin/experience" backLabel="All experience" canDelete>
      <Section title="Role">
        <TextField handle={handle} path="title" label="Title" placeholder="e.g. Software Engineering Intern" />
        <TextField handle={handle} path="job" label="Organisation" placeholder="Company, school or client" />
        <SelectField handle={handle} path="employmentType" label="Employment type" options={EMPLOYMENT_TYPES} />
        <Suspense fallback={<Skeleton className="h-9 w-full" />}>
          <DateFields handle={handle} />
        </Suspense>
      </Section>
      <Section title="Highlights" description="One line each: what you did and what it achieved.">
        <StringListField handle={handle} path="contents" addLabel="Add highlight" itemLabel="Highlight" placeholder="Built …" />
      </Section>
      <Section title="Photos" description="Up to 8 photos shown under this entry's highlights. Only add photos of people who have agreed to appear on a public site.">
        <ImageListField handle={handle} path="photos" maxItems={8} />
      </Section>
    </DocumentEditor>
  );
}
