from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    redis_url: str = "redis://localhost:6379/0"
    nextjs_base_url: str = "http://localhost:3000"
    evidence_internal_secret: str = ""
    job_ttl_seconds: int = 1800
    host: str = "0.0.0.0"
    port: int = 8000


settings = Settings()
