from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from ..schemas.common import ApiEnvelope


def _error_payload(message: str, data: object = None) -> ApiEnvelope:
    return ApiEnvelope(success=False, message=message, data=data or {})


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
        status_code = exc.status_code or status.HTTP_500_INTERNAL_SERVER_ERROR
        return JSONResponse(status_code=status_code, content=_error_payload(str(exc.detail)).model_dump())

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content=_error_payload("Validation error", exc.errors()).model_dump())

    @app.exception_handler(Exception)
    async def generic_exception_handler(_: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=_error_payload("Internal server error").model_dump())
