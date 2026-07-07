import json
import re
import uuid
from datetime import datetime, timezone
from typing import Any

import redis.asyncio as redis

from app.config import settings
from app.models import JobResponse, JobStage, JobStatus, JobSummary

STAGE_PROGRESS: dict[JobStage, int] = {
    "queued": 0,
    "standard_pipeline": 10,
    "searching": 15,
    "fetching_pages": 30,
    "extracting_passages": 45,
    "ranking_passages": 55,
    "verifying": 65,
    "routing_evidence": 72,
    "deep_classification": 75,
    "deep_follow_up_search": 82,
    "deep_source_review": 88,
    "deep_verification": 94,
    "completed": 100,
    "failed": 100,
}

EVIDENCE_CACHE_VERSION = "evidence-engine-v2.3"
RECENT_JOBS_KEY = "evidence:jobs:recent"
RECENT_JOBS_MAX = 50


def build_evidence_cache_key(
    claim: str,
    thread_id: str | None,
    mode: str = "standard",
    auto_escalate: bool = False,
) -> str:
    normalized = re.sub(r"\s+", " ", claim.strip().lower())
    return f"{EVIDENCE_CACHE_VERSION}\0{normalized}\0{thread_id or ''}\0{mode}\0{auto_escalate}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _parse_bool(value: str | None) -> bool | None:
    if value is None or value == "":
        return None
    return value.lower() in ("1", "true", "yes")


def _parse_int(value: str | None) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except ValueError:
        return None


def _parse_result(result_raw: str) -> dict[str, Any] | None:
    if not result_raw:
        return None
    try:
        parsed = json.loads(result_raw)
    except json.JSONDecodeError:
        return None
    return parsed if isinstance(parsed, dict) else None


def _summary_from_hash(job_id: str, data: dict[str, str]) -> JobSummary:
    result = _parse_result(data.get("result") or "")
    sources = result.get("sources") if isinstance(result, dict) else None
    source_list = sources if isinstance(sources, list) else []

    attachable_count = None
    if result is not None:
        attachable_count = sum(
            1
            for source in source_list
            if isinstance(source, dict) and source.get("canAttachAsSupport") is True
        )

    error_raw = data.get("error") or ""
    status = data.get("status", "queued")
    stage = data.get("stage", "queued")

    if status not in ("queued", "running", "completed", "failed"):
        status = "queued"
    if stage not in STAGE_PROGRESS:
        stage = "queued"

    return JobSummary(
        jobId=job_id,
        claim=data.get("claim") or "",
        status=status,  # type: ignore[arg-type]
        stage=stage,  # type: ignore[arg-type]
        createdAt=data.get("createdAt") or None,
        updatedAt=data.get("updatedAt") or None,
        completedAt=data.get("completedAt") or None,
        latencyMs=_parse_int(data.get("latencyMs")),
        claimVerdict=result.get("claimVerdict") if result else None,
        verificationBasis=result.get("verificationBasis") if result else None,
        sourceCount=len(source_list) if result is not None else None,
        attachableSourceCount=attachable_count,
        cacheHit=_parse_bool(data.get("cacheHit")),
        error=error_raw if error_raw else None,
        result=result,
    )


