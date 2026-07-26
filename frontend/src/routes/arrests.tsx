import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { useArrests } from "@/hooks/api/useKcipQueries";

export const Route = createFileRoute("/arrests")({
  head: () => ({ meta: [
    { title: "Arrests — KCIP" },
    { name: "description", content: "Recent arrests across districts." },
    { property: "og:title", content: "Arrests — KCIP" },
    { property: "og:description", content: "Recent arrests across districts." },
  ]}),
  component: ArrestsPage,
});

function ArrestsPage() {
  const { data, isLoading, error } = useArrests();

  return (
    <>
      <PageHeader title="Arrests" description="Records of arrests linked to FIRs" breadcrumbs={[{ label: "Home" }, { label: "Arrests" }]} />
      <DataTable
        rows={data ?? []}
        loading={isLoading}
        emptyMessage={error ? "Failed to load arrests" : "No arrests found"}
        columns={[
          { key: "id", header: "Arrest ID" },
          { key: "accused", header: "Accused" },
          { key: "fir", header: "FIR" },
          { key: "date", header: "Date" },
          { key: "officer", header: "Officer" },
          { key: "district", header: "District" },
        ]}
      />
    </>
  );
}
