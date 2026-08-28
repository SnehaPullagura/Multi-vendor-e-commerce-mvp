import { create } from "zustand";
import { User, Vendor } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  vendor: Vendor | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User, vendor?: Vendor) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  setUser: (user: User) => void;
  setVendor: (vendor: Vendor) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  vendor: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isLoading: true,
  isAuthenticated: false,

  login: (token: string, user: User, vendor?: Vendor) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (vendor) localStorage.setItem("vendor", JSON.stringify(vendor));
    set({ token, user, vendor: vendor || null, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("vendor");
    set({ token: null, user: null, vendor: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  setVendor: (vendor: Vendor) => {
    localStorage.setItem("vendor", JSON.stringify(vendor));
    set({ vendor });
  },

  fetchProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ user: null, vendor: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const res = await api.get("/users/me");
      if (res.data.success) {
        const user: User = res.data.data;
        let vendor: Vendor | null = null;
        if (user.role === "SELLER") {
          try {
            const vRes = await api.get("/vendors/me");
            if (vRes.data.success) vendor = vRes.data.data;
          } catch {}
        }
        set({ user, vendor, isAuthenticated: true, isLoading: false });
      }
    } catch {
      localStorage.removeItem("token");
      set({ user: null, vendor: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
