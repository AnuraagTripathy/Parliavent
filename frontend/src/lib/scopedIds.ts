/**
 * Judge finding ids (e.g. "finding-claim-1") are LLM-generated and only unique
 * within a single post, but they are used as global primary keys in Postgres.
 * Server routes prefix them with the owning post id before writing so two
 * posts can never collide on the same finding row.
 *
 * The startsWith guard keeps already-scoped ids stable when a post loaded
 * from the database is re-published.
 */
export function scopedFindingId(postId: string, findingId: string): string {
  const prefix = `${postId}-`;
  return findingId.startsWith(prefix) ? findingId : `${prefix}${findingId}`;
}

/**
 * Evidence source ids are derived from URLs (e.g. "evidence-0-example-com-...")
 * and can collide across findings from different users. Scope them per finding.
 */
export function scopedSourceId(findingId: string, sourceId: string): string {
  const prefix = `${findingId}-`;
  return sourceId.startsWith(prefix) ? sourceId : `${prefix}${sourceId}`;
}
