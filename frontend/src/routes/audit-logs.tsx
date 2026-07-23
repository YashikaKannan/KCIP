import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auditLogs } from "@/data/mockData";

const severityColor = {
  Info: "bg-primary/10 text-primary border-primary/30",
  Warning: "bg-warning/15 text-warning border-warning/30",
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
} as const;

export const Route = createFileRoute("/audit-logs")({
  head: () => ({ meta: [
    { title: "Audit Logs — KCIP" },
    { name: "description", content: "System audit trail and user activity." },
    { property: "og:title", content: "Audit Logs — KCIP" },
    { property: "og:description", content: "System audit trail and user activity." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Audit Logs" description="System activity timeline" breadcrumbs={[{ label: "Home" }, { label: "Audit Logs" }]} />
      <Card className="p-5">
        <ol className="relative border-l border-border pl-6">
          {auditLogs.map((l) => (
            <li key={l.id} className="mb-6 last:mb-0">
              <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{l.action} <span className="text-muted-foreground">by {l.user}</span></div>
                  <div className="text-xs text-muted-foreground">{new Date(l.timestamp).toLocaleString()}</div>
                </div>
                <Badge variant="outline" className={severityColor[l.severity]}>{l.severity}</Badge>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </>
  ),
});
