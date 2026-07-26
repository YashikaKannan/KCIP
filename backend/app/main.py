import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router
from .core.config import get_config
from .core.exceptions import register_exception_handlers
from .core.middleware import LoggingMiddleware
from .core.settings import get_settings

config = get_config()
settings = get_settings()

logging.basicConfig(
    level=settings.log_level.upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("kcip.api")

allowed_origins = (
    settings.cors_origins
    if settings.cors_origins
    else (["*"] if settings.environment == "development" else [])
)

app = FastAPI(title=config.app_name, version=config.version)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)
register_exception_handlers(app)
app.include_router(api_router)


@app.on_event("startup")
async def startup_event() -> None:
    logger.info(
        "Starting %s v%s in %s mode on %s:%s",
        config.app_name,
        config.version,
        settings.environment,
        config.host,
        config.port,
    )


@app.on_event("shutdown")
async def shutdown_event() -> None:
    logger.info("Shutting down %s", config.app_name)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
