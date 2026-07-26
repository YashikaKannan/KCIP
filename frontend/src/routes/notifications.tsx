import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCheck, Archive, Trash2, Search, Bell } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — KCIP" },
      { name: "description", content: "System and case notifications." },
      { property: "og:title", content: "Notifications — KCIP" },
      { property: "og:description", content: "System and case notifications." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markRead);
  const markAllRead = useAppStore((s) => s.markAllRead);
  const deleteNotification = useAppStore((s) => s.deleteNotification);
  const archiveNotification = useAppStore((s) => s.archiveNotification);

  const [priority, setPriority] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [query, setQuery] = useState("");

  const visible = notifications.filter((n) => {
    if (n.archived) return false;
    if (priority !== "all" && n.priority !== priority) return false;
    if (status === "unread" && n.read) return false;
    if (status === "read" && !n.read) return false;
    if (query && !`${n.title} ${n.message}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const unread = notifications.filter((n) => !n.read && !n.archived).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Timeline of alerts and updates"
        breadcrumbs={[{ label: "Home" }, { label: "Notifications" }]}
        actions={
          <Button variant="outline" onClick={() => { markAllRead(); toast.success("All notifications marked read"); }}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      <Card className="mb-4 flex flex-wrap items-center gap-2 p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notifications…" className="h-9 pl-8" />
        </div>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="ml-auto">{unread} unread</Badge>
      </Card>

      <div className="space-y-3">
        {visible.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <Bell className="h-6 w-6 opacity-40" />
            No notifications match the current filters.
          </Card>
        ) : (
          visible.map((n) => (
            <Card key={n.id} className={`p-4 transition-colors ${!n.read ? "border-primary/40 bg-primary/[0.02]" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{n.title}</h3>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <Badge variant="outline" className={
                      n.priority === "High" ? "border-destructive/40 text-destructive"
                      : n.priority === "Medium" ? "border-warning/40 text-warning"
                      : "border-border"
                    }>
                      {n.priority}
                    </Badge>
                    <span>{n.time}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {!n.read && (
                    <Button size="sm" variant="ghost" onClick={() => { markRead(n.id); toast("Marked as read"); }}>
                      Mark read
                    </Button>
                  )}
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { archiveNotification(n.id); toast("Archived"); }} title="Archive">
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { deleteNotification(n.id); toast("Deleted"); }} title="Delete">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
