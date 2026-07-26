import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


def _parse_cors_origins(value: str | list[str] | None) -> list[str]:
    if isinstance(value, list):
        return value
    if not value:
        return []
    return [origin.strip() for origin in value.split(",") if origin.strip()]


class Settings(BaseModel):
    environment: str = "development"
    cors_origins: list[str] = []
    jwt_secret: str = "kcip-mock-secret"
    jwt_issuer: str = "kcip-mock-auth"
    jwt_audience: str = "kcip-frontend"
    access_token_minutes: int = 480
    log_level: str = "info"

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            environment=os.getenv("ENVIRONMENT", "development"),
            cors_origins=_parse_cors_origins(os.getenv("CORS_ORIGINS", "")),
            jwt_secret=os.getenv("JWT_SECRET", "kcip-mock-secret"),
            jwt_issuer=os.getenv("JWT_ISSUER", "kcip-mock-auth"),
            jwt_audience=os.getenv("JWT_AUDIENCE", "kcip-frontend"),
            access_token_minutes=int(os.getenv("ACCESS_TOKEN_MINUTES", "480")),
            log_level=os.getenv("LOG_LEVEL", "info"),
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings.from_env()
