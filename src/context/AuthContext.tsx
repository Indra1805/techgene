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

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        cache: "no-store",
        credentials: "include", // ✅ include cookies on production
      });

      const data = await res.json();
      setLoggedIn(data.loggedIn);
    } catch (err) {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async () => {
    // After login success, re-check auth state
    await checkAuth();
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // ✅ include cookies
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
