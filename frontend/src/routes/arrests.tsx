import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { arrests } from "@/data/mockData";

export const Route = createFileRoute("/arrests")({
  head: () => ({ meta: [
    { title: "Arrests — KCIP" },
    { name: "description", content: "Recent arrests across districts." },
    { property: "og:title", content: "Arrests — KCIP" },
    { property: "og:description", content: "Recent arrests across districts." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Arrests" description="Records of arrests linked to FIRs" breadcrumbs={[{ label: "Home" }, { label: "Arrests" }]} />
      <DataTable rows={arrests} columns={[
        { key: "id", header: "Arrest ID" },
        { key: "accused", header: "Accused" },
        { key: "fir", header: "FIR" },
        { key: "date", header: "Date" },
        { key: "officer", header: "Officer" },
        { key: "district", header: "District" },
      ]} />
    </>
  ),
});
