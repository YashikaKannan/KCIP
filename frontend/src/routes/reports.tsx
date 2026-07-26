import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileBarChart } from "lucide-react";
import { useAppStore, type ReportRecord } from "@/store/appStore";
import { useDashboardBootstrap } from "@/hooks/api/useKcipQueries";

const REPORT_TYPES = [
  "Crime Summary",
  "Hotspot Report",
  "Prediction Report",
  "District Analysis",
  "Monthly Report",
  "Network Analysis",
];

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — KCIP" },
      { name: "description", content: "Generate and download crime intelligence reports." },
      { property: "og:title", content: "Reports — KCIP" },
      { property: "og:description", content: "Generate and download crime intelligence reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const bootstrap = useDashboardBootstrap();
  const reports = useAppStore((s) => s.reports);
  const addReport = useAppStore((s) => s.addReport);
  const user = useAppStore((s) => s.user);
  const [openGen, setOpenGen] = useState(false);
  const [downloadFor, setDownloadFor] = useState<ReportRecord | null>(null);

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate, preview, and export analytical reports"
        breadcrumbs={[{ label: "Home" }, { label: "Reports" }]}
        actions={
          <Button onClick={() => setOpenGen(true)}>
            <FileBarChart className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        }
      />

      <DataTable
        rows={reports}
        searchPlaceholder="Search reports…"
        columns={[
          { key: "id", header: "Report ID" },
          { key: "name", header: "Name" },
          { key: "createdOn", header: "Created" },
          { key: "by", header: "By" },
          { key: "size", header: "Size" },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <Badge variant="outline" className={
                r.status === "Generating" ? "bg-warning/15 text-warning border-warning/30"
                : r.status === "Failed" ? "bg-destructive/15 text-destructive border-destructive/30"
                : "bg-success/15 text-success border-success/30"
              }>
                {r.status ?? "Ready"}
              </Badge>
            ),
          },
          {
            key: "actions",
            header: "",
            sortable: false,
            render: (r) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDownloadFor(r)}
                disabled={r.status === "Generating"}
              >
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            ),
          },
        ]}
      />

      <GenerateDialog
        open={openGen}
        onOpenChange={setOpenGen}
        onCreate={(rep) => {
          addReport(rep);
          toast.success(`Report "${rep.name}" generated`, { description: `${rep.size} • ${rep.type}` });
          setOpenGen(false);
        }}
        author={user.name}
        nextId={`RPT-${reports.length + 1}`}
      />

      <DownloadDialog report={downloadFor} onClose={() => setDownloadFor(null)} />
    </>
  );
}

function GenerateDialog({
  open,
  onOpenChange,
  onCreate,
  author,
  nextId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (r: ReportRecord) => void;
  author: string;
  nextId: string;
}) {
  const bootstrap = useDashboardBootstrap();
  const [type, setType] = useState<string>(REPORT_TYPES[0]);
  const [district, setDistrict] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [officer, setOfficer] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [step, setStep] = useState<"idle" | "preparing" | "compiling" | "done">("idle");

  const runGenerate = async () => {
    setStep("preparing");
    await new Promise((r) => setTimeout(r, 500));
    setStep("compiling");
    await new Promise((r) => setTimeout(r, 700));
    setStep("done");
    onCreate({
      id: nextId,
      name: `${type}${district !== "all" ? ` — ${district}` : ""}`,
      createdOn: new Date().toISOString().slice(0, 10),
      by: author,
      size: `${(1 + Math.random() * 4).toFixed(1)} MB`,
      status: "Ready",
      type,
    });
    setStep("idle");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>Configure filters and create a new analytical report.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="mb-1 block text-xs">Report Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">District</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {(bootstrap.data?.districts ?? []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set((bootstrap.data?.recentCases ?? []).map((item) => item.category))).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block text-xs">From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block text-xs">To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1 block text-xs">Officer (optional)</Label>
            <Input value={officer} onChange={(e) => setOfficer(e.target.value)} placeholder="Search by officer name" />
          </div>
        </div>

        <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
          <div className="mb-1 font-semibold text-foreground">Preview</div>
          <div className="text-muted-foreground">
            {type}{district !== "all" && ` • ${district}`}{category !== "all" && ` • ${category}`}
            {from && to && ` • ${from} → ${to}`}{officer && ` • Officer: ${officer}`}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={step !== "idle"}>Cancel</Button>
          <Button onClick={runGenerate} disabled={step !== "idle"}>
            {step === "idle" ? "Generate" : step === "preparing" ? "Preparing…" : "Compiling…"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DownloadDialog({ report, onClose }: { report: ReportRecord | null; onClose: () => void }) {
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [phase, setPhase] = useState<"idle" | "prepare" | "download" | "done">("idle");

  const run = async () => {
    setPhase("prepare");
    await new Promise((r) => setTimeout(r, 500));
    setPhase("download");
    await new Promise((r) => setTimeout(r, 700));
    setPhase("done");
    toast.success(`Downloaded ${report?.id} as ${format.toUpperCase()}`);
    setTimeout(() => { setPhase("idle"); onClose(); }, 400);
  };

  return (
    <Dialog open={!!report} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Report</DialogTitle>
          <DialogDescription>{report?.name}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2">
          {(["pdf", "excel", "csv"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`rounded-md border p-3 text-sm uppercase transition-colors ${
                format === f ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          {phase === "idle" && "Choose a format and download."}
          {phase === "prepare" && "Preparing report…"}
          {phase === "download" && "Downloading…"}
          {phase === "done" && "Completed."}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={phase !== "idle"}>Cancel</Button>
          <Button onClick={run} disabled={phase !== "idle"}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
