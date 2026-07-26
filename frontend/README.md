# KCIP — Karnataka Crime Intelligence Platform

**Enterprise-grade, frontend-only AI crime intelligence dashboard** for the Karnataka State Police. Built for the Zoho Catalyst Hackathon.

> This repository ships the **frontend layer only**. All data is mocked. Every endpoint listed below is a placeholder for future backend integration on Zoho Catalyst.

---

## 1. Project Overview
KCIP replaces static Excel-driven crime reporting with a live, interactive intelligence platform. Officers, analysts, and administrators get a command-center view of FIRs, victims, accused, arrests, hotspots, crime networks, and AI-generated insights across all 30+ Karnataka districts.

## 2. Objectives
- Interactive analytics for SCRB, State, District, PS, IO, Analyst and Viewer roles
- Visualize FIRs, victims, accused, arrests, charge sheets in a single console
- Geographic + graph + hotspot views for investigation
- AI insights, predictions, explainability, recommendations
- Role-based UX with mock authorization
- Ready-to-integrate architecture for Zoho Catalyst services

## 3. Features
- Executive dashboard with KPIs and Recharts visualizations
- FIR / Victim / Accused / Arrest / Charge Sheet management screens
- Karnataka crime map (React Leaflet) with markers & popups
- Criminal network graph (React Flow)
- Crime hotspots with district risk scoring
- Crime predictions with confidence trends
- AI Intelligence module: patterns, repeat offenders, correlations, MO detection, explainability
- Reports (mock PDF/Excel), Notifications, Audit logs
- Settings, Admin (user management)
- Grouped sidebar (Operations / Intelligence / Administration)
- Rich header: page title, global search, quick actions, district selector, runtime status, notifications, role switcher, avatar, live date/time
- Runtime Health Strip for 11 mock backend services
- Toast feedback on every action (sonner)
- Framer Motion page transitions

## 4. Design System
Light, enterprise theme (OKLCH tokens in `src/styles.css`).
- Primary `#2563EB`, Secondary `#3B82F6`
- Success (green), Warning (amber), Destructive (red)
- Card radius `0.625rem`, subtle shadows, consistent spacing
- Typography: system UI stack, semibold headings, tabular numerics

## 5. Folder Structure
```
src/
  components/
    layout/AppLayout.tsx        # Sidebar + header + runtime strip
    common/                     # PageHeader, StatCard, DataTable
    map/MapView.tsx             # Client-only Leaflet map
    ui/                         # shadcn primitives
  data/mockData.ts              # All mock records
  store/appStore.ts             # Zustand global state
  routes/                       # TanStack file-based routes
    __root.tsx                  # Root layout, providers, Toaster
    index.tsx                   # Dashboard
    fir.tsx | victims.tsx | accused.tsx | arrests.tsx | charge-sheets.tsx
    crime-map.tsx | crime-network.tsx | hotspots.tsx | predictions.tsx
    ai-intelligence.tsx | reports.tsx | notifications.tsx
    audit-logs.tsx | settings.tsx | admin.tsx
  lib/utils.ts                  # cn() helper
  styles.css                    # Tailwind v4 tokens + theme
```

## 6. Application Architecture
- **Routing:** TanStack Router (file-based) — mandated by the template
- **State:** Zustand (`appStore`) — sidebar, current user/role, notifications drawer
- **Data:** React Query provider ready; currently reads from `mockData.ts`
- **Rendering:** Vite + React 19, SSR-safe (Leaflet loaded via `<ClientOnly>` + `React.lazy`)
- **Styling:** Tailwind v4 CSS-first, shadcn/ui, semantic tokens only

