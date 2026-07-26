from __future__ import annotations

import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class AppConfig(BaseModel):
    app_name: str = "KCIP API"
    api_prefix: str = "/api"
    environment: str = "development"
    version: str = "1.0.0"
    host: str = "0.0.0.0"
    port: int = 9000
    log_level: str = "info"

    @classmethod
    def from_env(cls) -> "AppConfig":
        return cls(
            app_name=os.getenv("APP_NAME", "KCIP API"),
            api_prefix=os.getenv("API_PREFIX", "/api"),
            environment=os.getenv("ENVIRONMENT", "development"),
            version=os.getenv("VERSION", "1.0.0"),
            host=os.getenv("HOST", "0.0.0.0"),
            port=int(os.getenv("PORT", "9000")),
            log_level=os.getenv("LOG_LEVEL", "info"),
        )


@lru_cache(maxsize=1)
def get_config() -> AppConfig:
    return AppConfig.from_env()
