-- CreateEnum
CREATE TYPE "DebateMode" AS ENUM ('open_floor', 'structured_debate', 'formal_motion');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('starter', 'reply');

-- CreateEnum
CREATE TYPE "FindingType" AS ENUM ('claim', 'fallacy', 'clarity');

-- CreateEnum
CREATE TYPE "FindingStatus" AS ENUM ('open', 'resolved', 'ignored', 'disputed', 'source_attached', 'marked_opinion');

-- CreateEnum
CREATE TYPE "ClaimKind" AS ENUM ('factual', 'opinion', 'mixed', 'unclear');

-- CreateEnum
CREATE TYPE "ClaimVerdict" AS ENUM ('supported', 'partially_supported', 'contradicted', 'unsupported', 'too_broad', 'unclear');

-- CreateEnum
CREATE TYPE "SupportLevel" AS ENUM ('supports', 'partially_supports', 'contradicts', 'related_only', 'unclear');

-- CreateEnum
CREATE TYPE "Credibility" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "CaveatType" AS ENUM ('claim_verdict', 'unresolved_review');

-- CreateTable
CREATE TABLE "Debate" (
    "id" TEXT NOT NULL,
    "motion" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mode" "DebateMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Debate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "parentPostId" TEXT,
    "text" TEXT NOT NULL,
    "postType" "PostType" NOT NULL,
    "authorName" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "FindingType" NOT NULL,
    "status" "FindingStatus" NOT NULL DEFAULT 'open',
    "spanText" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "reason" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "example" TEXT,
    "suggestedRewrite" TEXT,
    "claimKind" "ClaimKind",
    "disputeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceResult" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "claimVerdict" "ClaimVerdict" NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvidenceResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "url" TEXT,
    "snippet" TEXT NOT NULL DEFAULT '',
    "credibility" "Credibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingSource" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "supportLevel" "SupportLevel" NOT NULL,
    "canAttachAsSupport" BOOLEAN NOT NULL,
    "rationale" TEXT,
    "isAttached" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FindingSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caveat" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "findingId" TEXT,
    "type" "CaveatType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caveat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Debate_slug_key" ON "Debate"("slug");

-- CreateIndex
CREATE INDEX "Post_debateId_idx" ON "Post"("debateId");

-- CreateIndex
CREATE INDEX "Finding_postId_idx" ON "Finding"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceResult_findingId_key" ON "EvidenceResult"("findingId");

-- CreateIndex
CREATE UNIQUE INDEX "FindingSource_findingId_sourceId_key" ON "FindingSource"("findingId", "sourceId");

-- CreateIndex
CREATE INDEX "Caveat_postId_idx" ON "Caveat"("postId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceResult" ADD CONSTRAINT "EvidenceResult_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingSource" ADD CONSTRAINT "FindingSource_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingSource" ADD CONSTRAINT "FindingSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caveat" ADD CONSTRAINT "Caveat_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caveat" ADD CONSTRAINT "Caveat_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE SET NULL ON UPDATE CASCADE;
