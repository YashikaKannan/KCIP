import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { predictions } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { Brain, TrendingUp, Shield } from "lucide-react";

export const Route = createFileRoute("/predictions")({
  head: () => ({ meta: [
    { title: "Crime Predictions — KCIP" },
    { name: "description", content: "AI-driven risk predictions across districts." },
    { property: "og:title", content: "Crime Predictions — KCIP" },
    { property: "og:description", content: "AI-driven risk predictions across districts." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Crime Predictions" description="Forecasting risk with AI models" breadcrumbs={[{ label: "Home" }, { label: "Predictions" }]} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-primary" /><span className="text-xs uppercase text-muted-foreground">Predicted Risk</span></div>
          <div className="mt-3 text-4xl font-bold">{predictions.riskScore}</div>
          <Progress value={predictions.riskScore} className="mt-3" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3"><Brain className="h-5 w-5 text-success" /><span className="text-xs uppercase text-muted-foreground">Model Confidence</span></div>
          <div className="mt-3 text-4xl font-bold">{predictions.confidence}%</div>
          <Progress value={predictions.confidence} className="mt-3" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-warning" /><span className="text-xs uppercase text-muted-foreground">Trend</span></div>
          <div className="mt-3 text-lg font-semibold">Rising risk in urban zones</div>
          <div className="mt-1 text-xs text-muted-foreground">Model v2.4 • updated 12h ago</div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Risk Trend (8 weeks)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={predictions.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="week" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Category Probability</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={predictions.categoryPrediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="probability" fill="#2563EB" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">High-Risk Areas</h3>
          <div className="space-y-2">
            {predictions.highRiskAreas.map(a => (
              <div key={a.district} className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm">{a.district}</span>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Score {a.score}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">AI Recommendation</h3>
          <p className="text-sm text-muted-foreground">
            Increase patrol density in Bengaluru Urban and Mysuru during 20:00–02:00. Deploy cyber-cell resources to Hubballi where UPI-fraud FIRs increased 12% WoW. Coordinate narcotics teams along NH-48 corridor.
          </p>
          <div className="mt-3 flex gap-2">
            <Badge variant="outline">Explainability: SHAP</Badge>
            <Badge variant="outline">Model v2.4</Badge>
          </div>
        </Card>
      </div>
    </>
  ),
});
