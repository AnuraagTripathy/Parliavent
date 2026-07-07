import asyncio
from contextlib import asynccontextmanager

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException

from app.config import settings
from app.models import (
    CreateJobRequest,
    CreateJobResponse,
    JobListResponse,
    JobResponse,
    UpdateStageRequest,
)
from app.redis_store import JobStore
from app.worker import run_evidence_job

store = JobStore()


# The .env.example placeholder must never work as a real secret.
PLACEHOLDER_SECRET = "change-me-to-a-long-random-string"


def verify_internal_secret(
    x_evidence_internal_secret: str | None = Header(default=None),
) -> None:
    secret = settings.evidence_internal_secret
    if not secret or secret == PLACEHOLDER_SECRET:
        raise HTTPException(status_code=503, detail="Internal secret not configured")
    if x_evidence_internal_secret != secret:
        raise HTTPException(status_code=401, detail="Unauthorized")


@asynccontextmanager
async def lifespan(_: FastAPI):
    await store.connect()
    yield
    await store.close()


app = FastAPI(title="Parliavent Evidence Jobs", lifespan=lifespan)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/evidence/jobs", response_model=CreateJobResponse)
async def create_job(
    payload: CreateJobRequest,
    background_tasks: BackgroundTasks,
) -> CreateJobResponse:
    job_id, is_deduped = await store.create_job(
        claim=payload.claim.strip(),
        thread_id=payload.threadId,
        argument_context=payload.argumentContext,
        finding_id=payload.findingId,
        mode=payload.mode,
        auto_escalate=payload.autoEscalate,
    )

    if not is_deduped:
        background_tasks.add_task(run_evidence_job, store, job_id, payload)

    return CreateJobResponse(jobId=job_id)


@app.get("/evidence/jobs", response_model=JobListResponse)
async def list_jobs() -> JobListResponse:
    jobs = await store.list_recent_jobs()
    return JobListResponse(jobs=jobs)


@app.get("/evidence/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str) -> JobResponse:
    job = await store.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.patch("/evidence/jobs/{job_id}/stage")
async def update_job_stage(
    job_id: str,
    payload: UpdateStageRequest,
    _: None = Depends(verify_internal_secret),
) -> dict[str, str]:
    job = await store.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    await store.update_stage(job_id, payload.stage)
    return {"jobId": job_id, "stage": payload.stage}


def main() -> None:
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=False,
    )


if __name__ == "__main__":
    main()
