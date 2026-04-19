"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";

const EMPLOYEE_NAV = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/checkin",   label: "出勤/退勤" },
  { href: "/history",   label: "履歴" },
];

const ADMIN_NAV = [
  { href: "/admin", label: "管理画面" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return <>{children}</>;

  const nav = user.role === "admin" ? ADMIN_NAV : EMPLOYEE_NAV;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">DA</span>
            </div>
            <nav className="flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                    pathname === item.href
                      ? "bg-gray-900 text-white font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-400">{user.dept}</p>
            </div>
            <Avatar initials={user.avatarInitials} size="sm" />
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="text-center py-4 text-xs text-gray-300">
        Daily Action MVP — Demo Mode
      </footer>
    </div>
  );
}
