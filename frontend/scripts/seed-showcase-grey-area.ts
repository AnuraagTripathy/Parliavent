import { PrismaClient } from "@prisma/client";
import { GREY_AREA_SHOWCASE_DEBATE } from "./seed-data/showcase-grey-area";
import { loadEnvFiles } from "./seed-lib/load-env";
import {
  deleteShowcaseDebateBySlug,
  ensureShowcaseUsers,
  seedShowcaseDebate,
} from "./seed-lib/seed-showcase-debate";
import {
  formatGroqUsageSummary,
  resetGroqUsageTracker,
} from "../src/lib/groq/groqUsageTracker";
import {
  getGroqJudgeModel,
  getGroqVerifierModel,
} from "../src/lib/judge/analyzeWithGroq";

loadEnvFiles();

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    withEvidence: args.includes("--with-evidence"),
    withJudge:
      args.includes("--with-judge") || args.includes("--run-judge"),
    keepExisting: args.includes("--keep-existing"),
  };
}

async function main(): Promise<void> {
  const options = parseArgs();
  resetGroqUsageTracker();

  if (options.withJudge) {
    console.log(`Judge model: ${getGroqJudgeModel()}`);
    console.log(`Verifier model: ${getGroqVerifierModel()}`);
  } else {
    console.log("Light mode: curated fallacy findings (no Groq judge).");
  }

  const existing = await prisma.debate.findUnique({
    where: { slug: GREY_AREA_SHOWCASE_DEBATE.slug },
    select: { id: true },
  });

  if (existing && !options.keepExisting) {
    await deleteShowcaseDebateBySlug(prisma, GREY_AREA_SHOWCASE_DEBATE.slug);
    console.log(`Removed existing ${GREY_AREA_SHOWCASE_DEBATE.slug}.`);
  } else if (existing) {
    console.log(
      `${GREY_AREA_SHOWCASE_DEBATE.slug} already exists — use without --keep-existing to replace.`,
    );
    return;
  }

  const authorNames = await ensureShowcaseUsers(prisma);
  const { postCount } = await seedShowcaseDebate(
    prisma,
    GREY_AREA_SHOWCASE_DEBATE,
    authorNames,
    options,
  );

  console.log("");
  console.log(
    `Grey-area showcase seeded: ${GREY_AREA_SHOWCASE_DEBATE.motion} (${postCount} posts).`,
  );
  console.log(
    "It is ordered first on the feed via SHOWCASE_DEBATE_SLUG_ORDER.",
  );

  if (options.withJudge || options.withEvidence) {
    console.log("");
    for (const line of formatGroqUsageSummary()) {
      console.log(line);
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
