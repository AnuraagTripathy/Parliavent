import type { PrismaClient } from "@prisma/client";
import { findingsForPost } from "../seed-data/showcase-findings";
import type { ShowcaseDebateDef } from "../seed-data/showcase-debates";
import {
  SHOWCASE_USER_IDS,
  type ShowcaseUserKey,
  showcaseUserEnvName,
} from "../seed-data/showcase-users";
import { enrichClaimFindingsWithEvidence } from "./enrich-showcase-evidence";
import {
  SEED_EVIDENCE_PACE_MS,
  SEED_JUDGE_PACE_MS,
} from "./groq-seed-config";
import { publishPostRecord } from "./publish";
import { analyzeArgument } from "../../src/lib/judge/analyzeArgument";
import {
  claimFindingReadsAsClarity,
} from "../../src/lib/publishedReviewFindings";
import type { Finding } from "../../src/lib/types";

const FALLACY_FALLBACK_POST_KEYS = new Set([
  "god-r2",
  "promise-r1-1",
  "promise-r2",
  "promise-r3",
]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function namespaceFindings(findings: Finding[], postKey: string): Finding[] {
  return findings.map((finding) => ({
    ...finding,
    id: `showcase-${postKey}-${finding.id}`,
  }));
}

function ensureShowcaseFallacyFallback(
  findings: Finding[],
  postKey: string,
): Finding[] {
  if (!FALLACY_FALLBACK_POST_KEYS.has(postKey)) return findings;

  const curated = findingsForPost(postKey).filter(
    (finding) => finding.type === "fallacy",
  );
  if (curated.length === 0) return findings;

  const withoutFallacies = findings.filter((finding) => finding.type !== "fallacy");
  return [...withoutFallacies, ...namespaceFindings(curated, postKey)];
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
      "GROQ_API_KEY is required for --with-judge. Set it in .env.local or run without --with-judge.",
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

function mergeCuratedShowcaseFindings(
  judged: Finding[],
  curated: Finding[],
): Finding[] {
  const curatedClarity = curated.filter((finding) => finding.type === "clarity");
  const withoutMislabeled = judged.filter((finding) => {
    if (finding.type === "claim" && claimFindingReadsAsClarity(finding)) {
      return false;
    }
    if (finding.type === "clarity" && curatedClarity.length > 0) {
      return false;
    }
    return true;
  });

  return [
    ...withoutMislabeled,
    ...curatedClarity.map((finding) => ({ ...finding })),
  ];
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
  const curated = findingsForPost(params.postKey);

  if (params.withJudge) {
    try {
      const judged = ensureShowcaseFallacyFallback(
        await runJudgeForPost(params),
        params.postKey,
      );
      return mergeCuratedShowcaseFindings(judged, curated);
    } catch (error) {
      console.warn(
        `Judge failed for ${params.postKey}; using curated findings if available.`,
        error,
      );
    }
  }

  if (curated.length > 0) {
    return curated.map((finding) => ({ ...finding }));
  }

  return [];
}

export async function ensureShowcaseUsers(
  prisma: PrismaClient,
): Promise<Record<ShowcaseUserKey, string>> {
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
      update: existing?.displayName?.trim() ? {} : { displayName },
    });

    names[key] = displayName;
  }

  return names;
}

export async function deleteShowcaseDebateBySlug(
  prisma: PrismaClient,
  slug: string,
): Promise<boolean> {
  const debate = await prisma.debate.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!debate) return false;
  await prisma.debate.delete({ where: { id: debate.id } });
  return true;
}

export interface SeedShowcaseDebateOptions {
  withJudge: boolean;
  withEvidence: boolean;
}

export async function seedShowcaseDebate(
  prisma: PrismaClient,
  debateDef: ShowcaseDebateDef,
  authorNames: Record<ShowcaseUserKey, string>,
  options: SeedShowcaseDebateOptions,
): Promise<{ postCount: number; evidenceSkippedDueToCap: number }> {
  let evidenceSkippedDueToCap = 0;
  let postCount = 0;

  const debate = await prisma.debate.create({
    data: {
      motion: debateDef.motion,
      slug: debateDef.slug,
      mode: "structured_debate",
    },
  });

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
      if (SEED_EVIDENCE_PACE_MS > 0) {
        await sleep(SEED_EVIDENCE_PACE_MS);
      }
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

    const findingLabel =
      findings.length > 0
        ? `${findings.length} finding(s)`
        : "clean";
    console.log(`  · ${postDef.key} by ${authorName} (${findingLabel})`);

    if (options.withJudge && SEED_JUDGE_PACE_MS > 0) {
      await sleep(SEED_JUDGE_PACE_MS);
    }
  }

  await prisma.debate.update({
    where: { id: debate.id },
    data: { updatedAt: new Date() },
  });

  console.log(`✓ ${debateDef.slug} — ${debateDef.posts.length} posts`);
  return { postCount, evidenceSkippedDueToCap };
}
