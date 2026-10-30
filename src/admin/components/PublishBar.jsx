import { Suspense, useEffect, useState } from "react";
import { deleteDocument, discardDocument, publishDocument, useApplyDocumentActions, useDocument } from "@sanity/sdk-react";
import { Check, Trash2, Undo2, UploadCloud } from "lucide-react";
import { baseId, isDraftId } from "../lib";
import { Button, Skeleton, StatusBadge } from "./ui";

// Sticky bar on every editor: shows draft state and publishes or discards it.
// Edits land in a draft immediately; the public site only sees published data.

function useFlash() {
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [message]);
  return [message, setMessage];
}

function PublishBarInner({ handle, canDelete, onDeleted }) {
  const { data: document } = useDocument(handle);
  const apply = useApplyDocumentActions();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useFlash();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const target = { documentId: baseId(handle.documentId), documentType: handle.documentType };
  const hasDraft = isDraftId(document?._id);

  const run = async (kind, action, done) => {
    setBusy(kind);
    setError(null);
    try {
      await apply(action);
      done?.();
    } catch (err) {
      setError(err.message || `Couldn't ${kind}.`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="sticky top-14 z-20 -mx-4 border-b border-line bg-canvas px-4 py-3 sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3" aria-live="polite">
          {flash ? (
            <span className="inline-flex items-center gap-2 text-sm text-ink">
              <Check aria-hidden="true" className="size-4 text-status" />
              {flash}
            </span>
          ) : hasDraft ? (
            <>
              <StatusBadge tone="draft">Unpublished changes</StatusBadge>
              <span className="hidden text-xs text-stone sm:inline">Only you can see these until you publish.</span>
            </>
          ) : (
            <StatusBadge tone="published">Published</StatusBadge>
          )}
          {error && <span className="text-xs text-danger">{error}</span>}
        </div>

        <div className="flex items-center gap-2">
          {canDelete &&
            (confirmDelete ? (
              <>
                <span className="text-xs text-stone">Delete for good?</span>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="danger" icon={Trash2} loading={busy === "delete"} onClick={() => run("delete", deleteDocument(target), onDeleted)}>
                  Delete
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            ))}
          {hasDraft && !confirmDelete && (
            <>
              <Button size="sm" variant="ghost" icon={Undo2} loading={busy === "discard"} onClick={() => run("discard", discardDocument(target), () => setFlash("Changes discarded"))}>
                Discard
              </Button>
              <Button size="sm" variant="primary" icon={UploadCloud} loading={busy === "publish"} onClick={() => run("publish", publishDocument(target), () => setFlash("Published — live on the site shortly"))}>
                Publish
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function PublishBar(props) {
  return (
    <Suspense fallback={<Skeleton className="h-14 w-full" />}>
      <PublishBarInner {...props} />
    </Suspense>
  );
}
