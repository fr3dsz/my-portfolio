import { Suspense, useState } from "react";
import { useQuery } from "@sanity/sdk-react";
import { ChevronRight, Plus } from "lucide-react";
import { isDraftId } from "../lib";
import { useCreateRanked, useReorderRanked } from "../useCollection";
import { dragRowClass, useDragReorder } from "../useDragReorder";
import { DragHandle, ReorderControls } from "./Reorder";
import { Button, EmptyState, Link, PageHeader, Skeleton, StatusBadge } from "./ui";

// List page for a document type. `query` must return _id, _originalId and,
// for ordered lists, orderRank; `renderRow` draws the row's main content.

function Rows({ query, ordered, basePath, renderRow, emptyIcon, emptyTitle, emptyText, onCreate, creating, itemLabel }) {
  const { data } = useQuery({ query, perspective: "drafts" });
  // optimistic order, discarded as soon as fresh data arrives
  const [optimistic, setOptimistic] = useState({ base: null, items: null });
  const [move, moveError] = useReorderRanked();
  const items = optimistic.base === data ? optimistic.items : data;

  const onMove = (from, to) => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOptimistic({ base: data, items: next });
    move(items, from, to);
  };
  const itemProps = useDragReorder(onMove);

  if (!items?.length) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        action={
          <Button variant="primary" icon={Plus} loading={creating} onClick={onCreate}>
            Add {itemLabel}
          </Button>
        }
      >
        {emptyText}
      </EmptyState>
    );
  }

  return (
    <>
      {moveError && (
        <p role="alert" className="mb-3 text-sm text-danger">
          {moveError}
        </p>
      )}
      {ordered && <p className="mb-3 text-xs text-stone">Drag rows or use the arrows to set the order shown on the site. New order saves instantly.</p>}
      <ol className="border-y border-line">
        {items.map((item, index) => {
          const draft = isDraftId(item._originalId);
          return (
            <li key={item._id} {...(ordered ? itemProps(index) : {})} className={`flex items-center gap-2 border-b border-line last:border-b-0 ${dragRowClass}`}>
              {ordered && (
                <span className="pl-2">
                  <DragHandle />
                </span>
              )}
              <Link to={`${basePath}/${item._id}`} className="group flex min-w-0 flex-1 items-center gap-4 px-2 py-3 transition-colors duration-150 hover:bg-elevated/60">
                <div className="min-w-0 flex-1">{renderRow(item)}</div>
                <StatusBadge tone={draft ? "draft" : "published"}>{draft ? "Draft" : "Published"}</StatusBadge>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-stone transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              {ordered && <ReorderControls index={index} count={items.length} onMove={onMove} label={item.title || item.name || itemLabel} />}
            </li>
          );
        })}
      </ol>
    </>
  );
}

function CollectionInner({ title, description, documentType, basePath, newDocument, itemLabel, ordered, ...rowProps }) {
  const [create, creating] = useCreateRanked(documentType, basePath, { ranked: ordered });
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button variant="primary" icon={Plus} loading={creating} onClick={() => create(newDocument)}>
            New {itemLabel}
          </Button>
        }
      />
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="space-y-px">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          }
        >
          <Rows basePath={basePath} itemLabel={itemLabel} ordered={ordered} onCreate={() => create(newDocument)} creating={creating} {...rowProps} />
        </Suspense>
      </div>
    </>
  );
}

export function CollectionList(props) {
  return (
    <Suspense fallback={<Skeleton className="h-20 w-full" />}>
      <CollectionInner {...props} />
    </Suspense>
  );
}
