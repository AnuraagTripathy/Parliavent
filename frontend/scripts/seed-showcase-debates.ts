import { PrismaClient } from "@prisma/client";

import { SHOWCASE_DEBATES } from "./seed-data/showcase-debates";

import {
  findingsForPost,
} from "./seed-data/showcase-findings";

import {
  SHOWCASE_USER_IDS,
  type ShowcaseUserKey,
  showcaseUserEnvName,
} from "./seed-data/showcase-users";

import { enrichClaimFindingsWithEvidence } from "./seed-lib/enrich-showcase-evidence";
import { runEvidenceOnlyPass } from "./seed-lib/evidence-only-pass";
import {
  SEED_EVIDENCE_PACE_MS,
  SEED_JUDGE_PACE_MS,
  SEED_MAX_EVIDENCE_PER_POST,
} from "./seed-lib/groq-seed-config";
import { loadEnvFiles } from "./seed-lib/load-env";
import { publishPostRecord } from "./seed-lib/publish";
import { analyzeArgument } from "../src/lib/judge/analyzeArgument";
import {
  getGroqJudgeModel,
  getGroqVerifierModel,
} from "../src/lib/judge/analyzeWithGroq";
import {
  formatGroqUsageSummary,
  resetGroqUsageTracker,
} from "../src/lib/groq/groqUsageTracker";
import type { ClaimVerdict, Finding } from "../src/lib/types";

loadEnvFiles();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const prisma = new PrismaClient();



const CAVEAT_VERDICTS = new Set<ClaimVerdict>([

  "unsupported",

  "contradicted",

  "too_broad",

  "unclear",

]);



interface CliOptions {

  resetOnly: boolean;

  wantsReset: boolean;

  withEvidence: boolean;

  withJudge: boolean;

}



interface PostSeedSummary {

  debateSlug: string;

  debateMotion: string;

  postKey: string;

  authorName: string;

  textPreview: string;

  findingCount: number;

  claimFindingCount: number;

  evidenceResultCount: number;

  sourceBackedCount: number;

  caveatCount: number;

  needsEvidenceCount: number;

  findingTitles: string[];

}



interface DebateSeedSummary {

  motion: string;

  slug: string;

  postCount: number;

  findingCount: number;

  claimFindingCount: number;

  evidenceResultCount: number;

  sourceBackedCount: number;

  caveatCount: number;

}



function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const wantsReset = args.includes("--reset-showcase");
  const wantsSeed =
    args.includes("--with-judge") ||
    args.includes("--with-evidence") ||
    args.includes("--run-judge");

  return {
    // Reset-only when --reset-showcase is passed alone (npm run seed:showcase:reset).
    // Combined with --with-judge / --with-evidence: delete then seed.
    resetOnly: wantsReset && !wantsSeed,
    wantsReset,
    withEvidence: args.includes("--with-evidence"),
    withJudge:
      args.includes("--with-judge") || args.includes("--run-judge"),
  };
}



async function deleteShowcaseDebates(): Promise<number> {

  const debates = await prisma.debate.findMany({

    where: { slug: { startsWith: "showcase-" } },

    select: { id: true, slug: true },

  });



  for (const debate of debates) {

    await prisma.debate.delete({ where: { id: debate.id } });

  }



  return debates.length;

}



async function ensureShowcaseUsers(): Promise<Record<ShowcaseUserKey, string>> {

  const names = {} as Record<ShowcaseUserKey, string>;



  for (const key of Object.keys(SHOWCASE_USER_IDS) as ShowcaseUserKey[]) {

    const id = SHOWCASE_USER_IDS[key];

    const existing = await prisma.user.findUnique({ where: { id } });

    const envName = showcaseUserEnvName(key);

    const displayName =

      existing?.displayName?.trim() ||

      envName ||

      `Showcase ${key.toUpperCase()}`;



    await prisma.user.upsert({

      where: { id },

      create: {

        id,

        displayName,

        email: existing?.email ?? null,

        imageUrl: existing?.imageUrl ?? null,

      },

      update: existing?.displayName?.trim()

        ? {}

        : { displayName },

    });



    names[key] = displayName;

  }



  return names;

}



function namespaceFindings(findings: Finding[], postKey: string): Finding[] {

  return findings.map((finding) => ({

    ...finding,

    id: `showcase-${postKey}-${finding.id}`,

  }));

}



