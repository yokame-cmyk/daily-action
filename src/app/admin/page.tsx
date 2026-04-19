"use client";

import { useState } from "react";
import { useRequireAuth } from "@/components/useRequireAuth";
import { Card, Badge, SectionTitle, Avatar, ProgressBar } from "@/components/ui";
import { MOCK_ADMIN_RECORDS, DEMO_USERS } from "@/lib/demoData";
import { statusLabel, scoreColor, achievementRate, rateBgBar, rateColor, diffLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DailyRecord } from "@/types";

export default function AdminPage() {
  const { user } = useRequireAuth("admin");
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!user) return null;

  const employees = DEMO_USERS.filter((u) => u.role === "employee");
  function getRecord(userId: string): DailyRecord | undefined {
    return MOCK_ADMIN_RECORDS.find((r) => r.userId === userId);
  }

  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
  const totalPresent = MOCK_ADMIN_RECORDS.filter((r) => r.status !== "absent").length;
  const totalWorking = MOCK_ADMIN_RECORDS.filter((r) => r.status === "working").length;
  const totalDone    = MOCK_ADMIN_RECORDS.filter((r) => r.status === "done").length;
  const totalAbsent  = MOCK_ADMIN_RECORDS.filter((r) => r.status === "absent").length;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-900">管理ダッシュボード</h2>
        <p className="text-sm text-gray-400 mt-0.5">{today}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "出勤", value: totalPresent, color: "text-gray-900" },
          { label: "勤務中", value: totalWorking, color: "text-emerald-600" },
          { label: "退勤済", value: totalDone,    color: "text-blue-600" },
          { label: "未出勤", value: totalAbsent,  color: "text-red-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Employee list */}
      <Card>
        <SectionTitle>社員別の状況</SectionTitle>
        <div className="flex flex-col divide-y divide-gray-50">
          {employees.map((emp) => {
            const rec = getRecord(emp.id);
            const sl = statusLabel(rec?.status ?? "absent");
            const isOpen = expanded === emp.id;

            // 全体達成率（退勤済の場合）
            const overallRate = rec && rec.tasks.length > 0
              ? rec.tasks.reduce((sum, t) => sum + achievementRate(t), 0) / rec.tasks.length
              : null;
            const overallPct = overallRate !== null ? Math.round(overallRate * 100) : null;

            return (
              <div key={emp.id}>
                <button
                  className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : emp.id)}
                >
                  <Avatar initials={emp.avatarInitials} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{emp.name}</span>
                      <span className="text-xs text-gray-400">{emp.dept}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {rec?.checkinAt ? `出勤 ${rec.checkinAt}` : "未出勤"}
                      {rec?.checkoutAt ? ` → 退勤 ${rec.checkoutAt}` : ""}
                    </p>
                    {/* タスクプレビュー */}
                    {rec && rec.tasks.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {rec.tasks.map((t) => `${t.category}${t.targetValue}${t.unit}`).join(" / ")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge label={sl.label} className={sl.cls} />
                    {rec?.score != null && (
                      <span className={cn("text-sm font-bold", scoreColor(rec.score))}>{rec.score}点</span>
                    )}
                    {overallPct !== null && rec?.status === "working" && (
                      <span className={cn("text-xs font-bold", rateColor(overallRate ?? 0))}>達成率 {overallPct}%</span>
                    )}
                  </div>
                  <span className="text-gray-300 text-xs ml-1">{isOpen ? "▲" : "▼"}</span>
                </button>

                {/* 展開詳細 */}
                {isOpen && rec && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-2 animate-fadeIn">
                    {/* 業務一覧 */}
                    {rec.tasks.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">業務 目標→実績</p>
                        <div className="flex flex-col gap-3">
                          {rec.tasks.map((task, i) => {
                            const rate = achievementRate(task);
                            const pct = Math.round(rate * 100);
                            const isDone = rec.status === "done";
                            return (
                              <div key={i} className="bg-white rounded-xl p-3 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                    <span className="text-sm font-medium text-gray-800">{task.category}</span>
                                  </div>
                                  {isDone && (
                                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full",
                                      rate >= 1 ? "bg-emerald-100 text-emerald-700" :
                                      rate >= 0.7 ? "bg-amber-100 text-amber-700" :
                                      "bg-red-100 text-red-600"
                                    )}>{pct}%</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <div className="flex items-center gap-1">
                                    <span className="text-blue-500">目標</span>
                                    <span className="font-bold text-blue-700">{task.targetValue}{task.unit}</span>
                                  </div>
                                  {isDone && (
                                    <>
                                      <span className="text-gray-300">→</span>
                                      <div className="flex items-center gap-1">
                                        <span className={cn(rateColor(rate))}>実績</span>
                                        <span className={cn("font-bold", rateColor(rate))}>{task.actualValue}{task.unit}</span>
                                        <span className={cn("font-bold", rateColor(rate))}>({diffLabel(task)})</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                                {isDone && (
                                  <>
                                    <ProgressBar value={pct} color={rateBgBar(rate)} className="mt-2" />
                                    {task.note && (
                                      <p className="text-xs text-gray-400 mt-1.5">💬 {task.note}</p>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 振り返り */}
                    {rec.reflection && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">振り返り</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{rec.reflection}</p>
                      </div>
                    )}

                    {!rec.tasks.length && !rec.reflection && (
                      <p className="text-sm text-gray-400 text-center py-2">まだデータがありません</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <p className="text-xs text-center text-gray-300">
        ※ デモデータを表示しています。Supabase接続後はリアルタイムデータに切り替わります。
      </p>
    </div>
  );
}
