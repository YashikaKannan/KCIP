import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { useVictims } from "@/hooks/api/useKcipQueries";

export const Route = createFileRoute("/victims")({
  head: () => ({ meta: [
    { title: "Victims — KCIP" },
    { name: "description", content: "Victim records and linked FIRs." },
    { property: "og:title", content: "Victims — KCIP" },
    { property: "og:description", content: "Victim records and linked FIRs." },
  ]}),
  component: VictimsPage,
});

function VictimsPage() {
  const { data, isLoading, error } = useVictims();

  return (
    <>
      <PageHeader title="Victims" description="Victim registry" breadcrumbs={[{ label: "Home" }, { label: "Victims" }]} />
      <DataTable
        rows={data ?? []}
        loading={isLoading}
        emptyMessage={error ? "Failed to load victims" : "No victims found"}
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Name" },
          { key: "age", header: "Age" },
          { key: "gender", header: "Gender" },
          { key: "district", header: "District" },
          { key: "linkedFIR", header: "Linked FIR" },
        ]}
      />
    </>
  );
}
