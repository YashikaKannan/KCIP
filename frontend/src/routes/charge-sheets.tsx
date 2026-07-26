import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { useChargeSheets } from "@/hooks/api/useKcipQueries";

export const Route = createFileRoute("/charge-sheets")({
  head: () => ({ meta: [
    { title: "Charge Sheets — KCIP" },
    { name: "description", content: "Filed charge sheets and court status." },
    { property: "og:title", content: "Charge Sheets — KCIP" },
    { property: "og:description", content: "Filed charge sheets and court status." },
  ]}),
  component: ChargeSheetsPage,
});

function ChargeSheetsPage() {
  const { data, isLoading, error } = useChargeSheets();

  return (
    <>
      <PageHeader title="Charge Sheets" description="Court filings tied to FIRs" breadcrumbs={[{ label: "Home" }, { label: "Charge Sheets" }]} />
      <DataTable
        rows={data ?? []}
        loading={isLoading}
        emptyMessage={error ? "Failed to load charge sheets" : "No charge sheets found"}
        columns={[
          { key: "id", header: "CS ID" },
          { key: "fir", header: "FIR" },
          { key: "filedOn", header: "Filed On" },
          { key: "court", header: "Court" },
          { key: "status", header: "Status", render: (r) => <Badge variant="outline">{r.status}</Badge> },
        ]}
      />
    </>
  );
}
