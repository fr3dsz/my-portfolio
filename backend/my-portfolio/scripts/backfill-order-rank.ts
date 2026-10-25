// Gives existing projects and experiences an orderRank (used by the
// drag-and-drop lists) that preserves their current numeric `order`.
// Only touches documents that don't have an orderRank yet, so it is safe to re-run.
//
//   npx sanity exec scripts/backfill-order-rank.ts --with-user-token
import {getCliClient} from 'sanity/cli'
import {LexoRank} from 'lexorank'

const client = getCliClient({apiVersion: '2024-01-01'})

type Doc = {_id: string; orderRank?: string}

for (const type of ['project', 'experience']) {
  // published and draft copies share one position, so rank by base id
  const docs = await client.fetch<Doc[]>(
    `*[_type == $type] | order(order asc, _createdAt asc) {_id, orderRank}`,
    {type},
  )
  const baseIds = [...new Set(docs.map((doc) => doc._id.replace(/^drafts\./, '')))]
  const ranked = docs.filter((doc) => doc.orderRank)
  if (ranked.length === docs.length) {
    console.log(`${type}: all ${docs.length} documents already ranked`)
    continue
  }
  if (ranked.length > 0) {
    // mixing would interleave old and new ranks unpredictably; resolve in the Studio instead
    console.warn(`${type}: ${ranked.length}/${docs.length} already ranked — skipping, reorder in the Studio`)
    continue
  }

  let rank = LexoRank.min()
  const transaction = client.transaction()
  for (const baseId of baseIds) {
    rank = rank.genNext().genNext()
    for (const doc of docs.filter((d) => d._id.replace(/^drafts\./, '') === baseId)) {
      transaction.patch(doc._id, (patch) => patch.set({orderRank: rank.toString()}))
    }
  }
  await transaction.commit()
  console.log(`${type}: ranked ${baseIds.length} documents`)
}
