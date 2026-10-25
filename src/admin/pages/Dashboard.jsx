import { Suspense } from "react";
import { useQuery } from "@sanity/sdk-react";
import { ArrowRight, Check, CircleAlert, ExternalLink, LayoutList, Plus } from "lucide-react";
import { baseId, formatRelative, routeForDocument, TYPE_LABELS } from "../lib";
import { panelClass } from "../styles";
import { Link, PageHeader, Skeleton } from "../components/ui";
import { useCreateRanked } from "../useCollection";

// "raw" so drafts are visible as separate documents (for the drafts count and recency).
const OVERVIEW_QUERY = `{
  "homePage": *[_id == "homePage"][0]{ "total": count(sections), "hidden": count(sections[enabled == false]) },
  "settings": *[_id == "siteSettings"][0]{ "hasResume": defined(resume.asset), "hasEmail": defined(email) },
  "about": *[_id == "about"][0]{ "hasPhoto": defined(photo.asset), "bio": count(bio), "techGroups": count(techGroups) },
  "projects": count(*[_type == "project" && !(_id in path("drafts.**"))]),
  "experiences": count(*[_type == "experience" && !(_id in path("drafts.**"))]),
  "techStack": count(*[_type == "techStack" && !(_id in path("drafts.**"))]),
  "projectsWithoutImage": *[_type == "project" && !(_id in path("drafts.**")) && !defined(image.asset)]{ _id, title },
  "unranked": count(*[_type in ["project", "experience"] && !defined(orderRank)]),
  "drafts": *[_id in path("drafts.**")]{ _id, _type },
  "recent": *[_type in ["project", "experience", "techStack", "about", "siteSettings", "homePage"]] | order(_updatedAt desc)[0...12]{
    _id, _type, _updatedAt, "title": coalesce(title, name, heading)
  }
}`;

const buildChecks = (o) => [
  { ok: Boolean(o.homePage?.total), label: "Page layout has sections", hint: "Without it the site uses its built-in default layout.", to: "/admin/layout" },
  { ok: Boolean(o.settings?.hasEmail), label: "Site settings filled in", to: "/admin/settings" },
  { ok: Boolean(o.settings?.hasResume), label: "Résumé uploaded", hint: "The Contact section shows a download button once it exists.", to: "/admin/settings" },
  { ok: Boolean(o.about?.bio), label: "About bio written", to: "/admin/about" },
  { ok: Boolean(o.about?.hasPhoto), label: "About photo added", to: "/admin/about" },
  { ok: Boolean(o.about?.techGroups), label: "Tech stack groups set", hint: "Until then the site shows its built-in list.", to: "/admin/about" },
  {
    ok: o.projectsWithoutImage.length === 0,
    label: o.projectsWithoutImage.length ? `${o.projectsWithoutImage.length} project${o.projectsWithoutImage.length > 1 ? "s" : ""} without an image` : "Every project has an image",
    hint: o.projectsWithoutImage.map((p) => p.title || "Untitled").join(", "),
    to: o.projectsWithoutImage.length === 1 ? routeForDocument("project", o.projectsWithoutImage[0]._id) : "/admin/projects",
  },
  { ok: o.unranked === 0, label: o.unranked ? `${o.unranked} project/experience entries not yet ordered` : "Projects and experience are ordered", hint: "Reorder them once on their pages.", to: "/admin/projects" },
];

