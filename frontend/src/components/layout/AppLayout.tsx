import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FileText, Users, UserX, Gavel, ScrollText, Map, Share2,
  Flame, TrendingUp, Brain, FileBarChart, Bell, ShieldCheck, Settings,
  Search, Menu, ChevronsLeft, ChevronsRight, Shield, Plus, FilePlus2, Download,
  RefreshCw, ChevronDown, LogOut, User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAppStore, type UserRole } from "@/store/appStore";
import { useDashboardBootstrap, useDashboardHealth, useDistricts } from "@/hooks/api/useKcipQueries";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };
type NavSection = { label: string; items: readonly NavItem[] };

const sections: readonly NavSection[] = [
  {
    label: "Operations",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/fir", label: "FIR Management", icon: FileText },
      { to: "/victims", label: "Victims", icon: Users },
      { to: "/accused", label: "Accused", icon: UserX },
      { to: "/arrests", label: "Arrests", icon: Gavel },
      { to: "/charge-sheets", label: "Charge Sheets", icon: ScrollText },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/crime-map", label: "Crime Map", icon: Map },
      { to: "/crime-network", label: "Crime Network", icon: Share2 },
      { to: "/hotspots", label: "Crime Hotspots", icon: Flame },
      { to: "/predictions", label: "Predictions", icon: TrendingUp },
      { to: "/ai-intelligence", label: "AI Intelligence", icon: Brain },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/reports", label: "Reports", icon: FileBarChart },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/audit-logs", label: "Audit Logs", icon: ShieldCheck },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const allItems = sections.flatMap((s) => s.items);

const statusColor: Record<string, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  offline: "bg-destructive",
};

const roles: UserRole[] = [
  "SCRB Administrator", "State Officer", "District Officer",
  "Police Station Officer", "Investigation Officer", "Analyst", "Viewer",
];

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, user, setRole, setUser, setFirs, setReports, setNotifications } = useAppStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const now = useNow();
  const [district, setDistrict] = useState(user.district);
  const bootstrapQuery = useDashboardBootstrap();
  const healthQuery = useDashboardHealth();
  const districtsQuery = useDistricts();

  useEffect(() => {
    const bootstrap = bootstrapQuery.data;
    if (!bootstrap) return;
    setUser(bootstrap.user);
    setFirs(bootstrap.recentCases);
    setReports(bootstrap.reports);
    setNotifications(bootstrap.notifications);
    setDistrict(bootstrap.user.district);
  }, [bootstrapQuery.data, setDistrict, setFirs, setNotifications, setReports, setUser]);

  const current = allItems.find((i) => i.to === pathname)
    ?? [...allItems].sort((a, b) => b.to.length - a.to.length)
      .find((i) => i.to !== "/" && pathname.startsWith(i.to));
  const pageTitle = current?.label ?? "Dashboard";

  const healthServices = healthQuery.data ?? [];
  const districts = districtsQuery.data ?? [];
  const offlineCount = healthServices.filter((s) => s.status === "offline").length;
  const warningCount = healthServices.filter((s) => s.status === "warning").length;
  const runtimeState =
    offlineCount > 0 ? { label: "Degraded", color: "bg-destructive" }
    : warningCount > 0 ? { label: "Warnings", color: "bg-warning" }
    : { label: "All systems operational", color: "bg-success" };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2 }}
        className="sticky top-0 h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col"
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm">
            <Shield className="h-4 w-4" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold leading-tight tracking-tight">KCIP</div>
              <div className="truncate text-[10px] text-muted-foreground">Karnataka Crime Intel</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {sections.map((section) => (
            <div key={section.label} className="mb-4">
              {!sidebarCollapsed && (
                <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </div>
              )}
              {sidebarCollapsed && <div className="mx-2 my-2 h-px bg-sidebar-border" />}
              {section.items.map((item) => {
                const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "group relative mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-0.5",
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {active && !sidebarCollapsed && (
                      <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary-foreground/80" />
                    )}
                    <Icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <button
          onClick={toggleSidebar}
          className="m-2 flex items-center justify-center gap-2 rounded-md border border-sidebar-border p-2 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top nav */}
        <header className="sticky top-0 z-30 border-b border-border bg-card">
          <div className="flex h-14 items-center gap-3 px-4">
            <button onClick={toggleSidebar} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Toggle menu">
              <Menu className="h-4 w-4" />
            </button>

            <div className="hidden min-w-0 flex-col md:flex">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Karnataka Crime Intelligence Platform
              </div>
              <div className="truncate text-sm font-semibold leading-tight">{pageTitle}</div>
            </div>

            <div className="relative mx-2 hidden max-w-md flex-1 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search FIRs, suspects, districts..."
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value.trim();
                    toast.success(v ? `Searching for "${v}"…` : "Type to search");
                  }
                }}
              />
            </div>

            <div className="flex-1 md:hidden" />

            {/* District selector */}
            <div className="hidden lg:block">
              <Select value={district} onValueChange={(v) => { setDistrict(v); toast.success(`District: ${v}`); }}>
                <SelectTrigger className="h-9 w-[170px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden gap-1 sm:inline-flex">
                  <Plus className="h-4 w-4" /> Quick Actions <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.success("New FIR draft opened")}>
                  <FilePlus2 className="mr-2 h-4 w-4" /> New FIR
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Refreshing data…")}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Report export queued")}>
                  <Download className="mr-2 h-4 w-4" /> Export report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("AI briefing generated", { description: "3 new insights ready" })}>
                  <Brain className="mr-2 h-4 w-4" /> Generate AI briefing
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Runtime indicator */}
            <div className="hidden items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-[11px] xl:flex" title={runtimeState.label}>
              <span className={cn("h-1.5 w-1.5 rounded-full", runtimeState.color)} />
              <span className="text-muted-foreground">{runtimeState.label}</span>
            </div>

            {/* Date/time */}
            <div className="hidden text-right text-[11px] leading-tight text-muted-foreground xl:block">
              <div>{now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</div>
              <div className="font-mono">{now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>

            {/* Notifications */}
            <button
              className="relative rounded-md p-2 hover:bg-muted"
              onClick={() => toast("3 unread notifications", { description: "Latest: AI alert in Bengaluru Urban" })}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md p-1 pr-2 hover:bg-muted">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs font-semibold">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs font-semibold leading-tight">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground">{user.role}</div>
                  </div>
                  <ChevronDown className="hidden h-3 w-3 opacity-60 sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-[11px] font-normal text-muted-foreground">{user.district}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Switch role
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {roles.map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => { setRole(r); toast.success(`Role switched to ${r}`); }}
                      className={cn(user.role === r && "bg-accent font-semibold")}
                    >
                      {r}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast("Profile — coming soon")}>
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("Signed out (mock)")}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Runtime Health Strip */}
          <div className="flex items-center gap-x-4 gap-y-1 overflow-x-auto border-t border-border bg-muted/30 px-4 py-1.5 text-[11px]">
            <span className="shrink-0 font-semibold text-muted-foreground">Runtime:</span>
            {healthServices.map((s) => (
              <span key={s.name} className="flex shrink-0 items-center gap-1.5" title={`${s.name}: ${s.status}`}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusColor[s.status])} />
                <span className="text-muted-foreground">{s.name}</span>
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="min-w-0 flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
