import httpx



from app.config import settings

from app.models import CreateJobRequest

from app.redis_store import JobStore





async def run_evidence_job(store: JobStore, job_id: str, payload: CreateJobRequest) -> None:

    if payload.autoEscalate:

        initial_stage = "standard_pipeline"

    elif payload.mode == "deep":

        initial_stage = "deep_classification"

    else:

        initial_stage = "searching"



    await store.update_stage(job_id, initial_stage)



    if not settings.evidence_internal_secret:

        await store.fail_job(job_id, "EVIDENCE_INTERNAL_SECRET is not configured")

        return



    request_body = {

        "claim": payload.claim,

        "argumentContext": payload.argumentContext,

        "threadId": payload.threadId,

        "jobId": job_id,

        "mode": payload.mode,

        "autoEscalate": payload.autoEscalate,

    }



    url = f"{settings.nextjs_base_url.rstrip('/')}/api/evidence/internal/search"



    try:

        async with httpx.AsyncClient(timeout=httpx.Timeout(300.0)) as client:

            response = await client.post(

                url,

                json=request_body,

                headers={

                    "Content-Type": "application/json",

                    "X-Evidence-Internal-Secret": settings.evidence_internal_secret,

                },

            )

    except httpx.HTTPError as error:

        await store.fail_job(job_id, f"Evidence pipeline request failed: {error}")

        return



    if response.status_code != 200:

        detail = response.text.strip() or f"HTTP {response.status_code}"

        await store.fail_job(job_id, f"Evidence pipeline failed: {detail}")

        return



    try:

        result = response.json()

    except ValueError:

        await store.fail_job(job_id, "Evidence pipeline returned invalid JSON")

        return



    # Escalation routing happens in the Next.js pipeline (the authoritative
    # TypeScript router in src/lib/evidence/evidenceRouter.ts). Fail loudly if
    # it is ever missing rather than re-deriving it with a duplicate router.

    if (

        payload.mode == "standard"

        and not payload.autoEscalate

        and isinstance(result, dict)

        and result.get("shouldEscalate") is None

    ):

        await store.fail_job(

            job_id,

            "Evidence pipeline result is missing router output (shouldEscalate)",

        )

        return



    await store.complete_job(job_id, result)

