import type { ClaimVerdict, EvidenceSource, SupportLevel } from "@/lib/types";

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

const NON_ATTACHABLE_CLAIM_VERDICTS = new Set<ClaimVerdict>([
  "contradicted",
  "unsupported",
]);

/**
 * When the overall claim is contradicted or unsupported, users must not attach
 * any source as supporting evidence — even if the verifier mislabeled a source.
 */
export function enforceAttachabilityForClaimVerdict(
  sources: EvidenceSource[],
  claimVerdict: ClaimVerdict,
): EvidenceSource[] {
  if (!NON_ATTACHABLE_CLAIM_VERDICTS.has(claimVerdict)) {
    return sources;
  }

  return sources.map((source) => ({
    ...source,
    canAttachAsSupport: false,
  }));
}

/**
 * Single-source form of the same rule, used server-side to recompute
 * attachability instead of trusting client-submitted booleans.
 */
export function isAttachableUnderVerdict(
  supportLevel: SupportLevel,
  claimVerdict: ClaimVerdict,
): boolean {
  return (
    computeCanAttachAsSupport(supportLevel) &&
    !NON_ATTACHABLE_CLAIM_VERDICTS.has(claimVerdict)
  );
}
