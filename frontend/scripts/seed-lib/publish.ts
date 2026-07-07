import type { Prisma } from "@prisma/client";
import {
  buildClaimCaveatsFromFindings,
} from "../../src/lib/claimCaveats";
import { hasOpenNonCaveatedFindings } from "../../src/lib/publishedReviewFindings";
import { findingToCreateInput } from "../../src/lib/db/mappers";
import type { Finding } from "../../src/lib/types";

type Tx = Prisma.TransactionClient;

export async function saveEvidenceForFinding(
  tx: Tx,
  findingId: string,
  finding: Finding,
): Promise<void> {
  if (!finding.evidenceClaimVerdict || !finding.evidenceSummary) return;

  await tx.evidenceResult.upsert({
    where: { findingId },
    create: {
      findingId,
      claimVerdict: finding.evidenceClaimVerdict,
      summary: finding.evidenceSummary,
    },
    update: {
      claimVerdict: finding.evidenceClaimVerdict,
      summary: finding.evidenceSummary,
    },
  });

  if (finding.claimKind) {
    await tx.finding.update({
      where: { id: findingId },
      data: { claimKind: finding.claimKind },
    });
  }

  for (const source of finding.sourceCandidates ?? []) {
    const attach =
      finding.status === "source_attached" &&
      finding.selectedSourceId === source.id &&
      source.canAttachAsSupport;

    await tx.source.upsert({
      where: { id: source.id },
      create: {
        id: source.id,
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        snippet: source.snippet,
        credibility: source.credibility,
      },
      update: {
        title: source.title,
        publisher: source.publisher,
        url: source.url,
        snippet: source.snippet,
        credibility: source.credibility,
      },
    });

    await tx.findingSource.upsert({
      where: {
        findingId_sourceId: {
          findingId,
          sourceId: source.id,
        },
      },
      create: {
        findingId,
        sourceId: source.id,
        supportLevel: source.supportLevel,
        canAttachAsSupport: source.canAttachAsSupport,
        rationale: source.rationale ?? null,
        isAttached: attach,
      },
      update: {
        supportLevel: source.supportLevel,
        canAttachAsSupport: source.canAttachAsSupport,
        rationale: source.rationale ?? null,
        isAttached: attach,
      },
    });
  }
}

export async function publishPostRecord(
  tx: Tx,
  postId: string,
  text: string,
  authorId: string,
  authorName: string,
  findings: Finding[],
): Promise<void> {
  const incomingIds = findings.map((item) => item.id);

  await tx.finding.deleteMany({
    where: {
      postId,
      id: { notIn: incomingIds },
    },
  });

  for (const finding of findings) {
    const data = findingToCreateInput(finding);
    await tx.finding.upsert({
      where: { id: finding.id },
      create: { ...data, postId },
      update: data,
    });

    if (finding.evidenceClaimVerdict && finding.evidenceSummary) {
      await saveEvidenceForFinding(tx, finding.id, finding);
    }
  }

  await tx.post.update({
    where: { id: postId },
    data: {
      text: text.trim(),
      authorId,
      authorName,
      publishedAt: new Date(),
    },
  });

  await tx.caveat.deleteMany({ where: { postId } });

  const claimCaveats = buildClaimCaveatsFromFindings(findings);
  for (const caveat of claimCaveats) {
    await tx.caveat.create({
      data: {
        postId,
        findingId: caveat.id,
        type: "claim_verdict",
        message: caveat.message,
      },
    });
  }

  if (hasOpenNonCaveatedFindings(findings)) {
    await tx.caveat.create({
      data: {
        postId,
        type: "unresolved_review",
        message: "Posted with unresolved review item.",
      },
    });
  }
}