## 7. Page Descriptions
| Route | Purpose |
| --- | --- |
| `/` | Executive dashboard: KPIs, trends, distribution, hotspots, AI alerts |
| `/fir` | FIR list with filter/search/status |
| `/victims` | Victim registry & profiles |
| `/accused` | Accused registry, repeat-offender flags |
| `/arrests` | Arrest tracking |
| `/charge-sheets` | Charge sheet workflow |
| `/crime-map` | Karnataka Leaflet map with incident markers |
| `/crime-network` | React Flow suspect/victim/case graph |
| `/hotspots` | District risk scoring & heat table |
| `/predictions` | Predictive risk + confidence |
| `/ai-intelligence` | Insights, patterns, MO detection, explainability |
| `/reports` | Report generator (mock export) |
| `/notifications` | Priority-tagged alerts |
| `/audit-logs` | Immutable activity timeline |
| `/settings` | Preferences & theme |
| `/admin` | User & role management |

## 8. User Roles
- SCRB Administrator
- State Officer
- District Officer
- Police Station Officer
- Investigation Officer
- Analyst
- Viewer

Switchable at runtime from the header avatar → **Switch role**.

## 9. State Management
```ts
useAppStore(): {
  sidebarCollapsed, toggleSidebar,
  user: { name, role, district },
  setRole,
  notificationsOpen, setNotificationsOpen,
}
```

## 10. Mock Data
`src/data/mockData.ts` exports FIRs, victims, accused, arrests, charge sheets, districts, crime categories, hotspots, map markers, predictions, AI insights, notifications, audit logs, graph nodes/edges, and runtime service health.

## 11. AI Intelligence Module
Purely an **intelligence** surface (not an ML training console). Cards cover:
- Crime pattern summary
- Repeat-offender detection
- Emerging trends
- Hidden associations
- MO pattern detection
- Hotspot intelligence & district risk
- Prediction confidence
- Recent AI alerts
- Explainability (why / confidence / evidence / affected districts / recommended action)

## 12. Charts (Recharts)
Crime Trend · Distribution · FIR Timeline · District Comparison · Arrest Analysis · Categories · Hotspot Trend · Prediction Confidence · AI Risk Distribution.

## 13. Maps & Graphs
- **React Leaflet** — Karnataka basemap, incident markers, popups. Loaded client-only to avoid SSR `window` errors.
- **React Flow** — suspect/victim/location/case/organization graph.

## 14. Required Backend APIs (future)
```
POST  /auth/login        POST /auth/otp        POST /auth/forgot
GET   /dashboard/summary GET  /dashboard/trend
GET   /fir  POST /fir    GET  /fir/:id
GET   /victims           GET  /accused         GET  /arrests
GET   /charge-sheets     GET  /crime-map/markers
GET   /hotspots          GET  /predictions     GET  /ai/insights
GET   /reports           POST /reports/generate
GET   /notifications     GET  /audit-logs
GET   /admin/users       POST /admin/users     GET/POST /admin/roles
```

## 15. Expected Zoho Catalyst Services
Authentication · API Gateway · Data Store · NoSQL · Cache · Signals · Circuits · Cron · SmartBrowz · Stratus · AppSail · Push Notifications · Mail · Catalyst AI.

## 16. Future Backend Integration Plan
1. Replace `mockData.ts` reads with React Query queries against Catalyst API Gateway.
2. Wire Catalyst Authentication into `appStore.user`.
3. Move role/permission checks to Catalyst-issued JWT claims.
4. Stream runtime health from Catalyst Signals into the Health Strip.
5. Push AI insights via Catalyst AI + Signals.
6. Generate reports via Catalyst Cron + Stratus.

## 17. Installation
```bash
bun install
bun run dev
```

## 18. Build
```bash
bun run build
```

## 19. Deployment
Deploy the Vite output to any static host or Catalyst AppSail. Point the frontend at the Catalyst API Gateway base URL when the backend lands.

## 20. Known Limitations
- No real authentication or persistence (mock only)
- No backend endpoints implemented
- Map uses OpenStreetMap tiles; no offline basemap

## 21. Future Enhancements
- Real-time WebSocket alerts
- Offline map tiles for field units
- Voice-driven FIR intake
- Multi-language support (Kannada, Hindi, English)
- Deep integration with Karnataka CCTNS

---

**KCIP is frontend-only today.** The architecture, contracts, and UX are ready for a Catalyst backend to plug into on day one.
