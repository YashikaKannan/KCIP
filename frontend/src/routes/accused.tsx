import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { accused } from "@/data/mockData";

export const Route = createFileRoute("/accused")({
  head: () => ({ meta: [
    { title: "Accused — KCIP" },
    { name: "description", content: "Accused persons registry." },
    { property: "og:title", content: "Accused — KCIP" },
    { property: "og:description", content: "Accused persons registry." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Accused" description="Persons of interest and their current status" breadcrumbs={[{ label: "Home" }, { label: "Accused" }]} />
      <DataTable rows={accused} columns={[
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "age", header: "Age" },
        { key: "district", header: "District" },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline">{r.status}</Badge> },
        { key: "repeat", header: "Repeat Offender", render: (r) => r.repeat ? <Badge className="bg-destructive/10 text-destructive border-destructive/30" variant="outline">Yes</Badge> : <span className="text-muted-foreground">No</span> },
      ]} />
    </>
  ),
});
