"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export function useRequireAuth(role?: "employee" | "admin") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (role && user.role !== role) { router.replace("/dashboard"); }
  }, [user, loading, role, router]);

  return { user, loading };
}
