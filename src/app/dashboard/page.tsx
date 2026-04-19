"use client";

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/components/useRequireAuth";
import { useRecord } from "@/lib/recordContext";
import { Card, Badge, Button, SectionTitle, Avatar, ProgressBar } from "@/components/ui";
import GoogleCalendarCard from "@/components/GoogleCalendarCard";
import { todayLabel, statusLabel, scoreColor, achievementRate, rateBgBar, rateColor, diffLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useRequireAuth();
  const { record, status } = useRecord();
  const router = useRouter();

  if (!user) return null;

  const sl = statusLabel(status);

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      {/* Header */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials={user.avatarInitials} />
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">{todayLabel()}</p>
          </div>
        </div>
        <Badge label={sl.label} className={sl.cls} />
      </Card>

      {/* Score (done only) */}
      {status === "done" && record?.score != null && (
        <Card className="text-center py-6 animate-slideUp">
          <SectionTitle>本日のスコア</SectionTitle>
          <p className={`text-6xl font-bold ${scoreColor(record.score)}`}>
            {record.score}
            <span className="text-lg text-gray-300 font-normal">/100</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">お疲れ様でした。明日も頑張りましょう！</p>
          <ProgressBar value={record.score} className="mt-4" />
        </Card>
      )}

      {/* Tasks summary */}
      {record && record.tasks.length > 0 ? (
        <Card>
          <SectionTitle>今日の業務と目標</SectionTitle>
          <div className="flex flex-col gap-3">
            {record.tasks.map((task, i) => {
              const rate = achievementRate(task);
              const pct = Math.round(rate * 100);
              const showActual = status === "done";
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{task.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-blue-600 font-medium">目標 {task.targetValue}{task.unit}</span>
                      {showActual && (
                        <>
                          <span className="text-gray-300">→</span>
                          <span className={cn("font-bold", rateColor(rate))}>
                            実績 {task.actualValue}{task.unit}
                          </span>
                          <span className={cn("font-bold", rateColor(rate))}>
                            ({diffLabel(task)})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {showActual && (
                    <>
                      <ProgressBar value={pct} color={rateBgBar(rate)} />
                      {task.note && (
                        <p className="text-xs text-gray-400 pl-7">💬 {task.note}</p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {status === "before" && (
            <Button variant="primary" size="md" className="mt-4 w-full" onClick={() => router.push("/checkin")}>
              業務と目標を入力して出勤する →
            </Button>
          )}
          {status === "working" && (
            <Button variant="danger" size="md" className="mt-4 w-full" onClick={() => router.push("/checkin")}>
              実績を入力して退勤する →
            </Button>
          )}
        </Card>
      ) : (
        <Card>
          <SectionTitle>今日の業務</SectionTitle>
          <p className="text-sm text-gray-400 mb-3">今日の業務目標がまだ設定されていません</p>
          <Button variant="primary" size="md" className="w-full" onClick={() => router.push("/checkin")}>
            業務と目標を入力して出勤する →
          </Button>
        </Card>
      )}

      {/* Checkin info */}
      {(status === "working" || status === "done") && (
        <Card>
          <SectionTitle>勤怠情報</SectionTitle>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-1">出勤</p>
              <p className="font-semibold text-gray-900">{record?.checkinAt ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">退勤</p>
              <p className="font-semibold text-gray-900">{record?.checkoutAt ?? "—"}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Reflection (done only) */}
      {status === "done" && record?.reflection && (
        <Card>
          <SectionTitle>本日の振り返り</SectionTitle>
          <p className="text-sm text-gray-700 leading-relaxed">{record.reflection}</p>
        </Card>
      )}

      {/* Google Calendar */}
      <GoogleCalendarCard compact />
    </div>
  );
}
