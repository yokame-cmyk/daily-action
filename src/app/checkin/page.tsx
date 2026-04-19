"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/components/useRequireAuth";
import { useRecord } from "@/lib/recordContext";
import { Card, Button, Textarea, SectionTitle, Badge, NumberInput, ProgressBar } from "@/components/ui";
import GoogleCalendarCard from "@/components/GoogleCalendarCard";
import { TASK_CATEGORIES, TASK_UNITS, TaskItem, TaskCategory } from "@/types";
import { cn, achievementRate, rateBgBar, rateColor, diffLabel } from "@/lib/utils";

// ────────────────────────────────────────────────────────────
// 業務選択コンポーネント
// ────────────────────────────────────────────────────────────
function TaskSelector({
  index,
  task,
  selectedCategories,
  onChange,
  onRemove,
}: {
  index: number;
  task: TaskItem;
  selectedCategories: TaskCategory[];
  onChange: (t: TaskItem) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          ✕ 削除
        </button>
      </div>

      {/* 業務カテゴリ選択 */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-2">業務を選択</p>
        <div className="flex flex-wrap gap-1.5">
          {TASK_CATEGORIES.map((cat) => {
            const isSelected = task.category === cat;
            const isDisabled = !isSelected && selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                disabled={isDisabled}
                onClick={() => onChange({ ...task, category: cat })}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                  isSelected
                    ? "bg-gray-900 text-white"
                    : isDisabled
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 目標数値 + 単位 */}
      <div className="flex items-end gap-4 flex-wrap">
        <NumberInput
          label="目標"
          value={task.targetValue}
          unit={task.unit}
          onChange={(v) => onChange({ ...task, targetValue: v })}
          highlight="target"
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">単位</label>
          <select
            value={task.unit}
            onChange={(e) => onChange({ ...task, unit: e.target.value })}
            className="h-7 px-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {TASK_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 退勤：目標vs実績 カード
// ────────────────────────────────────────────────────────────
function TaskResultCard({
  index,
  task,
  onChange,
}: {
  index: number;
  task: TaskItem;
  onChange: (t: TaskItem) => void;
}) {
  const rate = achievementRate(task);
  const pct = Math.round(rate * 100);
  const diff = task.actualValue - task.targetValue;

  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-white">
      {/* タスク名 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-gray-900">{task.category}</span>
        <span className={cn("ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
          rate >= 1 ? "bg-emerald-100 text-emerald-700" :
          rate >= 0.7 ? "bg-amber-100 text-amber-700" :
          "bg-red-100 text-red-600"
        )}>
          {pct}%
        </span>
      </div>

      {/* 目標 vs 実績 */}
      <div className="flex items-center gap-4 mb-3">
        {/* 目標 */}
        <div className="flex-1 text-center bg-blue-50 rounded-xl py-2.5 px-3">
          <p className="text-xs text-blue-500 font-medium mb-0.5">目標</p>
          <p className="text-xl font-bold text-blue-700">{task.targetValue}<span className="text-xs font-normal ml-0.5">{task.unit}</span></p>
        </div>

        {/* 矢印 + diff */}
        <div className="flex flex-col items-center">
          <span className={cn("text-xs font-bold", rateColor(rate))}>
            {diff > 0 ? `+${diff}` : diff === 0 ? "±0" : diff}{task.unit}
          </span>
          <span className="text-gray-300 text-lg">→</span>
        </div>

        {/* 実績入力 */}
        <div className="flex-1 text-center bg-emerald-50 rounded-xl py-2 px-3">
          <p className="text-xs text-emerald-600 font-medium mb-0.5">実績</p>
          <NumberInput
            label=""
            value={task.actualValue}
            unit={task.unit}
            onChange={(v) => onChange({ ...task, actualValue: v })}
            highlight="actual"
          />
        </div>
      </div>

      {/* 達成バー */}
      <ProgressBar value={pct} color={rateBgBar(rate)} className="mb-3" />

      {/* 一言振り返り */}
      <input
        type="text"
        value={task.note}
        onChange={(e) => onChange({ ...task, note: e.target.value })}
        placeholder="一言振り返り（任意）"
        className="w-full h-9 px-3 text-xs rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// メインページ
// ────────────────────────────────────────────────────────────
export default function CheckinPage() {
  const { user } = useRequireAuth();
  const { record, status, checkin, checkout } = useRecord();
  const router = useRouter();

  // --- 出勤フォーム state ---
  const [tasks, setTasks] = useState<TaskItem[]>(
    record?.tasks?.length
      ? record.tasks
      : [{ category: "架電", targetValue: 10, unit: "件", actualValue: 0, note: "" }]
  );
  const [checkinErr, setCheckinErr] = useState("");

  // --- 退勤フォーム state ---
  const [checkoutTasks, setCheckoutTasks] = useState<TaskItem[]>(record?.tasks ?? []);
  const [reflection, setReflection] = useState(record?.reflection ?? "");
  const [checkoutErr, setCheckoutErr] = useState("");

  // recordが変わったとき(ログイン直後)に同期
  useEffect(() => {
    if (record?.tasks?.length) {
      setCheckoutTasks(record.tasks.map((t) => ({ ...t })));
      setReflection(record.reflection ?? "");
    }
  }, [record]);

  if (!user) return null;

  const selectedCategories = tasks.map((t) => t.category);

  // ── 提出済み ──────────────────────────
  if (status === "done") {
    return (
      <div className="flex flex-col gap-4 animate-fadeIn">
        <Card className="text-center py-10">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-lg font-semibold text-gray-900">本日の日報を提出済みです</p>
          <p className="text-sm text-gray-400 mt-1">お疲れ様でした！</p>
          <Button variant="secondary" size="md" className="mt-5" onClick={() => router.push("/history")}>
            履歴を確認する
          </Button>
        </Card>
        <GoogleCalendarCard compact />
      </div>
    );
  }

  // ── 出勤前：出勤フォーム ──────────────
  if (status === "before") {
    const addTask = () => {
      if (tasks.length >= 3) return;
      const remaining = TASK_CATEGORIES.filter((c) => !selectedCategories.includes(c));
      if (remaining.length === 0) return;
      setTasks([...tasks, { category: remaining[0], targetValue: 5, unit: "件", actualValue: 0, note: "" }]);
    };

    const updateTask = (i: number, t: TaskItem) => {
      const next = [...tasks];
      next[i] = t;
      setTasks(next);
    };

    const removeTask = (i: number) => {
      setTasks(tasks.filter((_, idx) => idx !== i));
    };

    const handleCheckin = (e: React.FormEvent) => {
      e.preventDefault();
      if (tasks.length === 0) { setCheckinErr("業務を1つ以上選択してください"); return; }
      if (tasks.some((t) => t.targetValue <= 0)) { setCheckinErr("目標値は1以上にしてください"); return; }
      checkin(tasks);
      router.push("/dashboard");
    };

    return (
      <div className="flex flex-col gap-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">出勤する</h2>
          <Badge label="未出勤" className="bg-gray-100 text-gray-500" />
        </div>

        {/* カレンダー */}
        <GoogleCalendarCard compact />

        {/* 業務設定 */}
        <form onSubmit={handleCheckin} className="flex flex-col gap-4">
          <Card>
            <SectionTitle>今日の業務と目標を設定（最大3つ）</SectionTitle>
            <p className="text-xs text-gray-400 mb-4">
              今日取り組む業務を選び、数値目標を入力してください
            </p>
            <div className="flex flex-col gap-3">
              {tasks.map((task, i) => (
                <TaskSelector
                  key={i}
                  index={i}
                  task={task}
                  selectedCategories={selectedCategories.filter((_, idx) => idx !== i)}
                  onChange={(t) => updateTask(i, t)}
                  onRemove={() => removeTask(i)}
                />
              ))}
            </div>

            {tasks.length < 3 && (
              <button
                type="button"
                onClick={addTask}
                className="mt-3 w-full h-10 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors"
              >
                + 業務を追加（{tasks.length}/3）
              </button>
            )}

            {checkinErr && <p className="text-xs text-red-500 mt-2">{checkinErr}</p>}
          </Card>

          <Button type="submit" variant="success" size="lg">
            カレンダーを確認して出勤する ✓
          </Button>
        </form>
      </div>
    );
  }

  // ── 勤務中：退勤フォーム ──────────────
  const updateCheckoutTask = (i: number, t: TaskItem) => {
    const next = [...checkoutTasks];
    next[i] = t;
    setCheckoutTasks(next);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutTasks.some((t) => t.actualValue < 0)) {
      setCheckoutErr("実績値は0以上にしてください");
      return;
    }
    checkout({ tasks: checkoutTasks, reflection });
    router.push("/dashboard");
  };

  // 全体達成率
  const overallRate = checkoutTasks.length > 0
    ? checkoutTasks.reduce((sum, t) => sum + achievementRate(t), 0) / checkoutTasks.length
    : 0;
  const overallPct = Math.round(overallRate * 100);

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">退勤する</h2>
        <Badge label="勤務中" className="bg-emerald-100 text-emerald-700" />
      </div>

      {/* 出勤時刻 + 全体達成率プレビュー */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">出勤時刻</p>
          <p className="text-2xl font-bold text-gray-900">{record?.checkinAt ?? "—"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400 mb-1">現在の達成率</p>
          <p className={cn("text-2xl font-bold", rateColor(overallRate))}>
            {overallPct}<span className="text-xs font-normal text-gray-400">%</span>
          </p>
          <ProgressBar value={overallPct} color={rateBgBar(overallRate)} className="mt-1.5" />
        </Card>
      </div>

      {/* カレンダー */}
      <GoogleCalendarCard compact />

      {/* 目標 vs 実績入力 */}
      <form onSubmit={handleCheckout} className="flex flex-col gap-4">
        <Card>
          <SectionTitle>目標 → 実績を入力</SectionTitle>
          <p className="text-xs text-gray-400 mb-4">各業務の実績を入力し、一言振り返りを記録してください</p>
          <div className="flex flex-col gap-3">
            {checkoutTasks.map((task, i) => (
              <TaskResultCard
                key={i}
                index={i}
                task={task}
                onChange={(t) => updateCheckoutTask(i, t)}
              />
            ))}
          </div>
        </Card>

        {/* 全体振り返り */}
        <Card>
          <SectionTitle>本日の全体振り返り</SectionTitle>
          <Textarea
            placeholder="今日の取り組みを振り返って… うまくいったこと、課題、気づきなど"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
          />
          {checkoutErr && <p className="text-xs text-red-500 mt-2">{checkoutErr}</p>}
        </Card>

        <Button type="submit" variant="danger" size="lg">
          退勤する・日報を提出 →
        </Button>
      </form>
    </div>
  );
}