class JobStore:
    def __init__(self) -> None:
        self._client: redis.Redis | None = None

    async def connect(self) -> None:
        self._client = redis.from_url(settings.redis_url, decode_responses=True)

    async def close(self) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    @property
    def client(self) -> redis.Redis:
        if self._client is None:
            raise RuntimeError("Redis client is not connected")
        return self._client

    def _job_key(self, job_id: str) -> str:
        return f"evidence:job:{job_id}"

    def _dedupe_key(self, cache_key: str) -> str:
        return f"evidence:dedupe:{cache_key}"

    async def get_dedupe_job_id(self, cache_key: str) -> str | None:
        return await self.client.get(self._dedupe_key(cache_key))

    async def set_dedupe_job_id(self, cache_key: str, job_id: str) -> None:
        await self.client.set(
            self._dedupe_key(cache_key),
            job_id,
            ex=settings.job_ttl_seconds,
        )

    async def push_recent_job(self, job_id: str) -> None:
        await self.client.lpush(RECENT_JOBS_KEY, job_id)
        await self.client.ltrim(RECENT_JOBS_KEY, 0, RECENT_JOBS_MAX - 1)

    async def _compute_latency_ms(self, job_id: str) -> int | None:
        created_at = await self.client.hget(self._job_key(job_id), "createdAt")
        if not created_at:
            return None
        try:
            start = datetime.fromisoformat(created_at)
            end = datetime.now(timezone.utc)
            return max(0, int((end - start).total_seconds() * 1000))
        except ValueError:
            return None

    async def create_job(
        self,
        claim: str,
        thread_id: str | None,
        argument_context: str | None,
        finding_id: str | None,
        mode: str = "standard",
        auto_escalate: bool = False,
    ) -> tuple[str, bool]:
        cache_key = build_evidence_cache_key(claim, thread_id, mode, auto_escalate)
        existing_job_id = await self.get_dedupe_job_id(cache_key)
        if existing_job_id:
            existing = await self.get_job(existing_job_id)
            if existing and existing.status in ("queued", "running", "completed"):
                now = now_iso()
                await self.client.hset(
                    self._job_key(existing_job_id),
                    mapping={"cacheHit": "true", "updatedAt": now},
                )
                return existing_job_id, True

        job_id = str(uuid.uuid4())
        now = now_iso()
        payload = {
            "jobId": job_id,
            "status": "queued",
            "stage": "queued",
            "progress": str(STAGE_PROGRESS["queued"]),
            "claim": claim,
            "argumentContext": argument_context or "",
            "threadId": thread_id or "",
            "findingId": finding_id or "",
            "mode": mode,
            "autoEscalate": "true" if auto_escalate else "false",
            "result": "",
            "error": "",
            "createdAt": now,
            "updatedAt": now,
            "completedAt": "",
            "latencyMs": "",
            "cacheHit": "false",
        }
        await self.client.hset(self._job_key(job_id), mapping=payload)
        await self.client.expire(self._job_key(job_id), settings.job_ttl_seconds)
        await self.set_dedupe_job_id(cache_key, job_id)
        await self.push_recent_job(job_id)
        return job_id, False

    async def update_stage(self, job_id: str, stage: JobStage) -> None:
        status: JobStatus = "failed" if stage == "failed" else "running"
        if stage == "completed":
            status = "completed"
        await self.client.hset(
            self._job_key(job_id),
            mapping={
                "stage": stage,
                "progress": str(STAGE_PROGRESS[stage]),
                "status": status,
                "updatedAt": now_iso(),
            },
        )

    async def complete_job(self, job_id: str, result: dict[str, Any]) -> None:
        now = now_iso()
        latency_ms = await self._compute_latency_ms(job_id)
        await self.client.hset(
            self._job_key(job_id),
            mapping={
                "status": "completed",
                "stage": "completed",
                "progress": str(STAGE_PROGRESS["completed"]),
                "result": json.dumps(result),
                "error": "",
                "updatedAt": now,
                "completedAt": now,
                "latencyMs": str(latency_ms) if latency_ms is not None else "",
            },
        )

    async def fail_job(self, job_id: str, error: str) -> None:
        now = now_iso()
        latency_ms = await self._compute_latency_ms(job_id)
        await self.client.hset(
            self._job_key(job_id),
            mapping={
                "status": "failed",
                "stage": "failed",
                "progress": str(STAGE_PROGRESS["failed"]),
                "error": error,
                "updatedAt": now,
                "completedAt": now,
                "latencyMs": str(latency_ms) if latency_ms is not None else "",
            },
        )

    async def get_job(self, job_id: str) -> JobResponse | None:
        data = await self.client.hgetall(self._job_key(job_id))
        if not data:
            return None

        result = _parse_result(data.get("result") or "")
        error_raw = data.get("error") or ""
        error = error_raw if error_raw else None

        status = data.get("status", "queued")
        stage = data.get("stage", "queued")
        progress = int(data.get("progress", "0") or "0")

        if status not in ("queued", "running", "completed", "failed"):
            status = "queued"
        if stage not in STAGE_PROGRESS:
            stage = "queued"

        return JobResponse(
            jobId=job_id,
            status=status,  # type: ignore[arg-type]
            stage=stage,  # type: ignore[arg-type]
            progress=progress,
            result=result,
            error=error,
        )

    async def list_recent_jobs(self) -> list[JobSummary]:
        job_ids = await self.client.lrange(RECENT_JOBS_KEY, 0, RECENT_JOBS_MAX - 1)
        jobs: list[JobSummary] = []

        for job_id in job_ids:
            data = await self.client.hgetall(self._job_key(job_id))
            if not data:
                continue
            jobs.append(_summary_from_hash(job_id, data))

        return jobs
