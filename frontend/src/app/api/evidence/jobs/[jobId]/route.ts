import { NextResponse } from "next/server";
import { getOptionalAuthUser, unauthorizedResponse } from "@/lib/auth/session";

function getFastApiUrl(): string | null {
  const url = process.env.FASTAPI_EVIDENCE_URL?.trim();
  return url ? url.replace(/\/$/, "") : null;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  // Auth only, no rate limit: the client polls this every ~1.5s per job.
  const user = await getOptionalAuthUser(request);
  if (!user) {
    return unauthorizedResponse();
  }

  const fastApiUrl = getFastApiUrl();
  if (!fastApiUrl) {
    return NextResponse.json(
      { error: "Evidence jobs service not configured" },
      { status: 503 },
    );
  }

  const { jobId } = await context.params;
  if (!jobId?.trim()) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${fastApiUrl}/evidence/jobs/${encodeURIComponent(jobId)}`,
      { cache: "no-store" },
    );

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "Failed to fetch evidence job" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/evidence/jobs/[jobId]]", error);
    return NextResponse.json(
      { error: "Evidence jobs service unavailable" },
      { status: 503 },
    );
  }
}
