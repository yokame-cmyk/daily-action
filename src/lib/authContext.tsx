"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { DEMO_USERS, DEMO_CREDENTIALS } from "@/lib/demoData";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("daily_action_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const expected = DEMO_CREDENTIALS[email];
    if (!expected || expected !== password) {
      return { error: "メールアドレスまたはパスワードが違います" };
    }
    const found = DEMO_USERS.find((u) => u.email === email);
    if (!found) return { error: "ユーザーが見つかりません" };
    localStorage.setItem("daily_action_user", JSON.stringify(found));
    setUser(found);
    return { error: null };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("daily_action_user");
    localStorage.removeItem("daily_action_record");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
