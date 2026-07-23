import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { districts, crimeCategories } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MapView = lazy(() => import("@/components/map/MapView"));

export const Route = createFileRoute("/crime-map")({
  head: () => ({ meta: [
    { title: "Crime Map — KCIP" },
    { name: "description", content: "Geographic visualization of crime incidents." },
    { property: "og:title", content: "Crime Map — KCIP" },
    { property: "og:description", content: "Geographic visualization of crime incidents." },
  ]}),
  component: CrimeMapPage,
});

function CrimeMapPage() {
  return (
    <>
      <PageHeader title="Crime Map" description="Live geographic distribution of reported crimes" breadcrumbs={[{ label: "Home" }, { label: "Crime Map" }]} />

      <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-border bg-card p-3">
        <Select><SelectTrigger className="w-48"><SelectValue placeholder="District" /></SelectTrigger>
          <SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select><SelectTrigger className="w-48"><SelectValue placeholder="Crime Type" /></SelectTrigger>
          <SelectContent>{crimeCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select><SelectTrigger className="w-48"><SelectValue placeholder="View Mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="markers">Markers</SelectItem>
            <SelectItem value="cluster">Cluster</SelectItem>
            <SelectItem value="heat">Heatmap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="h-[600px]">
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
              <MapView />
            </Suspense>
          </ClientOnly>
        </div>
      </Card>
    </>
  );
}
