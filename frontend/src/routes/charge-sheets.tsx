import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { chargeSheets } from "@/data/mockData";

export const Route = createFileRoute("/charge-sheets")({
  head: () => ({ meta: [
    { title: "Charge Sheets — KCIP" },
    { name: "description", content: "Filed charge sheets and court status." },
    { property: "og:title", content: "Charge Sheets — KCIP" },
    { property: "og:description", content: "Filed charge sheets and court status." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Charge Sheets" description="Court filings tied to FIRs" breadcrumbs={[{ label: "Home" }, { label: "Charge Sheets" }]} />
      <DataTable rows={chargeSheets} columns={[
        { key: "id", header: "CS ID" },
        { key: "fir", header: "FIR" },
        { key: "filedOn", header: "Filed On" },
        { key: "court", header: "Court" },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline">{r.status}</Badge> },
      ]} />
    </>
  ),
});
