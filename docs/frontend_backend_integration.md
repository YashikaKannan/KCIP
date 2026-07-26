# Frontend Backend Integration

## Overview

KCIP now runs as a React frontend backed by a FastAPI service.
The frontend fetches data from `VITE_API_URL` and the backend serves all resources under `/api`.

## Runtime Contract

- Frontend base URL: `http://localhost:8000`
- Backend API prefix: `/api`
- Full request example: `http://localhost:8000/api/dashboard/summary`

## Backend Structure

- `backend/app/main.py` wires FastAPI, CORS, logging middleware, and exception handlers.
- `backend/app/core/config.py` centralizes app name, API prefix, version, environment, and allowed origins.
- `backend/app/mock/` is the repository-facing mock data layer used by the current repositories.
- `backend/app/repositories/mock/` holds the mock repositories.
- `backend/app/services/` contains service-layer orchestration.
- `backend/app/api/routes/` exposes the HTTP routes.

## Frontend Structure

- `frontend/src/lib/http.ts` provides the shared JSON fetch helper.
- `frontend/src/api/` contains domain API modules for dashboard, cases, victims, accused, employees, courts, districts, police stations, crime metadata, and AI data.
- `frontend/src/hooks/api/useKcipQueries.ts` wraps the API modules with TanStack React Query.

## Local Development

1. Start the backend from `backend/` with `uvicorn app.main:app --reload --port 8000`.
2. Start the frontend from `frontend/` with `npm run dev`.
3. Set `frontend/.env` to `VITE_API_URL=http://localhost:8000`.

## Notes

- The current backend implementation uses a deterministic mock repository layer so the frontend can remain stable while the data source is swapped later.
- The response format is standardized as `{ success, message, data, meta }`.
- The frontend code expects the backend to keep the `/api` prefix stable.
