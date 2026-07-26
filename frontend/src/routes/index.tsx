import { createFileRoute } from "@tanstack/react-router";
import { FileText, FolderOpen, CheckCircle2, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { DataTable } from "@/components/common/DataTable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useAiInsights,
  useDashboardHotspots,
  useDashboardRecentCases,
  useDashboardSummary,
  useNotifications,
} from "@/hooks/api/useKcipQueries";

const statusColors = {
  Open: "bg-warning/15 text-warning border-warning/30",
  Closed: "bg-success/15 text-success border-success/30",
  "Under Investigation": "bg-primary/10 text-primary border-primary/30",
  Pending: "bg-muted text-muted-foreground border-border",
} as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — KCIP" },
      { name: "description", content: "Executive crime intelligence dashboard for Karnataka State Police." },
      { property: "og:title", content: "KCIP Dashboard" },
      { property: "og:description", content: "Live crime analytics, AI alerts, and district-level insights." },
    ],
  }),
  component: Dashboard,
});

const chartColors = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#84CC16"];

function Dashboard() {
  const summaryQuery = useDashboardSummary();
  const hotspotsQuery = useDashboardHotspots();
  const recentCasesQuery = useDashboardRecentCases(8);
  const aiInsightsQuery = useAiInsights();
  const notificationsQuery = useNotifications();

  if (summaryQuery.isLoading || hotspotsQuery.isLoading || recentCasesQuery.isLoading || aiInsightsQuery.isLoading || notificationsQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading dashboard data…</div>;
  }

  const summary = summaryQuery.data;
  const hotspots = hotspotsQuery.data ?? [];
  const recentCases = recentCasesQuery.data ?? [];
  const aiInsights = aiInsightsQuery.data ?? [];
  const notifications = notificationsQuery.data ?? [];
  const crimeTrend = summary?.monthlyTrends ?? [];
  const districtComparison = summary?.casesByDistrict ?? [];
  const crimeDistribution = summary?.casesByCrimeHead ?? [];

  return (
    <>
      <PageHeader
        title="Executive Dashboard"
        description="AI-driven crime intelligence across Karnataka districts"
        breadcrumbs={[{ label: "Home" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Cases" value={summary?.todayCases ?? 0} icon={FileText} tone="primary" delta="+12 vs yesterday" />
        <StatCard label="Open Cases" value={(summary?.openCases ?? 0).toLocaleString()} icon={FolderOpen} tone="warning" delta="Across 30 districts" />
        <StatCard label="Solved Cases" value={(summary?.solvedCases ?? 0).toLocaleString()} icon={CheckCircle2} tone="success" delta="+3.2% MoM" />
        <StatCard label="Pending Investigation" value={summary?.pending ?? 0} icon={Clock} tone="danger" delta="Requires review" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Crime Trend</h3>
              <p className="text-xs text-muted-foreground">Reported vs solved over 12 months</p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={crimeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#2563EB" strokeWidth={2} />
                <Line type="monotone" dataKey="solved" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold">Crime Distribution</h3>
          <p className="text-xs text-muted-foreground">By category</p>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={crimeDistribution} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40}>
                  {crimeDistribution.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">District Crime Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={districtComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="district" stroke="#64748B" fontSize={10} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="cases" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Top Hotspot Districts</h3>
          <div className="space-y-3">
            {hotspots.map((h) => (
              <div key={h.district} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <div className="text-sm font-medium">{h.district}</div>
                  <div className="text-xs text-muted-foreground">{h.cases} cases</div>
                </div>
                <Badge className="bg-destructive/10 text-destructive border-destructive/30" variant="outline">
                  Risk {h.risk}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Recent AI Alerts</h3>
          <div className="space-y-3">
            {aiInsights.slice(0, 3).map((a, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{a.title}</div>
                  <Badge variant="outline">{a.confidence}%</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{a.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Recent Notifications</h3>
          <div className="space-y-2">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-3 rounded-md border border-border p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{n.message}</div>
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant="outline" className="text-[10px]">{n.priority}</Badge>
                  <div className="mt-1 text-[10px] text-muted-foreground">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold">Recent FIRs</h3>
        <DataTable
          rows={recentCases.slice(0, 8)}
          columns={[
            { key: "id", header: "FIR ID" },
            { key: "title", header: "Title" },
            { key: "district", header: "District" },
            { key: "category", header: "Category" },
            {
              key: "status", header: "Status",
              render: (r) => <Badge variant="outline" className={statusColors[r.status]}>{r.status}</Badge>,
            },
            { key: "date", header: "Date" },
          ]}
        />
      </div>
    </>
  );
}
