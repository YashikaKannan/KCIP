# Backend Deployment Guide for Zoho Catalyst AppSail

## Overview
This backend is a FastAPI service built for the Karnataka Crime Intelligence Platform (KCIP). It is packaged as a Docker container and is designed to run on port `9000`.

## Deployment Requirements
- Python 3.11 runtime (container image uses `python:3.11-slim`)
- `uvicorn` as the ASGI server
- Environment variables loaded from `.env`
- Production logging enabled
- CORS origins configured via environment
- Health endpoint available at `/health`

## Key Files
- `Dockerfile` - production-ready container build
- `requirements.txt` - runtime dependencies
- `app/main.py` - FastAPI app initialization, CORS, logging, startup/shutdown events
- `app/core/config.py` - application runtime config
- `app/core/settings.py` - app settings and environment-driven CORS
- `.env.example` - environment variable template

## Startup
The container starts with:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 9000 --log-level info
```

## Environment Variables
Use `.env.example` as a reference. Required values for production:
- `APP_NAME`
- `API_PREFIX`
- `ENVIRONMENT`
- `VERSION`
- `HOST`
- `PORT`
- `LOG_LEVEL`
- `CORS_ORIGINS`
- `JWT_SECRET`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `ACCESS_TOKEN_MINUTES`

## CORS
The backend uses `CORSMiddleware` with `allow_origins` set from `CORS_ORIGINS`. In production, set this to the frontend host(s) allowed to access the API.

## Health Check
The health endpoint is available at:

```text
/health
```

## Validation Checklist
- [x] Correct FastAPI app import path: `app.main:app`
- [x] Dockerfile exposes port `9000`
- [x] Startup/shutdown events are logged
- [x] No hardcoded `localhost` or `8000` in backend files
- [x] Dependencies limited to runtime packages only
- [x] Environment variables centralized in `.env`

## Notes for AppSail
Zoho Catalyst may require:
- mounting `.env` as secrets or config vars
- using the container registry and runtime environment settings
- verifying health probes for `/health`
- permitting requests from the AppSail service URL via CORS
