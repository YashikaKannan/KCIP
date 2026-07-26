from fastapi import APIRouter

from .routes.admin import router as admin_router
from .routes.auth import router as auth_router
from .routes.cases import router as cases_router
from .routes.crime import router as crime_router
from .routes.dashboard import router as dashboard_router
from .routes.intelligence import router as intelligence_router
from .routes.people import router as people_router

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(cases_router)
api_router.include_router(people_router)
api_router.include_router(crime_router)
api_router.include_router(intelligence_router)
api_router.include_router(admin_router)
