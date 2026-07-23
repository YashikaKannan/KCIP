import { create } from "zustand";

export type UserRole =
  | "SCRB Administrator"
  | "State Officer"
  | "District Officer"
  | "Police Station Officer"
  | "Investigation Officer"
  | "Analyst"
  | "Viewer";

interface AppState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  user: { name: string; role: UserRole; district: string };
  setRole: (role: UserRole) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  user: { name: "R. Sharma", role: "SCRB Administrator", district: "Bengaluru Urban" },
  setRole: (role) => set((s) => ({ user: { ...s.user, role } })),
  notificationsOpen: false,
  setNotificationsOpen: (v) => set({ notificationsOpen: v }),
}));
