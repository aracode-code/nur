from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="NUR_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "NUR API"
    app_version: str = "0.1.0"
    environment: str = "local"
    api_v1_prefix: str = "/api/v1"
    log_level: str = "INFO"
    auth_mode: str = "mock"
    cors_origins: list[str] = ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
