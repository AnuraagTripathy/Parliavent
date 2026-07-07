import type { PrismaClient } from "@prisma/client";
import { toAppFinding } from "../../src/lib/db/mappers";
import type { Finding } from "../../src/lib/types";
import { SHOWCASE_DEBATES } from "../seed-data/showcase-debates";
import {
  SHOWCASE_USER_IDS,
  type ShowcaseUserKey,
} from "../seed-data/showcase-users";
import { enrichClaimFindingsWithEvidence } from "./enrich-showcase-evidence";
import { publishPostRecord } from "./publish";

const postInclude = {
  findings: {
    include: {
      evidenceResult: true,
      findingSources: { include: { source: true } },
    },
  },
} as const;

export async function runEvidenceOnlyPass(
  prisma: PrismaClient,
  authorNames: Record<ShowcaseUserKey, string>,
): Promise<{ postCount: number; evidenceSkippedDueToCap: number }> {
  let postCount = 0;
  let evidenceSkippedDueToCap = 0;

  for (const debateDef of SHOWCASE_DEBATES) {
    const debate = await prisma.debate.findUnique({
      where: { slug: debateDef.slug },
      include: {
        posts: {
          include: postInclude,
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!debate) {
      console.warn(
        `Skipping evidence pass — debate not found: ${debateDef.slug}. Run --with-judge first.`,
      );
      continue;
    }

    const postByText = new Map(debate.posts.map((p) => [p.text, p]));

    for (const postDef of debateDef.posts) {
      const dbPost = postByText.get(postDef.text);
      if (!dbPost) {
        console.warn(
          `Skipping ${postDef.key} — post text not found in ${debateDef.slug}`,
        );
        continue;
      }

      const findings: Finding[] = dbPost.findings.map((f) => toAppFinding(f));
      if (findings.length === 0) {
        console.log(`  · ${postDef.key} (no findings to verify)`);
        continue;
      }

      const enrichResult = await enrichClaimFindingsWithEvidence({
        postKey: postDef.key,
        findings,
        text: postDef.text,
        slug: debateDef.slug,
        withJudge: true,
        withEvidence: true,
      });
      evidenceSkippedDueToCap += enrichResult.evidenceSkippedDueToCap;

      const authorId = SHOWCASE_USER_IDS[postDef.author];
      const authorName = authorNames[postDef.author];

      await prisma.$transaction(async (tx) => {
        await publishPostRecord(
          tx,
          dbPost.id,
          postDef.text,
          authorId,
          authorName,
          findings,
        );
      });

      postCount += 1;
      console.log(`  · ${postDef.key} evidence updated`);
    }

    console.log(`✓ ${debateDef.slug} — evidence pass`);
  }

  return { postCount, evidenceSkippedDueToCap };
}
