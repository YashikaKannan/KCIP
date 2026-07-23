import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "Settings — KCIP" },
    { name: "description", content: "Application preferences and account settings." },
    { property: "og:title", content: "Settings — KCIP" },
    { property: "og:description", content: "Application preferences and account settings." },
  ]}),
  component: () => (
    <>
      <PageHeader title="Settings" description="Manage your KCIP preferences" breadcrumbs={[{ label: "Home" }, { label: "Settings" }]} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Profile</h3>
          <div className="space-y-3">
            <div><Label>Full Name</Label><Input defaultValue="R. Sharma" /></div>
            <div><Label>Email</Label><Input defaultValue="r.sharma@ksp.gov.in" /></div>
            <div><Label>District</Label><Input defaultValue="Bengaluru Urban" /></div>
          </div>
          <Button className="mt-4">Save Changes</Button>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-sm">Email alerts</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span className="text-sm">Push notifications</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span className="text-sm">Weekly AI digest</span><Switch /></div>
            <div className="flex items-center justify-between"><span className="text-sm">Two-factor authentication</span><Switch defaultChecked /></div>
          </div>
        </Card>
      </div>
    </>
  ),
});
