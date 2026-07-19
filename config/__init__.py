"""Non-secret configuration loaded from environment."""

from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="CENTURIES_MUTUAL_LABS_",
        extra="ignore",
    )

    api_host: str = "127.0.0.1"
    api_port: int = 8080
    log_level: str = "INFO"
    data_raw: Path = Path("data/raw")
    data_processed: Path = Path("data/processed")
    data_reference: Path = Path("data/reference")


def get_settings() -> Settings:
    return Settings()
