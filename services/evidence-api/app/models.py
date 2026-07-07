from typing import Any, Literal



from pydantic import BaseModel, Field



JobStatus = Literal["queued", "running", "completed", "failed"]

JobStage = Literal[

    "queued",

    "searching",

    "fetching_pages",

    "extracting_passages",

    "ranking_passages",

    "verifying",

    "standard_pipeline",

    "routing_evidence",

    "deep_classification",

    "deep_follow_up_search",

    "deep_source_review",

    "deep_verification",

    "completed",

    "failed",

]



EvidenceMode = Literal["standard", "deep"]





class CreateJobRequest(BaseModel):

    claim: str = Field(min_length=1)

    argumentContext: str | None = None

    threadId: str | None = None

    findingId: str | None = None

    mode: EvidenceMode = "standard"

    autoEscalate: bool = False





class CreateJobResponse(BaseModel):

    jobId: str

    status: Literal["queued"] = "queued"





class UpdateStageRequest(BaseModel):

    stage: JobStage





class JobResponse(BaseModel):

    jobId: str

    status: JobStatus

    stage: JobStage

    progress: int

    result: dict[str, Any] | None = None

    error: str | None = None





class JobSummary(BaseModel):

    jobId: str

    claim: str

    status: JobStatus

    stage: JobStage

    createdAt: str | None = None

    updatedAt: str | None = None

    completedAt: str | None = None

    latencyMs: int | None = None

    claimVerdict: str | None = None

    verificationBasis: str | None = None

    sourceCount: int | None = None

    attachableSourceCount: int | None = None

    cacheHit: bool | None = None

    error: str | None = None

    result: dict[str, Any] | None = None





class JobListResponse(BaseModel):

    jobs: list[JobSummary]

