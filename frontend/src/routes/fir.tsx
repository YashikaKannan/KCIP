import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusColors, districts, crimeCategories } from "@/data/mockData";
import { useAppStore, type FIRRecord, type FIRStatus } from "@/store/appStore";
import { Plus, Download, FileSpreadsheet, FileText, FileType2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/fir")({
  head: () => ({
    meta: [
      { title: "FIR Management — KCIP" },
      { name: "description", content: "Manage First Information Reports across Karnataka." },
      { property: "og:title", content: "FIR Management — KCIP" },
      { property: "og:description", content: "Manage First Information Reports across Karnataka." },
    ],
  }),
  component: FIRPage,
});

type FIRForm = {
  id: string;
  title: string;
  category: string;
  district: string;
  station: string;
  officer: string;
  date: string;
  time: string;
  description: string;
  victim: string;
  accused: string;
  evidence: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: FIRStatus;
};

function FIRPage() {
  const firs = useAppStore((s) => s.firs);
  const addFIR = useAppStore((s) => s.addFIR);
  const [openNew, setOpenNew] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = firs.filter(
    (f) =>
      (districtFilter === "all" || f.district === districtFilter) &&
      (categoryFilter === "all" || f.category === categoryFilter) &&
      (statusFilter === "all" || f.status === statusFilter)
  );

  return (
    <>
      <PageHeader
        title="FIR Management"
        description="Search, filter, and track First Information Reports"
        breadcrumbs={[{ label: "Home" }, { label: "FIR" }]}
        actions={
          <>
            <Button variant="outline" onClick={() => setOpenExport(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setOpenNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New FIR
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        <Select value={districtFilter} onValueChange={setDistrictFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="District" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {crimeCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        {(districtFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDistrictFilter("all");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      <DataTable
        rows={filtered}
        searchPlaceholder="Search by FIR ID, title, officer…"
        columns={[
          { key: "id", header: "FIR ID" },
          { key: "title", header: "Title" },
          { key: "district", header: "District" },
          { key: "category", header: "Category" },
          { key: "officer", header: "Officer" },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <Badge variant="outline" className={statusColors[r.status as FIRStatus]}>
                {r.status}
              </Badge>
            ),
          },
          { key: "date", header: "Date" },
        ]}
      />

      <NewFIRDialog open={openNew} onOpenChange={setOpenNew} onSubmit={(data) => {
        addFIR({ ...data });
        toast.success(`FIR ${data.id} created`, { description: data.title });
        setOpenNew(false);
      }} nextId={`FIR-2026-${1024 + firs.length}`} />

      <ExportDialog
        open={openExport}
        onOpenChange={setOpenExport}
        rowCount={filtered.length}
      />
    </>
  );
}

function NewFIRDialog({
  open,
  onOpenChange,
  onSubmit,
  nextId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: FIRRecord) => void;
  nextId: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FIRForm>({
    defaultValues: {
      id: nextId,
      title: "",
      category: "",
      district: "",
      station: "",
      officer: "",
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      description: "",
      victim: "",
      accused: "",
      evidence: "",
      priority: "Medium",
      status: "Open",
    },
  });

  const desc = watch("description") ?? "";

  const submit = handleSubmit(async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(data);
    reset({ ...data, title: "", description: "", victim: "", accused: "", evidence: "" });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register New FIR</DialogTitle>
          <DialogDescription>Fill in the FIR details. All fields marked * are required.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="FIR ID *" error={errors.id?.message}>
              <Input {...register("id", { required: "FIR ID required" })} />
            </Field>
            <Field label="Priority">
              <Select defaultValue="Medium" onValueChange={(v) => setValue("priority", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High", "Critical"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Title *" className="sm:col-span-2" error={errors.title?.message}>
              <Input
                placeholder="Short summary of the incident"
                {...register("title", { required: "Title required", maxLength: 120 })}
              />
            </Field>
            <Field label="Crime Category *" error={errors.category?.message}>
              <Select onValueChange={(v) => setValue("category", v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {crimeCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("category", { required: "Category required" })} />
            </Field>
            <Field label="District *" error={errors.district?.message}>
              <Select onValueChange={(v) => setValue("district", v, { shouldValidate: true })}>
                <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("district", { required: "District required" })} />
            </Field>
            <Field label="Police Station">
              <Input placeholder="e.g. Ashok Nagar PS" {...register("station")} />
            </Field>
            <Field label="Officer In-Charge *" error={errors.officer?.message}>
              <Input placeholder="Insp. R. Kumar" {...register("officer", { required: "Officer required" })} />
            </Field>
            <Field label="Date *">
              <Input type="date" {...register("date", { required: true })} />
            </Field>
            <Field label="Time">
              <Input type="time" {...register("time")} />
            </Field>
            <Field label="Victim">
              <Input placeholder="Full name" {...register("victim", { maxLength: 100 })} />
            </Field>
            <Field label="Accused">
              <Input placeholder="Full name / unknown" {...register("accused", { maxLength: 100 })} />
            </Field>
            <Field label="Description *" className="sm:col-span-2" error={errors.description?.message} hint={`${desc.length}/500`}>
              <Textarea
                rows={3}
                placeholder="Provide incident details…"
                {...register("description", {
                  required: "Description required",
                  maxLength: { value: 500, message: "Max 500 characters" },
                })}
              />
            </Field>
            <Field label="Evidence Notes" className="sm:col-span-2">
              <Textarea rows={2} placeholder="CCTV, witness statements, seized items…" {...register("evidence")} />
            </Field>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => reset()}>Reset</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save FIR"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  error,
  hint,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function ExportDialog({
  open,
  onOpenChange,
  rowCount,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  rowCount: number;
}) {
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const doExport = async () => {
    setBusy(true);
    setProgress(0);
    for (let i = 1; i <= 5; i++) {
      await new Promise((r) => setTimeout(r, 180));
      setProgress(i * 20);
    }
    toast.success(`Exported ${rowCount} FIRs as ${format.toUpperCase()}`, {
      description: "Download simulated — file ready.",
    });
    setBusy(false);
    setProgress(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export FIR Data</DialogTitle>
          <DialogDescription>Export {rowCount} record{rowCount === 1 ? "" : "s"} matching current filters.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "csv", label: "CSV", Icon: FileText },
            { v: "excel", label: "Excel", Icon: FileSpreadsheet },
            { v: "pdf", label: "PDF", Icon: FileType2 },
          ].map(({ v, label, Icon }) => (
            <button
              key={v}
              onClick={() => setFormat(v as any)}
              className={`flex flex-col items-center gap-2 rounded-md border p-4 text-sm transition-colors ${
                format === v ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
        {busy && (
          <div className="h-1.5 w-full overflow-hidden rounded bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button onClick={doExport} disabled={busy}>
            <Download className="mr-2 h-4 w-4" />
            {busy ? "Exporting…" : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
