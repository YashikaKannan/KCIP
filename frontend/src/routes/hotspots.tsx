import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Flame } from "lucide-react";
import { useDashboardHotspots, useDashboardSummary } from "@/hooks/api/useKcipQueries";

export const Route = createFileRoute("/hotspots")({
  head: () => ({ meta: [
    { title: "Crime Hotspots — KCIP" },
    { name: "description", content: "Risk scoring and hotspot analytics." },
    { property: "og:title", content: "Crime Hotspots — KCIP" },
    { property: "og:description", content: "Risk scoring and hotspot analytics." },
  ]}),
  component: CrimeHotspotsPage,
});

function CrimeHotspotsPage() {
  const hotspotsQuery = useDashboardHotspots();
  const summaryQuery = useDashboardSummary();
  const hotspots = hotspotsQuery.data ?? [];
  const trend = summaryQuery.data?.weeklyTrends?.map((item) => ({ week: item.week, risk: item.cases })) ?? [];

  return (
    <>
      <PageHeader title="Crime Hotspots" description="Areas with elevated risk scores" breadcrumbs={[{ label: "Home" }, { label: "Hotspots" }]} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hotspots.map((h) => (
          <Card key={h.district} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{h.district}</div>
                <div className="mt-1 text-3xl font-bold">{h.risk}</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-destructive/10 text-destructive">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{h.cases} cases</span>
              <Badge variant="outline">{h.trend === "up" ? "↑ Rising" : "↓ Falling"}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h3 className="mb-4 text-sm font-semibold">Risk Trend</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="week" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="risk" stroke="#EF4444" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
