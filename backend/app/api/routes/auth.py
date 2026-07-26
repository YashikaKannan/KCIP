from fastapi import APIRouter, HTTPException, status

from ...core.settings import get_settings
from ...schemas.common import LoginRequest
from ...services.auth import AuthService
from ...utils.response import api_response

router = APIRouter(prefix="/auth", tags=["auth"])
service = AuthService()
settings = get_settings()


@router.post("/login")
def login(payload: LoginRequest) -> dict:
    try:
        return api_response(service.login(payload.email, payload.password), message="Login successful")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc


@router.post("/logout")
def logout() -> dict:
    return api_response(service.logout(), message="Logged out")


@router.get("/me")
def me() -> dict:
    return api_response(service.current_user())
