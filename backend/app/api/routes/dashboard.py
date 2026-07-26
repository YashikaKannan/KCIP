from fastapi import APIRouter

from ...services.dashboard import DashboardService
from ...utils.response import api_response

router = APIRouter(prefix="/dashboard", tags=["dashboard"])
service = DashboardService()


@router.get("/summary")
def get_summary() -> dict:
    return api_response(service.summary())


@router.get("")
def get_dashboard() -> dict:
    return api_response(service.dashboard())


@router.get("/hotspots")
def get_hotspots() -> dict:
    return api_response(service.hotspots())


@router.get("/recent-cases")
def get_recent_cases(limit: int = 8) -> dict:
    return api_response(service.recent_cases(limit))


@router.get("/bootstrap")
def get_bootstrap() -> dict:
    return api_response(service.bootstrap())


@router.get("/health")
def get_health() -> dict:
    return api_response(service.health_services())
