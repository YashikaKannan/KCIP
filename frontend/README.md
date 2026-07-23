# KCIP — Karnataka Crime Intelligence Platform

**Frontend-only** AI-driven crime analytics & visualization platform for the Karnataka State Police.

## Overview
KCIP replaces static Excel reports with an interactive intelligence dashboard: crime patterns, criminal networks, hotspots, investigations, and AI-generated insights — all mock data on the frontend, ready for backend integration.

## Objectives
- Interactive analytics for officers, analysts, and administrators
- Visualize FIRs, victims, accused, arrests, and charge sheets
- Crime map + graph network + hotspot risk scoring
- AI predictions, insights, and explainability
- Role-based views for SCRB, State, District, PS, IO, Analyst, Viewer

## Tech Stack
React 19 · Vite · TypeScript · Tailwind CSS v4 · **TanStack Router** (template-mandated instead of React Router) · TanStack Query · Zustand · React Hook Form · Zod · Framer Motion · Recharts · React Leaflet · React Flow · Lucide · shadcn/ui.

## Design System
Light theme, enterprise-grade.
- Primary `#2563EB`, Secondary `#3B82F6`
- Background `#F8FAFC`, Cards white, Border `#E2E8F0`
- Success green, Warning orange, Danger red

## Folder Structure
```
src/
  components/
    layout/AppLayout.tsx       # Sidebar + top nav + health strip
    common/                    # PageHeader, StatCard, DataTable
    ui/                        # shadcn primitives
  data/mockData.ts             # All mock records
  store/appStore.ts            # Zustand app store
  routes/                      # File-based routes (TanStack)
    index.tsx                  # Dashboard
    fir.tsx | victims.tsx | accused.tsx | arrests.tsx | charge-sheets.tsx
    crime-map.tsx | crime-network.tsx | hotspots.tsx | predictions.tsx
    ai-intelligence.tsx | reports.tsx | notifications.tsx | audit-logs.tsx
    settings.tsx | admin.tsx
```

## Pages
Dashboard · FIR · Victims · Accused · Arrests · Charge Sheets · Crime Map · Crime Network · Crime Hotspots · Crime Predictions · AI Intelligence · Reports · Notifications · Audit Logs · Settings · Admin.

## User Roles
SCRB Administrator · State Officer · District Officer · Police Station Officer · Investigation Officer · Analyst · Viewer. Configurable in `src/store/appStore.ts`.

## State Management
Zustand store (`appStore`) holds sidebar state, current user/role, and notification drawer state.

## Mock Data
All lists (FIRs, victims, accused, arrests, charge sheets, hotspots, predictions, AI insights, notifications, audit logs, graph nodes/edges, health services) live in `src/data/mockData.ts`.

## Future Backend Integration (Zoho Catalyst) — placeholders only
The frontend expects to plug into: Catalyst Authentication, API Gateway, Data Store, NoSQL, Cache, Signals, Circuits, Cron, SmartBrowz, Stratus, AppSail, Push Notifications, Mail. **No integration is implemented here.**

### Expected backend endpoints (illustrative)
- `POST /auth/login`, `POST /auth/otp`, `POST /auth/forgot`
- `GET /dashboard/summary`, `GET /dashboard/trend`
- `GET/POST /fir`, `GET /fir/:id`
- `GET /victims`, `GET /accused`, `GET /arrests`, `GET /charge-sheets`
- `GET /crime-map/markers`, `GET /hotspots`
- `GET /predictions`, `GET /ai/insights`
- `GET /reports`, `POST /reports/generate`
- `GET /notifications`, `GET /audit-logs`
- `GET/POST /admin/users`, `GET/POST /admin/roles`

## Setup
```
bun install
bun run dev
```

## Notes
- Routing uses TanStack Router (template requirement), not `react-router-dom`.
- No backend, no APIs, no server logic, no AI models.
