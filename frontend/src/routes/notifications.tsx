import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/data/mockData";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — KCIP" },
    { name: "description", content: "System and case notifications." },
    { property: "og:title", content: "Notifications — KCIP" },
    { property: "og:description", content: "System and case notifications." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Notifications" description="Timeline of alerts and updates" breadcrumbs={[{ label: "Home" }, { label: "Notifications" }]} />
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={`p-4 ${!n.read ? "border-primary/40" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{n.title}</h3>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
              </div>
              <div className="shrink-0 text-right">
                <Badge variant="outline">{n.priority}</Badge>
                <div className="mt-1 text-xs text-muted-foreground">{n.time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  ),
});