async function runJudgeForPost(params: {

  postKey: string;

  text: string;

  motion: string;

  slug: string;

  parentText?: string;

  isReply: boolean;

}): Promise<Finding[]> {

  if (!process.env.GROQ_API_KEY?.trim()) {

    throw new Error(

      "GROQ_API_KEY is required for --with-judge. Set it in .env.local or run light mode without --with-judge.",

    );

  }



  process.env.USE_MOCK_JUDGE = "false";



  const judged = await analyzeArgument({

    text: params.text,

    mode: "structured_debate",

    motion: params.motion,

    postType: params.isReply ? "reply" : "starter",

    parentArgument: params.parentText,

    threadId: params.slug,

    userStance: "unknown",

  });



  return namespaceFindings(judged, params.postKey);

}



function ensureShowcaseContestedFallacy(
  findings: Finding[],
  postKey: string,
): Finding[] {
  const fallbackKeys = new Set([
    "god-r2",
    "promise-r1-1",
    "promise-r2",
    "promise-r3",
  ]);
  if (!fallbackKeys.has(postKey)) return findings;

  const curated = findingsForPost(postKey).filter(
    (finding) => finding.type === "fallacy",
  );
  if (curated.length === 0) return findings;

  const withoutFallacies = findings.filter((finding) => finding.type !== "fallacy");
  return [...withoutFallacies, ...namespaceFindings(curated, postKey)];
}



async function resolveFindings(params: {

  postKey: string;

  text: string;

  motion: string;

  slug: string;

  parentText?: string;

  isReply: boolean;

  withJudge: boolean;

}): Promise<Finding[]> {

  if (params.withJudge) {

    try {

      const judged = await runJudgeForPost(params);

      return ensureShowcaseContestedFallacy(judged, params.postKey);

    } catch (error) {

      console.warn(

        `Judge failed for ${params.postKey}; publishing without findings.`,

        error,

      );

      return [];

    }

  }



  const curated = findingsForPost(params.postKey);

  if (curated.length > 0) {

    return curated.map((finding) => ({ ...finding }));

  }



  return [];

}



function summarizePostFindings(findings: Finding[]): {

  claimFindingCount: number;

  evidenceResultCount: number;

  sourceBackedCount: number;

  caveatCount: number;

  needsEvidenceCount: number;

  findingTitles: string[];

} {

  let claimFindingCount = 0;

  let evidenceResultCount = 0;

  let sourceBackedCount = 0;

  let caveatCount = 0;

  let needsEvidenceCount = 0;



  for (const finding of findings) {

    if (finding.type === "claim") claimFindingCount += 1;

    if (finding.evidenceClaimVerdict) evidenceResultCount += 1;

    if (finding.status === "source_attached") sourceBackedCount += 1;

    if (

      finding.evidenceClaimVerdict &&

      CAVEAT_VERDICTS.has(finding.evidenceClaimVerdict)

    ) {

      caveatCount += 1;

    }

    if (

      finding.type === "claim" &&

      !finding.evidenceClaimVerdict &&

      finding.status !== "source_attached" &&

      (finding.status === "open" || finding.status === "ignored")

    ) {

      needsEvidenceCount += 1;

    }

  }



  return {

    claimFindingCount,

    evidenceResultCount,

    sourceBackedCount,

    caveatCount,

    needsEvidenceCount,

    findingTitles: findings.map((f) => f.title),

  };

}



