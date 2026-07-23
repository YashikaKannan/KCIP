import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiInsights } from "@/data/mockData";
import { Brain, Sparkles, Users, Activity, Link2, Lightbulb } from "lucide-react";

const icons = { Pattern: Sparkles, Behavior: Users, Correlation: Link2, Trend: Activity } as const;

export const Route = createFileRoute("/ai-intelligence")({
  head: () => ({ meta: [
    { title: "AI Intelligence — KCIP" },
    { name: "description", content: "AI-powered insights, patterns, and explainability." },
    { property: "og:title", content: "AI Intelligence — KCIP" },
    { property: "og:description", content: "AI-powered insights, patterns, and explainability." },
  ]}),
  component: () => (
    <>
      <PageHeader title="AI Intelligence" description="Patterns, behaviors, correlations, and emerging trends" breadcrumbs={[{ label: "Home" }, { label: "AI Intelligence" }]} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {aiInsights.map((a, i) => {
          const Icon = (icons as any)[a.type] ?? Brain;
          return (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    <Badge variant="outline">{a.confidence}% confidence</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline">{a.type}</Badge>
                    <Badge variant="outline"><Lightbulb className="mr-1 h-3 w-3" />Explainable</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  ),
});
