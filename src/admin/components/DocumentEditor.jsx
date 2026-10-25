import { Suspense } from "react";
import { useDocument } from "@sanity/sdk-react";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { navigate } from "../router";
import { PublishBar } from "./PublishBar";
import { EmptyState, Link, PageHeader, Skeleton } from "./ui";

function EditorInner({ handle, title, titlePath, description, backTo, backLabel, canDelete, children }) {
  const { data: document } = useDocument(handle);
  const { data: liveTitle } = useDocument({ ...handle, path: titlePath || "_id" });

  if (!document) {
    return (
      <EmptyState icon={FileQuestion} title="This document doesn't exist" action={backTo && <Link to={backTo} className="text-sm text-accent underline underline-offset-4">{backLabel}</Link>}>
        It may have been deleted, or the link is wrong.
      </EmptyState>
    );
  }

  return (
    <>
      <PublishBar handle={handle} canDelete={canDelete} onDeleted={() => backTo && navigate(backTo)} />
      <div className="mt-6">
        <PageHeader title={(titlePath && liveTitle) || title} description={description} />
        {children}
      </div>
    </>
  );
}

export function DocumentEditor({ backTo, backLabel = "Back", ...props }) {
  return (
    <>
      {backTo && (
        <Link to={backTo} className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone transition-colors hover:text-ink">
          <ArrowLeft aria-hidden="true" className="size-4" />
          {backLabel}
        </Link>
      )}
      <Suspense
        fallback={
          <div className="space-y-6">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <EditorInner backTo={backTo} backLabel={backLabel} {...props} />
      </Suspense>
    </>
  );
}