function Checklist({ checks }) {
  const open = checks.filter((check) => !check.ok);
  const done = checks.filter((check) => check.ok);
  return (
    <section aria-labelledby="todo-heading" className={panelClass}>
      <div className="flex items-baseline justify-between border-b border-line px-5 py-4">
        <h2 id="todo-heading" className="text-base font-medium text-ink">
          {open.length ? "Still to do" : "Everything's in place"}
        </h2>
        <span className="font-mono text-xs text-stone">
          {done.length}/{checks.length} done
        </span>
      </div>
      <ul>
        {[...open, ...done].map((check) => (
          <li key={check.label} className="border-b border-line last:border-b-0">
            <Link to={check.to} className="group flex items-start gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-elevated/60">
              {check.ok ? <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-status" /> : <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />}
              <span className="min-w-0 flex-1">
                <span className={`block text-sm ${check.ok ? "text-stone" : "text-ink"}`}>{check.label}</span>
                {!check.ok && check.hint && <span className="mt-0.5 block text-xs text-stone">{check.hint}</span>}
              </span>
              {!check.ok && <ArrowRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-stone transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Recent({ recent, draftIds }) {
  // a draft and its published copy are one item; keep the newest
  const seen = new Set();
  const items = recent.filter((doc) => !seen.has(baseId(doc._id)) && seen.add(baseId(doc._id))).slice(0, 6);
  return (
    <section aria-labelledby="recent-heading" className={panelClass}>
      <h2 id="recent-heading" className="border-b border-line px-5 py-4 text-base font-medium text-ink">
        Recently edited
      </h2>
      <ul>
        {items.map((doc) => (
          <li key={doc._id} className="border-b border-line last:border-b-0">
            <Link to={routeForDocument(doc._type, doc._id)} className="flex items-baseline gap-3 px-5 py-3 transition-colors duration-150 hover:bg-elevated/60">
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{doc.title || TYPE_LABELS[doc._type]}</span>
              {draftIds.has(baseId(doc._id)) && <span className="text-xs text-stone">draft</span>}
              <span className="shrink-0 text-xs text-stone">
                {TYPE_LABELS[doc._type]} · <time dateTime={doc._updatedAt}>{formatRelative(doc._updatedAt)}</time>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DashboardContent() {
  const { data } = useQuery({ query: OVERVIEW_QUERY, perspective: "raw" });
  const draftIds = new Set(data.drafts.map((doc) => baseId(doc._id)));
  const counts = [
    { label: "Projects", value: data.projects, to: "/admin/projects" },
    { label: "Experience", value: data.experiences, to: "/admin/experience" },
    { label: "Tech stack", value: data.techStack, to: "/admin/tech" },
    { label: "Unpublished drafts", value: draftIds.size },
  ];

  return (
    <div className="mt-8 space-y-8">
      <dl className="flex flex-wrap gap-x-10 gap-y-4">
        {counts.map((count) => (
          <div key={count.label}>
            <dt className="text-xs text-stone">{count.label}</dt>
            <dd className="mt-1 font-mono text-2xl tabular-nums text-ink">
              {count.to ? (
                <Link to={count.to} className="hover:text-accent">
                  {count.value}
                </Link>
              ) : (
                count.value
              )}
            </dd>
          </div>
        ))}
        {Boolean(data.homePage?.hidden) && (
          <div>
            <dt className="text-xs text-stone">Hidden sections</dt>
            <dd className="mt-1 font-mono text-2xl tabular-nums text-ink">
              <Link to="/admin/layout" className="hover:text-accent">
                {data.homePage.hidden}
              </Link>
            </dd>
          </div>
        )}
      </dl>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Checklist checks={buildChecks(data)} />
        <Recent recent={data.recent} draftIds={draftIds} />
      </div>
    </div>
  );
}

function NewProjectButton() {
  const [create, creating] = useCreateRanked("project", "/admin/projects");
  return (
    <button
      type="button"
      onClick={() => create({ title: "Untitled project" })}
      disabled={creating}
      className="inline-flex h-9 cursor-pointer items-center gap-2 border border-accent bg-accent px-3.5 text-sm font-medium text-canvas transition-colors duration-150 hover:border-ink hover:bg-ink disabled:opacity-50"
    >
      <Plus aria-hidden="true" className="size-4" />
      New project
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="What's live, what's left, and what changed recently."
        actions={
          <>
            <Link to="/admin/layout" className="inline-flex h-9 items-center gap-2 border border-line px-3.5 text-sm font-medium text-ink transition-colors duration-150 hover:border-stone/60">
              <LayoutList aria-hidden="true" className="size-4" />
              Edit layout
            </Link>
            <Suspense fallback={null}>
              <NewProjectButton />
            </Suspense>
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 px-2 text-sm text-stone transition-colors hover:text-ink">
              View site
              <ExternalLink aria-hidden="true" className="size-3.5" />
            </a>
          </>
        }
      />
      <Suspense
        fallback={
          <div className="mt-8 space-y-8">
            <Skeleton className="h-14 w-96 max-w-full" />
            <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </>
  );
}
