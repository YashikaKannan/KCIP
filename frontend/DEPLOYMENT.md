# Frontend Deployment Guide for Zoho Catalyst Web Client Hosting

## Overview
This frontend is a Vite-powered React application built with TanStack Router, React Query, and a client-ready UI for the Karnataka Crime Intelligence Platform (KCIP).

## Production build
Use:

```bash
npm run build
```

This generates production assets under `.output/public` and an SSR-ready server bundle under `.output/server`.

## Environment Configuration
The frontend depends on a single environment variable:

```env
VITE_API_URL=https://your-backend.example.com
```

Create a `.env` file locally from `.env.example`. In Zoho Catalyst, configure `VITE_API_URL` from the host or environment settings.

## API URL handling
- The app reads `VITE_API_URL` from `import.meta.env`.
- `frontend/src/lib/http.ts` throws if the variable is missing.
- No hardcoded backend host is allowed in the app source.

## Routing
- Routes are file-based via `src/routes/`.
- TanStack Router supports history-based client routing in production.
- Ensure server rewrite rules send unknown paths to the frontend entry.

## Assets
- Static assets are emitted under `.output/public/assets`.
- Ensure the hosting environment serves `.output/public` as the web root.

## Lazy loading
- `src/routes/crime-map.tsx` lazy-loads the Leaflet map with `React.lazy` + `Suspense`.
- Server- or client-side render path is protected via the TanStack Start stack.

## Build validation
Recommended validation steps:

```bash
npm run build
npm run preview
```

Then verify the app in the browser and check that API fetches use the configured `VITE_API_URL`.

## Deployment README
The app is build-ready for Catalyst AppSail or any static hosting platform that supports Vite output. Point the web host to `.output/public` and configure rewrites for client routing.
