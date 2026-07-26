from fastapi import APIRouter

from ...services.ai import AIService
from ...utils.response import api_response

router = APIRouter(tags=["intelligence"])
service = AIService()


@router.get("/alerts")
def alerts() -> dict:
    return api_response(service.alerts())


@router.get("/predictions")
def predictions() -> dict:
    return api_response(service.predictions())


@router.get("/ai-insights")
def insights() -> dict:
    return api_response(service.insights())


@router.get("/associations")
def associations() -> dict:
    return api_response(service.associations())


@router.get("/repeat-offenders")
def repeat_offenders() -> dict:
    return api_response(service.repeat_offenders())


@router.get("/mo-profiles")
def mo_profiles() -> dict:
    return api_response(service.mo_profiles())


@router.get("/dashboard-cache")
def dashboard_cache() -> dict:
    return api_response(service.dashboard_cache())
