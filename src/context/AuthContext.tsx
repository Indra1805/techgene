"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthContextType = {
  loggedIn: boolean | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  // ---------------- CHECK AUTH ----------------
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/me", { method: "GET", credentials: "include", cache: "no-store" });
      const data = await res.json();
      setLoggedIn(data.loggedIn);
    } catch {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ---------------- LOGIN ----------------
  const login = async () => {
    await checkAuth();
  };

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    try {
      const csrfToken = getCsrfTokenFromCookie();
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

// ---------------- HELPER ----------------
function getCsrfTokenFromCookie(): string {
  const match = document.cookie.match(new RegExp('(^| )csrf-token=([^;]+)'));
  return match ? match[2] : '';
}
