"use client";

import { useRequireAuth } from "@/components/useRequireAuth";
import { useRecord } from "@/lib/recordContext";
import { Card, SectionTitle, ProgressBar } from "@/components/ui";
import { MOCK_WEEKLY_SCORES } from "@/lib/demoData";
import { scoreColor, scoreBg, achievementRate, rateBgBar, rateColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { user } = useRequireAuth();
  const { record } = useRecord();

  if (!user) return null;

  const scores = MOCK_WEEKLY_SCORES.map((w) => {
    if (w.label === "今日" && record?.score != null) return { ...w, score: record.score };
    return w;
  });

  const completed = scores.filter((s) => s.score !== null);
  const avg  = completed.length ? Math.round(completed.reduce((sum, s) => sum + (s.score ?? 0), 0) / completed.length) : null;
  const best = completed.length ? Math.max(...completed.map((s) => s.score ?? 0)) : null;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-xl font-bold text-gray-900">履歴・週次スコア</h2>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "今週の平均", value: avg != null ? `${avg}点` : "—", color: avg != null ? scoreColor(avg) : "text-gray-300" },
          { label: "出勤日数", value: `${completed.length}日`, color: "text-gray-900" },
          { label: "最高スコア", value: best != null ? `${best}点` : "—", color: best != null ? scoreColor(best) : "text-gray-300" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <SectionTitle>今週のスコア推移</SectionTitle>
        <div className="flex items-end gap-2 h-28 pt-4">
          {scores.map((s) => {
            const pct = s.score != null ? (s.score / 100) * 100 : 0;
            const barColor = s.score == null ? "bg-gray-100" : s.score >= 80 ? "bg-emerald-500" : s.score >= 60 ? "bg-amber-400" : "bg-red-400";
            const isToday  = s.label === "今日";
            return (
              <div key={s.date} className="flex-1 flex flex-col items-center gap-1">
                <span className={cn("text-xs font-medium", s.score != null ? scoreColor(s.score) : "text-gray-300")}>
                  {s.score != null ? s.score : "—"}
                </span>
                <div className="w-full flex flex-col justify-end" style={{ height: "72px" }}>
                  <div
                    className={cn("w-full rounded-t-lg transition-all duration-700", barColor, isToday && "ring-2 ring-offset-1 ring-gray-300")}
                    style={{ height: `${Math.max(pct, s.score != null ? 4 : 0)}%` }}
                  />
                </div>
                <span className={cn("text-xs", isToday ? "font-bold text-gray-900" : "text-gray-400")}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Daily log */}
      <Card>
        <SectionTitle>日別ログ</SectionTitle>
        <div className="flex flex-col divide-y divide-gray-50">
          {scores.filter((s) => s.score != null).slice().reverse().map((s) => (
            <div key={s.date} className="py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700">{s.date}（{s.label}）</span>
                <span className={cn("text-sm font-bold", scoreColor(s.score))}>{s.score}点</span>
              </div>
              <ProgressBar value={s.score ?? 0} color={
                (s.score ?? 0) >= 80 ? "bg-emerald-500" : (s.score ?? 0) >= 60 ? "bg-amber-400" : "bg-red-400"
              } />
            </div>
          ))}
          {completed.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">まだ記録がありません</p>
          )}
        </div>
      </Card>

      {/* Today's task result (if done) */}
      {record?.status === "done" && record.tasks.length > 0 && (
        <Card>
          <SectionTitle>本日の業務実績</SectionTitle>
          <div className="flex flex-col gap-3">
            {record.tasks.map((task, i) => {
              const rate = achievementRate(task);
              const pct = Math.round(rate * 100);
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-medium">{task.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-blue-600">目標 {task.targetValue}{task.unit}</span>
                      <span className="text-gray-300">→</span>
                      <span className={cn("font-bold", rateColor(rate))}>実績 {task.actualValue}{task.unit}</span>
                      <span className={cn("font-bold px-1.5 py-0.5 rounded-md",
                        rate >= 1 ? "bg-emerald-100 text-emerald-700" :
                        rate >= 0.7 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-600"
                      )}>{pct}%</span>
                    </div>
                  </div>
                  <ProgressBar value={pct} color={rateBgBar(rate)} />
                  {task.note && <p className="text-xs text-gray-400 pl-7">💬 {task.note}</p>}
                </div>
              );
            })}
          </div>
          {record.reflection && (
            <div className="mt-4 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 mb-1">振り返り</p>
              <p className="text-sm text-gray-700 leading-relaxed">{record.reflection}</p>
            </div>
          )}
        </Card>
      )}

      {/* Score explanation */}
      <Card className="bg-gray-50 border-gray-100">
        <SectionTitle>スコアの計算方法</SectionTitle>
        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>業務達成率（目標に対する実績の平均）</span>
            <span className="font-medium text-gray-700">最大70点</span>
          </div>
          <div className="flex justify-between">
            <span>全体振り返りの記入（10文字以上）</span>
            <span className="font-medium text-gray-700">20点</span>
          </div>
          <div className="flex justify-between">
            <span>全業務に一言コメント記入</span>
            <span className="font-medium text-gray-700">10点</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
