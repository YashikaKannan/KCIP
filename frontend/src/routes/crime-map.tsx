import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { districts, crimeCategories } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MapView = lazy(() => import("@/components/map/MapView"));

export const Route = createFileRoute("/crime-map")({
  head: () => ({
    meta: [
      { title: "Crime Map — KCIP" },
      { name: "description", content: "Geographic visualization of crime incidents." },
      { property: "og:title", content: "Crime Map — KCIP" },
      { property: "og:description", content: "Geographic visualization of crime incidents." },
    ],
  }),
  component: CrimeMapPage,
});

function CrimeMapPage() {
  const [district, setDistrict] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [mode, setMode] = useState<"markers" | "cluster" | "heat">("markers");

  return (
    <>
      <PageHeader
        title="Crime Map"
        description="Live geographic distribution of reported crimes"
        breadcrumbs={[{ label: "Home" }, { label: "Crime Map" }]}
      />

      <div className="relative z-[600] mb-4 flex flex-wrap gap-2 rounded-lg border border-border bg-card p-3">
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger className="w-48"><SelectValue placeholder="District" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Crime Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {crimeCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={mode} onValueChange={(v) => setMode(v as any)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="View Mode" /></SelectTrigger>
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
              <MapView districtFilter={district} typeFilter={type} mode={mode} />
            </Suspense>
          </ClientOnly>
        </div>
      </Card>
    </>
  );
}
