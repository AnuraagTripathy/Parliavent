import type { EvidenceSource, SupportLevel } from "@/lib/types";

/**
 * Whether the user may attach this source as supporting evidence.
 * Only true when the snippet supports or partially supports the claim.
 */
export function computeCanAttachAsSupport(supportLevel: SupportLevel): boolean {
  return supportLevel === "supports" || supportLevel === "partially_supports";
}

export function finalizeEvidenceSource(
  source: Omit<EvidenceSource, "canAttachAsSupport"> & {
    canAttachAsSupport?: boolean;
  },
): EvidenceSource {
  return {
    ...source,
    canAttachAsSupport: computeCanAttachAsSupport(source.supportLevel),
  };
}

export function finalizeEvidenceSources(
  sources: Array<
    Omit<EvidenceSource, "canAttachAsSupport"> & { canAttachAsSupport?: boolean }
  >,
): EvidenceSource[] {
  return sources.map(finalizeEvidenceSource);
}
