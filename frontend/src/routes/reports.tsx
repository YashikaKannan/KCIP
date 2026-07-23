import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { reports } from "@/data/mockData";
import { Download, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports — KCIP" },
    { name: "description", content: "Generate and download crime intelligence reports." },
    { property: "og:title", content: "Reports — KCIP" },
    { property: "og:description", content: "Generate and download crime intelligence reports." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Reports" description="Generate, preview, and export analytical reports" breadcrumbs={[{ label: "Home" }, { label: "Reports" }]}
        actions={<Button><FileBarChart className="mr-2 h-4 w-4" />Generate Report</Button>} />
      <DataTable rows={reports} columns={[
        { key: "id", header: "Report ID" },
        { key: "name", header: "Name" },
        { key: "createdOn", header: "Created" },
        { key: "by", header: "By" },
        { key: "size", header: "Size" },
        { key: "actions", header: "", render: () => <Button variant="outline" size="sm"><Download className="mr-2 h-3 w-3" />Download</Button> },
      ]} />
    </>
  ),
});
