import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const users = [
  { id: "U1", name: "R. Sharma", role: "SCRB Administrator", district: "Bengaluru Urban", status: "Active" },
  { id: "U2", name: "M. Rao", role: "State Officer", district: "Statewide", status: "Active" },
  { id: "U3", name: "A. Kumar", role: "District Officer", district: "Mysuru", status: "Active" },
  { id: "U4", name: "S. Naik", role: "Investigation Officer", district: "Mangaluru", status: "Suspended" },
  { id: "U5", name: "D. Pai", role: "Analyst", district: "Statewide", status: "Active" },
  { id: "U6", name: "V. Iyer", role: "Viewer", district: "Hubballi", status: "Active" },
];

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin — KCIP" },
    { name: "description", content: "Administer users, roles, and system configuration." },
    { property: "og:title", content: "Admin — KCIP" },
    { property: "og:description", content: "Administer users, roles, and system configuration." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Admin" description="Users, roles, and system configuration"
        breadcrumbs={[{ label: "Home" }, { label: "Admin" }]}
        actions={<Button><Plus className="mr-2 h-4 w-4" />Add User</Button>} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5"><div className="text-xs text-muted-foreground">Total Users</div><div className="mt-2 text-3xl font-bold">248</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Active Roles</div><div className="mt-2 text-3xl font-bold">7</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Districts Onboarded</div><div className="mt-2 text-3xl font-bold">30</div></Card>
      </div>

      <DataTable rows={users} columns={[
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
        { key: "district", header: "District" },
        { key: "status", header: "Status", render: (r) => <Badge variant="outline">{r.status}</Badge> },
      ]} />
    </>
  ),
});
