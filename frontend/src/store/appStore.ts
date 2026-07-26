import { create } from "zustand";
import {
  firs as seedFirs,
  reports as seedReports,
  notifications as seedNotifications,
} from "@/data/mockData";

export type UserRole =
  | "SCRB Administrator"
  | "State Officer"
  | "District Officer"
  | "Police Station Officer"
  | "Investigation Officer"
  | "Analyst"
  | "Viewer";

export type FIRStatus = "Open" | "Under Investigation" | "Closed" | "Pending";

export interface FIRRecord {
  id: string;
  title: string;
  district: string;
  category: string;
  status: FIRStatus;
  date: string;
  officer: string;
  station?: string;
  time?: string;
  description?: string;
  victim?: string;
  accused?: string;
  evidence?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
}

export interface ReportRecord {
  id: string;
  name: string;
  createdOn: string;
  by: string;
  size: string;
  status?: "Ready" | "Generating" | "Failed";
  type?: string;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  read: boolean;
  archived?: boolean;
}

export interface Preferences {
  language: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  density: "compact" | "comfortable" | "spacious";
  autoRefresh: boolean;
  defaultDistrict: string;
  emailAlerts: boolean;
  pushNotifications: boolean;
  systemAlerts: boolean;
  aiAlerts: boolean;
  crimeAlerts: boolean;
  weeklyReports: boolean;
  twoFactor: boolean;
  rememberDevice: boolean;
  sessionTimeout: number;
  primaryColor: string;
  cardRadius: number;
  fontSize: number;
  animationSpeed: "off" | "normal" | "fast";
}

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  user: {
    name: string;
    role: UserRole;
    district: string;
    email: string;
    phone: string;
    designation: string;
  };
  setRole: (role: UserRole) => void;
  updateProfile: (patch: Partial<AppState["user"]>) => void;

  firs: FIRRecord[];
  addFIR: (fir: FIRRecord) => void;

  reports: ReportRecord[];
  addReport: (r: ReportRecord) => void;

  notifications: NotificationRecord[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;

  preferences: Preferences;
  updatePreferences: (patch: Partial<Preferences>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  user: {
    name: "R. Sharma",
    role: "SCRB Administrator",
    district: "Bengaluru Urban",
    email: "r.sharma@ksp.gov.in",
    phone: "+91 98450 12345",
    designation: "Deputy Inspector General",
  },
  setRole: (role) => set((s) => ({ user: { ...s.user, role } })),
  updateProfile: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),

  firs: seedFirs as FIRRecord[],
  addFIR: (fir) => set((s) => ({ firs: [fir, ...s.firs] })),

  reports: seedReports as ReportRecord[],
  addReport: (r) => set((s) => ({ reports: [r, ...s.reports] })),

  notifications: seedNotifications as NotificationRecord[],
  markRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  deleteNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  archiveNotification: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, archived: true } : n)) })),

  preferences: {
    language: "English",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    density: "comfortable",
    autoRefresh: true,
    defaultDistrict: "Bengaluru Urban",
    emailAlerts: true,
    pushNotifications: true,
    systemAlerts: true,
    aiAlerts: true,
    crimeAlerts: true,
    weeklyReports: false,
    twoFactor: true,
    rememberDevice: true,
    sessionTimeout: 30,
    primaryColor: "#2563EB",
    cardRadius: 10,
    fontSize: 14,
    animationSpeed: "normal",
  },
  updatePreferences: (patch) => set((s) => ({ preferences: { ...s.preferences, ...patch } })),
}));
