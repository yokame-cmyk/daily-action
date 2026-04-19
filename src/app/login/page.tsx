"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { Button, Input, Card } from "@/components/ui";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // already logged in
  if (user) {
    router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await login(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    router.push(email === "admin@example.com" ? "/admin" : "/dashboard");
  }

  function quickLogin(e: string, p: string) {
    setEmail(e);
    setPassword(p);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gray-900 items-center justify-center mb-4">
            <span className="text-white text-2xl">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Action</h1>
          <p className="text-sm text-gray-500 mt-1">行動を記録し、成長を実感する</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="メールアドレス"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="パスワード"
              type="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>
            )}
            <Button variant="primary" size="lg" type="submit" disabled={loading}>
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
        </Card>

        {/* Demo accounts */}
        <div className="mt-4">
          <p className="text-xs text-center text-gray-400 mb-3">デモ用アカウント（クリックで入力）</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "社員：田中 花子", email: "tanaka@example.com" },
              { label: "社員：鈴木 一郎", email: "suzuki@example.com" },
              { label: "社員：佐藤 美咲", email: "sato@example.com" },
              { label: "管理者", email: "admin@example.com" },
            ].map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => quickLogin(u.email, "password")}
                className="text-xs text-left px-3 py-2.5 rounded-xl bg-white border border-gray-100 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all"
              >
                <span className="font-medium block">{u.label}</span>
                <span className="text-gray-400">{u.email}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-gray-300 mt-2">パスワードはすべて: password</p>
        </div>
      </div>
    </div>
  );
}
