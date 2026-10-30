import { useState } from "react";
import { createDocument, createDocumentHandle, useApplyDocumentActions, useClient } from "@sanity/sdk-react";
import { API_VERSION, baseId, rankAfter, rankBetween } from "./lib";
import { navigate } from "./router";

// Ordered collections (projects, experience) share the Studio's orderRank
// field, so ordering done here and in the Studio's drag-and-drop list agree.

// Creates a draft (at the end of the list when ranked) and opens its editor.
export function useCreateRanked(documentType, basePath, { ranked = true } = {}) {
  const client = useClient({ apiVersion: API_VERSION });
  const apply = useApplyDocumentActions();
  const [creating, setCreating] = useState(false);

  const create = async (initialValue = {}) => {
    setCreating(true);
    try {
      const handle = createDocumentHandle({ documentId: crypto.randomUUID(), documentType });
      let rank = {};
      if (ranked) {
        const last = await client.fetch(`*[_type == $type && defined(orderRank)] | order(orderRank desc)[0].orderRank`, { type: documentType }, { perspective: "raw" });
        rank = { orderRank: rankAfter(last) };
      }
      await apply(createDocument(handle, { ...initialValue, ...rank }));
      navigate(`${basePath}/${handle.documentId}`);
    } finally {
      setCreating(false);
    }
  };

  return [create, creating];
}

// Moves items[from] to position `to` by giving it a rank between its new neighbours.
// The rank is patched onto the published document and its draft directly (like the
// Studio plugin), so reordering takes effect without a publish step.
export function useReorderRanked() {
  const client = useClient({ apiVersion: API_VERSION });
  const [error, setError] = useState(null);

  const move = async (items, from, to) => {
    if (from === to) return;
    setError(null);
    const rest = items.filter((_, index) => index !== from);
    const prev = rest[to - 1]?.orderRank;
    const next = rest[to]?.orderRank;
    const id = baseId(items[from]._id);
    try {
      // A neighbour without a rank (legacy data) can't be ranked between,
      // so in that case re-rank the whole list in its new order.
      const neighboursRanked = (to === 0 || prev) && (to === rest.length || next);
      let patches;
      if (neighboursRanked) {
        patches = [[id, rankBetween(prev, next)]];
      } else {
        let rank = null;
        patches = [...rest.slice(0, to), items[from], ...rest.slice(to)].map((item) => {
          rank = rankAfter(rank);
          return [baseId(item._id), rank];
        });
      }

      const ids = patches.flatMap(([docId]) => [docId, `drafts.${docId}`]);
      const existing = new Set(await client.fetch(`*[_id in $ids]._id`, { ids }, { perspective: "raw" }));
      const transaction = client.transaction();
      for (const [docId, rank] of patches) {
        for (const target of [docId, `drafts.${docId}`]) if (existing.has(target)) transaction.patch(target, (patch) => patch.set({ orderRank: rank }));
      }
      await transaction.commit({ visibility: "async" });
    } catch (err) {
      setError(err.message || "Couldn't save the new order.");
    }
  };

  return [move, error];
}
