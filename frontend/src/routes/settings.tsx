import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/store/appStore";
import { useAuditLogs, useDashboardBootstrap } from "@/hooks/api/useKcipQueries";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — KCIP" },
      { name: "description", content: "Application preferences and account settings." },
      { property: "og:title", content: "Settings — KCIP" },
      { property: "og:description", content: "Application preferences and account settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, updateProfile, preferences, updatePreferences } = useAppStore();
  const bootstrap = useDashboardBootstrap();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your KCIP preferences and account"
        breadcrumbs={[{ label: "Home" }, { label: "Settings" }]}
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab user={user} onSave={updateProfile} districts={bootstrap.data?.districts ?? []} />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab prefs={preferences} onUpdate={updatePreferences} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab prefs={preferences} onUpdate={updatePreferences} />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeTab prefs={preferences} onUpdate={updatePreferences} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab prefs={preferences} onUpdate={updatePreferences} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTab />
        </TabsContent>
      </Tabs>
    </>
  );
}

function ProfileTab({ user, onSave, districts }: any) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user);
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-primary-foreground">
          {user.name.split(" ").map((n: string) => n[0]).join("")}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.designation}</div>
          <Badge variant="outline" className="mt-1">{user.role}</Badge>
        </div>
        <div className="ml-auto">
          {!edit ? (
            <Button variant="outline" onClick={() => setEdit(true)}>Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setForm(user); setEdit(false); }}>Cancel</Button>
              <Button onClick={() => { onSave(form); setEdit(false); toast.success("Profile updated"); }}>Save</Button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {["name", "email", "phone", "designation"].map((k) => (
          <div key={k}>
            <Label className="capitalize">{k}</Label>
            <Input value={form[k]} disabled={!edit} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <div>
          <Label>District</Label>
          <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })} disabled={!edit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{districts.map((d: string) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

function PreferencesTab({ prefs, onUpdate }: any) {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label>Language</Label>
          <Select value={prefs.language} onValueChange={(v) => onUpdate({ language: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["English", "Kannada", "Hindi"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date Format</Label>
          <Select value={prefs.dateFormat} onValueChange={(v) => onUpdate({ dateFormat: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Time Format</Label>
          <Select value={prefs.timeFormat} onValueChange={(v) => onUpdate({ timeFormat: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12-hour</SelectItem>
              <SelectItem value="24h">24-hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Density</Label>
          <Select value={prefs.density} onValueChange={(v) => onUpdate({ density: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["compact", "comfortable", "spacious"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Default District</Label>
          <Select value={prefs.defaultDistrict} onValueChange={(v) => onUpdate({ defaultDistrict: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <span className="text-sm">Auto refresh dashboards</span>
          <Switch checked={prefs.autoRefresh} onCheckedChange={(v) => onUpdate({ autoRefresh: v })} />
        </div>
      </div>
      <Button className="mt-4" onClick={() => toast.success("Preferences saved")}>Save Preferences</Button>
    </Card>
  );
}

function SecurityTab({ prefs, onUpdate }: any) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Change Password</h3>
        <div className="space-y-3">
          <div><Label>Current Password</Label><Input type="password" /></div>
          <div><Label>New Password</Label><Input type="password" /></div>
          <div><Label>Confirm New Password</Label><Input type="password" /></div>
          <Button onClick={() => toast.success("Password updated (mock)")}>Update Password</Button>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Account Security</h3>
        <div className="space-y-4">
          <Row label="Two-factor authentication" checked={prefs.twoFactor} onChange={(v) => onUpdate({ twoFactor: v })} />
          <Row label="Remember this device" checked={prefs.rememberDevice} onChange={(v) => onUpdate({ rememberDevice: v })} />
          <div>
            <Label>Session timeout (minutes)</Label>
            <Slider
              value={[prefs.sessionTimeout]}
              min={5}
              max={120}
              step={5}
              onValueChange={([v]) => onUpdate({ sessionTimeout: v })}
            />
            <div className="mt-1 text-xs text-muted-foreground">{prefs.sessionTimeout} minutes</div>
          </div>
        </div>
      </Card>
      <Card className="p-6 lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold">Recent Sessions</h3>
        <div className="space-y-2 text-sm">
          {[
            { device: "Chrome on macOS", loc: "Bengaluru, IN", when: "Active now", current: true },
            { device: "Firefox on Windows", loc: "Mysuru, IN", when: "2 hours ago" },
            { device: "Safari on iPhone", loc: "Bengaluru, IN", when: "Yesterday" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <div className="font-medium">{s.device}</div>
                <div className="text-xs text-muted-foreground">{s.loc} • {s.when}</div>
              </div>
              {s.current ? <Badge>Current</Badge> : <Button variant="ghost" size="sm" onClick={() => toast("Session revoked (mock)")}>Revoke</Button>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ThemeTab({ prefs, onUpdate }: any) {
  const colors = ["#2563EB", "#7C3AED", "#059669", "#DB2777", "#EA580C"];
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <Label>Primary Color</Label>
          <div className="mt-2 flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => onUpdate({ primaryColor: c })}
                className={`h-9 w-9 rounded-full border-2 transition-all ${prefs.primaryColor === c ? "scale-110 border-foreground" : "border-transparent"}`}
                style={{ backgroundColor: c }}
                aria-label={c}
              />
            ))}
          </div>
        </div>
        <div>
          <Label>Card Radius ({prefs.cardRadius}px)</Label>
          <Slider value={[prefs.cardRadius]} min={0} max={20} step={1} onValueChange={([v]) => onUpdate({ cardRadius: v })} />
        </div>
        <div>
          <Label>Base Font Size ({prefs.fontSize}px)</Label>
          <Slider value={[prefs.fontSize]} min={12} max={18} step={1} onValueChange={([v]) => onUpdate({ fontSize: v })} />
        </div>
        <div>
          <Label>Animation Speed</Label>
          <Select value={prefs.animationSpeed} onValueChange={(v) => onUpdate({ animationSpeed: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => toast.success("Theme applied")}>Apply Theme</Button>
      </div>
    </Card>
  );
}

function NotificationsTab({ prefs, onUpdate }: any) {
  const items: Array<[keyof typeof prefs, string]> = [
    ["emailAlerts", "Email alerts"],
    ["pushNotifications", "Push notifications"],
    ["systemAlerts", "System alerts"],
    ["aiAlerts", "AI insights"],
    ["crimeAlerts", "Crime incident alerts"],
    ["weeklyReports", "Weekly digest"],
  ];
  return (
    <Card className="p-6">
      <div className="space-y-4">
        {items.map(([key, label]) => (
          <Row key={key as string} label={label} checked={prefs[key] as boolean} onChange={(v) => onUpdate({ [key]: v })} />
        ))}
      </div>
    </Card>
  );
}

function AuditTab() {
  const { data } = useAuditLogs();
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-sm font-semibold">Recent activity</h3>
      <div className="space-y-2 text-sm">
        {(data ?? []).slice(0, 8).map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <div className="font-medium">{a.action}</div>
              <div className="text-xs text-muted-foreground">{a.user} • {new Date(a.timestamp).toLocaleString()}</div>
            </div>
            <Badge variant="outline" className={
              a.severity === "Critical" ? "border-destructive/40 text-destructive"
              : a.severity === "Warning" ? "border-warning/40 text-warning"
              : ""
            }>
              {a.severity}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border p-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
