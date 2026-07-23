import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Users, UserX, Gavel, ScrollText, Map, Share2,
  Flame, TrendingUp, Brain, FileBarChart, Bell, ShieldCheck, Settings, UserCog,
  Search, Menu, ChevronsLeft, ChevronsRight, Shield,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { healthServices } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fir", label: "FIR Management", icon: FileText },
  { to: "/victims", label: "Victims", icon: Users },
  { to: "/accused", label: "Accused", icon: UserX },
  { to: "/arrests", label: "Arrests", icon: Gavel },
  { to: "/charge-sheets", label: "Charge Sheets", icon: ScrollText },
  { to: "/crime-map", label: "Crime Map", icon: Map },
  { to: "/crime-network", label: "Crime Network", icon: Share2 },
  { to: "/hotspots", label: "Crime Hotspots", icon: Flame },
  { to: "/predictions", label: "Crime Predictions", icon: TrendingUp },
  { to: "/ai-intelligence", label: "AI Intelligence", icon: Brain },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/audit-logs", label: "Audit Logs", icon: ShieldCheck },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/admin", label: "Admin", icon: UserCog },
] as const;

const statusColor: Record<string, string> = {
  healthy: "bg-success",
  warning: "bg-warning",
  offline: "bg-destructive",
};

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, user } = useAppStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        transition={{ duration: 0.2 }}
        className="sticky top-0 h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col"
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold leading-tight">KCIP</div>
              <div className="truncate text-[10px] text-muted-foreground">Karnataka Crime Intel</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {nav.map((item) => {
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={toggleSidebar}
          className="m-2 flex items-center justify-center gap-2 rounded-md border border-sidebar-border p-2 text-xs hover:bg-sidebar-accent"
        >
          {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top nav */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
          <button onClick={toggleSidebar} className="rounded-md p-2 hover:bg-muted lg:hidden">
            <Menu className="h-4 w-4" />
          </button>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search FIRs, suspects, districts..." className="pl-9" />
          </div>
          <div className="flex-1 md:hidden" />
          <div className="text-xs text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </div>
          <button className="relative rounded-md p-2 hover:bg-muted">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-xs font-semibold leading-tight">{user.name}</div>
              <Badge variant="outline" className="mt-0.5 h-4 px-1 text-[10px]">{user.role}</Badge>
            </div>
          </div>
        </header>

        {/* Health strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-card/50 px-4 py-1.5 text-[11px]">
          <span className="font-semibold text-muted-foreground">Runtime:</span>
          {healthServices.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", statusColor[s.status])} />
              <span className="text-muted-foreground">{s.name}</span>
            </span>
          ))}
        </div>

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