function printSeedSummary(

  postSummaries: PostSeedSummary[],

  options: CliOptions,

): void {

  const debateMap = new Map<string, DebateSeedSummary>();



  for (const post of postSummaries) {

    const existing = debateMap.get(post.debateSlug) ?? {

      motion: post.debateMotion,

      slug: post.debateSlug,

      postCount: 0,

      findingCount: 0,

      claimFindingCount: 0,

      evidenceResultCount: 0,

      sourceBackedCount: 0,

      caveatCount: 0,

    };



    existing.postCount += 1;

    existing.findingCount += post.findingCount;

    existing.claimFindingCount += post.claimFindingCount;

    existing.evidenceResultCount += post.evidenceResultCount;

    existing.sourceBackedCount += post.sourceBackedCount;

    existing.caveatCount += post.caveatCount;

    debateMap.set(post.debateSlug, existing);

  }



  console.log("");

  console.log("=== Showcase seed summary ===");

  console.log(

    `Mode: ${options.withJudge ? "realistic (judge)" : "light (curated)"}${options.withEvidence ? " + evidence" : ""}`,

  );

  console.log("");

  console.log("Debate totals:");

  console.log(

    "motion | posts | findings | claims | evidence | sourced | caveats",

  );

  for (const debate of debateMap.values()) {

    console.log(

      `${debate.motion} | ${debate.postCount} | ${debate.findingCount} | ${debate.claimFindingCount} | ${debate.evidenceResultCount} | ${debate.sourceBackedCount} | ${debate.caveatCount}`,

    );

  }



  const postsWithFindings = postSummaries.filter((p) => p.findingCount > 0);

  if (postsWithFindings.length > 0) {

    console.log("");

    console.log("Posts with findings:");

    for (const post of postsWithFindings) {

      console.log(

        `  [${post.debateSlug}] ${post.postKey} · ${post.authorName}`,

      );

      console.log(`    ${post.textPreview}`);

      console.log(`    findings: ${post.findingTitles.join(" · ") || "(none)"}`);

      console.log(

        `    caveats: ${post.caveatCount} · sourced: ${post.sourceBackedCount} · needs evidence: ${post.needsEvidenceCount}`,

      );

    }

  }



  const vaxRegression = postSummaries.find((p) => p.postKey === "vax-r2");

  if (vaxRegression) {

    console.log("");

    console.log("Regression check — vax-r2 (microchip needle claim):");

    console.log(`  findings: ${vaxRegression.findingCount}`);

    console.log(`  needs evidence: ${vaxRegression.needsEvidenceCount}`);

    console.log(`  titles: ${vaxRegression.findingTitles.join(" · ") || "(none)"}`);

    if (vaxRegression.findingCount === 0 && options.withJudge) {

      console.warn(

        "  WARNING: vax-r2 has no findings under --with-judge. Compare with manual compose in the reply flow.",

      );

    }

  }

}



