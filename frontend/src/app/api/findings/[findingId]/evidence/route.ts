import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type {
  ClaimKind,
  ClaimVerdict,
  SourceCredibility,
  SupportLevel,
} from "@/lib/types";

const VALID_VERDICTS: ClaimVerdict[] = [
  "supported",
  "partially_supported",
  "contradicted",
  "unsupported",
  "too_broad",
  "unclear",
];

const VALID_SUPPORT: SupportLevel[] = [
  "supports",
  "partially_supports",
  "contradicts",
  "related_only",
  "unclear",
];

const VALID_CREDIBILITY: SourceCredibility[] = ["high", "medium", "low"];

interface EvidenceSourceInput {
  id: string;
  title: string;
  publisher: string;
  url: string;
  snippet: string;
  supportLevel: SupportLevel;
  credibility: SourceCredibility;
  rationale?: string;
  canAttachAsSupport: boolean;
  isAttached?: boolean;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ findingId: string }> },
) {
  const { findingId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    claimVerdict,
    summary,
    claimKind,
    sources,
  } = body as Record<string, unknown>;

  if (
    typeof claimVerdict !== "string" ||
    !VALID_VERDICTS.includes(claimVerdict as ClaimVerdict)
  ) {
    return NextResponse.json({ error: "Invalid claimVerdict" }, { status: 400 });
  }

  if (typeof summary !== "string") {
    return NextResponse.json({ error: "summary is required" }, { status: 400 });
  }

  if (!Array.isArray(sources)) {
    return NextResponse.json({ error: "sources must be an array" }, { status: 400 });
  }

  const parsedSources: EvidenceSourceInput[] = [];
  for (const raw of sources) {
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "Invalid source entry" }, { status: 400 });
    }
    const s = raw as Record<string, unknown>;
    if (
      typeof s.id !== "string" ||
      typeof s.title !== "string" ||
      typeof s.publisher !== "string" ||
      typeof s.url !== "string" ||
      typeof s.snippet !== "string" ||
      typeof s.supportLevel !== "string" ||
      !VALID_SUPPORT.includes(s.supportLevel as SupportLevel) ||
      typeof s.credibility !== "string" ||
      !VALID_CREDIBILITY.includes(s.credibility as SourceCredibility) ||
      typeof s.canAttachAsSupport !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid source entry" }, { status: 400 });
    }

    parsedSources.push({
      id: s.id,
      title: s.title,
      publisher: s.publisher,
      url: s.url,
      snippet: s.snippet,
      supportLevel: s.supportLevel as SupportLevel,
      credibility: s.credibility as SourceCredibility,
      rationale: typeof s.rationale === "string" ? s.rationale : undefined,
      canAttachAsSupport: s.canAttachAsSupport,
      isAttached: s.isAttached === true,
    });
  }

  try {
    const finding = await prisma.finding.findUnique({
      where: { id: findingId },
    });

    if (!finding) {
      return NextResponse.json({ error: "Finding not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.evidenceResult.upsert({
        where: { findingId },
        create: {
          findingId,
          claimVerdict: claimVerdict as ClaimVerdict,
          summary,
        },
        update: {
          claimVerdict: claimVerdict as ClaimVerdict,
          summary,
        },
      });

      if (claimKind && typeof claimKind === "string") {
        await tx.finding.update({
          where: { id: findingId },
          data: { claimKind: claimKind as ClaimKind },
        });
      }

      const sourceIds = parsedSources.map((s) => s.id);
      await tx.findingSource.deleteMany({
        where: {
          findingId,
          sourceId: { notIn: sourceIds },
        },
      });

      for (const sourceInput of parsedSources) {
        await tx.source.upsert({
          where: { id: sourceInput.id },
          create: {
            id: sourceInput.id,
            title: sourceInput.title,
            publisher: sourceInput.publisher,
            url: sourceInput.url,
            snippet: sourceInput.snippet,
            credibility: sourceInput.credibility,
          },
          update: {
            title: sourceInput.title,
            publisher: sourceInput.publisher,
            url: sourceInput.url,
            snippet: sourceInput.snippet,
            credibility: sourceInput.credibility,
          },
        });

        await tx.findingSource.upsert({
          where: {
            findingId_sourceId: {
              findingId,
              sourceId: sourceInput.id,
            },
          },
          create: {
            findingId,
            sourceId: sourceInput.id,
            supportLevel: sourceInput.supportLevel,
            canAttachAsSupport: sourceInput.canAttachAsSupport,
            rationale: sourceInput.rationale ?? null,
            isAttached: sourceInput.isAttached ?? false,
          },
          update: {
            supportLevel: sourceInput.supportLevel,
            canAttachAsSupport: sourceInput.canAttachAsSupport,
            rationale: sourceInput.rationale ?? null,
            isAttached: sourceInput.isAttached ?? false,
          },
        });
      }
    });

    const result = await prisma.evidenceResult.findUnique({
      where: { findingId },
      include: {
        finding: {
          include: {
            findingSources: { include: { source: true } },
          },
        },
      },
    });

    return NextResponse.json({ evidenceResult: result });
  } catch (error) {
    console.error(`POST /api/findings/${findingId}/evidence failed:`, error);
    return NextResponse.json(
      { error: "Failed to save evidence" },
      { status: 500 },
    );
  }
}
