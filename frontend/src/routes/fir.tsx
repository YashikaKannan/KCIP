import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { firs, statusColors, districts, crimeCategories } from "@/data/mockData";
import { Plus, Filter, Download } from "lucide-react";

export const Route = createFileRoute("/fir")({
  head: () => ({ meta: [
    { title: "FIR Management — KCIP" },
    { name: "description", content: "Manage First Information Reports across Karnataka." },
    { property: "og:title", content: "FIR Management — KCIP" },
    { property: "og:description", content: "Manage First Information Reports across Karnataka." },
  ]}),
  component: FIRPage,
});

function FIRPage() {
  return (
    <>
      <PageHeader
        title="FIR Management"
        description="Search, filter, and track First Information Reports"
        breadcrumbs={[{ label: "Home" }, { label: "FIR" }]}
        actions={<>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button><Plus className="mr-2 h-4 w-4" />New FIR</Button>
        </>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by FIR ID or title..." className="max-w-xs" />
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="District" /></SelectTrigger>
          <SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
        </Select>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>{crimeCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        rows={firs}
        columns={[
          { key: "id", header: "FIR ID" },
          { key: "title", header: "Title" },
          { key: "district", header: "District" },
          { key: "category", header: "Category" },
          { key: "officer", header: "Officer" },
          { key: "status", header: "Status", render: (r) => <Badge variant="outline" className={statusColors[r.status]}>{r.status}</Badge> },
          { key: "date", header: "Date" },
        ]}
      />
    </>
  );
}
