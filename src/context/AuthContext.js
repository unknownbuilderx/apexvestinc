"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount — rehydrate from localStorage first, then verify with server
  useEffect(() => {
    const token = localStorage.getItem("gv_token");
    const cached = localStorage.getItem("gv_user");

    if (!token) {
      setLoading(false);
      return;
    }

    // Immediately restore from cache so the page renders without flashing
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (_) {}
    }

    // Then verify with server in the background
    authAPI
      .me()
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("gv_user", JSON.stringify(data.user));
      })
      .catch((err) => {
        // Only clear token on explicit 401 Unauthorized
        // Don't clear on network errors or server 503 (DB cold start etc.)
        const is401 =
          err.message?.includes("401") ||
          err.message?.toLowerCase().includes("not authorised") ||
          err.message?.toLowerCase().includes("invalid") ||
          err.message?.toLowerCase().includes("expired") ||
          err.message?.toLowerCase().includes("no longer exists");

        if (is401) {
          localStorage.removeItem("gv_token");
          localStorage.removeItem("gv_user");
          setUser(null);
        }
        // Otherwise keep the cached user — server may be cold-starting
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await authAPI.login({ email, password });
      localStorage.setItem("gv_token", data.token);
      localStorage.setItem("gv_user", JSON.stringify(data.user));
      setUser(data.user);
      // Only redirect if not already on the correct page
      if (typeof window !== "undefined") {
        const current = window.location.pathname;
        if (data.user.role === "admin" && current !== "/admin") {
          router.push("/admin");
        } else if (data.user.role !== "admin" && current !== "/dashboard") {
          router.push("/dashboard");
        }
        // If already on the right page, just let the state update re-render the page
      }
      return data.user;
    },
    [router],
  );

  const register = useCallback(
    async (payload) => {
      const data = await authAPI.register(payload);
      localStorage.setItem("gv_token", data.token);
      localStorage.setItem("gv_user", JSON.stringify(data.user));
      setUser(data.user);
      router.push("/dashboard");
      return data.user;
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (_) {}
    localStorage.removeItem("gv_token");
    localStorage.removeItem("gv_user");
    setUser(null);
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("gv_user", JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// Soft guard — shows loading spinner, does NOT redirect
// Use this on pages that need auth but shouldn't hard-redirect (admin, dashboard)
export function useRequireAuth(adminOnly = false) {
  const { user, loading } = useAuth();
  return { user, loading };
}