async function seedShowcaseDebates(options: CliOptions): Promise<void> {
  resetGroqUsageTracker();

  const isEvidenceOnlyPass =
    options.withEvidence && !options.withJudge && !options.wantsReset;

  if (options.resetOnly) {
    const removed = await deleteShowcaseDebates();
    if (removed > 0) {
      console.log(`Removed ${removed} previous showcase debate(s).`);
    }
    console.log("Showcase data reset complete.");
    return;
  }

  const authorNames = await ensureShowcaseUsers();

  logGroqPhaseModels(options);

  if (isEvidenceOnlyPass) {
    console.log(
      "Evidence-only pass: enriching existing showcase posts (no reset, no judge).",
    );
    console.log(
      `Evidence cap: ${SEED_MAX_EVIDENCE_PER_POST} claim(s) per post.`,
    );
    const { postCount, evidenceSkippedDueToCap } = await runEvidenceOnlyPass(
      prisma,
      authorNames,
    );
    console.log("");
    console.log(`Evidence updated on ${postCount} post(s).`);
    printGroqRunSummary(evidenceSkippedDueToCap);
    return;
  }

  const removed = await deleteShowcaseDebates();

  if (removed > 0) {

    console.log(`Removed ${removed} previous showcase debate(s).`);

  }



  let evidenceSkippedDueToCap = 0;

  if (options.withJudge) {

    console.log("Realistic mode: running Groq judge for every seeded post.");

  } else {

    console.log("Light mode: using curated findings where defined.");

  }



  let debateCount = 0;

  let postCount = 0;

  const postSummaries: PostSeedSummary[] = [];



  for (const debateDef of SHOWCASE_DEBATES) {

    const debate = await prisma.debate.create({

      data: {

        motion: debateDef.motion,

        slug: debateDef.slug,

        mode: "structured_debate",

      },

    });

    debateCount += 1;



    const postIdByKey = new Map<string, string>();

    const textByKey = new Map<string, string>();

    const baseTime = Date.now();



    for (let index = 0; index < debateDef.posts.length; index += 1) {

      const postDef = debateDef.posts[index];

      const parentPostId = postDef.parentKey

        ? postIdByKey.get(postDef.parentKey)

        : undefined;



      if (postDef.parentKey && !parentPostId) {

        throw new Error(

          `Missing parent ${postDef.parentKey} for post ${postDef.key}`,

        );

      }



      const authorId = SHOWCASE_USER_IDS[postDef.author];

      const authorName = authorNames[postDef.author];

      const isReply = Boolean(postDef.parentKey);

      const parentText = postDef.parentKey

        ? textByKey.get(postDef.parentKey)

        : undefined;



      const draft = await prisma.post.create({

        data: {

          debateId: debate.id,

          parentPostId: parentPostId ?? null,

          text: postDef.text,

          postType: isReply ? "reply" : "starter",

          authorId,

          authorName,

          createdAt: new Date(baseTime + index * 60_000),

        },

      });



      postIdByKey.set(postDef.key, draft.id);

      textByKey.set(postDef.key, postDef.text);

      postCount += 1;



      const findings = await resolveFindings({

        postKey: postDef.key,

        text: postDef.text,

        motion: debateDef.motion,

        slug: debateDef.slug,

        parentText,

        isReply,

        withJudge: options.withJudge,

      });



      if (options.withEvidence && findings.length > 0) {
        const enrichResult = await enrichClaimFindingsWithEvidence({
          postKey: postDef.key,
          findings,
          text: postDef.text,
          slug: debateDef.slug,
          withJudge: options.withJudge,
          withEvidence: options.withEvidence,
        });
        evidenceSkippedDueToCap += enrichResult.evidenceSkippedDueToCap;
      }



      await prisma.$transaction(async (tx) => {

        await publishPostRecord(

          tx,

          draft.id,

          postDef.text,

          authorId,

          authorName,

          findings,

        );

      });



      const stats = summarizePostFindings(findings);

      postSummaries.push({

        debateSlug: debateDef.slug,

        debateMotion: debateDef.motion,

        postKey: postDef.key,

        authorName,

        textPreview:

          postDef.text.length > 72

            ? `${postDef.text.slice(0, 72)}…`

            : postDef.text,

        findingCount: findings.length,

        ...stats,

      });



      const findingLabel =

        findings.length > 0

          ? `${findings.length} finding(s)${stats.sourceBackedCount ? `, ${stats.sourceBackedCount} sourced` : ""}${stats.caveatCount ? `, ${stats.caveatCount} caveat(s)` : ""}${stats.needsEvidenceCount ? `, ${stats.needsEvidenceCount} need evidence` : ""}`

          : "clean";

      console.log(
        `  · ${postDef.key} by ${authorName} (${findingLabel})`,
      );

      if (options.withJudge && SEED_JUDGE_PACE_MS > 0) {
        await sleep(SEED_JUDGE_PACE_MS);
      }
    }



    console.log(`✓ ${debateDef.slug} — ${debateDef.posts.length} posts`);

  }



  console.log("");

  console.log(`Seeded ${debateCount} showcase debates and ${postCount} posts.`);

  console.log("Authors:");

  for (const key of Object.keys(SHOWCASE_USER_IDS) as ShowcaseUserKey[]) {

    console.log(

      `  ${key}: ${authorNames[key]} (${SHOWCASE_USER_IDS[key]})`,

    );

  }



  if (options.withJudge && options.withEvidence) {

    console.log(

      "Every post was judged; evidence ran on all claim findings.",

    );

  } else if (options.withJudge) {

    console.log(

      "Every post was judged. Claim findings without evidence show as Needs evidence in the thread.",

    );

  } else if (options.withEvidence) {

    console.log(

      `Light curated seed with live evidence (max ${SEED_MAX_EVIDENCE_PER_POST} claims/post).`,

    );

  } else {

    console.log(

      "Light curated seed. Use --with-judge for realistic Groq-reviewed showcase debates.",

    );

  }



  printSeedSummary(postSummaries, options);
  if (options.withJudge || options.withEvidence) {
    printGroqRunSummary(evidenceSkippedDueToCap);
  }
}



function logGroqPhaseModels(options: CliOptions): void {
  if (!options.withJudge && !options.withEvidence) {
    return;
  }
  console.log("Groq models:");
  if (options.withJudge) {
    console.log(
      `  Judge phase:    ${getGroqJudgeModel()} (${SEED_JUDGE_PACE_MS}ms between calls)`,
    );
  }
  if (options.withEvidence) {
    console.log(
      `  Evidence phase: ${getGroqVerifierModel()} (${SEED_EVIDENCE_PACE_MS}ms between verifier calls)`,
    );
  }
  if (options.withEvidence) {
    console.log(
      `  Evidence cap:   ${SEED_MAX_EVIDENCE_PER_POST} claim(s) per post`,
    );
  }
  console.log("");
}



function printGroqRunSummary(evidenceSkippedDueToCap: number): void {
  console.log("");
  console.log("=== Groq usage (this run) ===");
  for (const line of formatGroqUsageSummary()) {
    console.log(line);
  }
  console.log(
    `  Claims skipped (evidence cap): ${evidenceSkippedDueToCap}`,
  );
}



async function main() {

  const options = parseArgs();



  try {

    await seedShowcaseDebates(options);

  } finally {

    await prisma.$disconnect();

  }

}



main().catch((error) => {

  console.error("Showcase seed failed:", error);

  process.exit(1);

});


