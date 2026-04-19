import { User, DailyRecord, WeeklyScore, TaskItem } from "@/types";

export const DEMO_USERS: User[] = [
  { id: "user-1", name: "田中 花子", email: "tanaka@example.com", role: "employee", dept: "営業部", avatarInitials: "田花" },
  { id: "user-2", name: "鈴木 一郎", email: "suzuki@example.com", role: "employee", dept: "開発部", avatarInitials: "鈴一" },
  { id: "user-3", name: "佐藤 美咲", email: "sato@example.com",   role: "employee", dept: "マーケ部", avatarInitials: "佐美" },
  { id: "admin-1", name: "山田 管理者", email: "admin@example.com", role: "admin", dept: "管理部", avatarInitials: "管理" },
];

export const DEMO_CREDENTIALS: Record<string, string> = {
  "tanaka@example.com": "password",
  "suzuki@example.com": "password",
  "sato@example.com": "password",
  "admin@example.com": "password",
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// スコア計算
// - 各タスクの達成率（実績/目標）を平均 → 最大70点
// - 全体振り返り記入 → 20点
// - 全タスクに一言記入 → 10点
export function calcScore(record: Partial<DailyRecord>): number {
  const tasks = record.tasks ?? [];
  if (tasks.length === 0) return 0;

  const achievementRates = tasks.map((t) => {
    if (t.targetValue <= 0) return 0;
    return Math.min(1, t.actualValue / t.targetValue);
  });
  const avgRate = achievementRates.reduce((a, b) => a + b, 0) / achievementRates.length;
  const achScore = Math.round(avgRate * 70);

  const reflectionScore = (record.reflection?.length ?? 0) > 10 ? 20 : 0;
  const noteScore = tasks.every((t) => t.note.length > 0) ? 10 : 0;

  return Math.min(100, achScore + reflectionScore + noteScore);
}

// ダミーGoogleカレンダーイベント
export const DUMMY_CALENDAR_EVENTS = [
  { time: "09:00", title: "朝会（チーム全体）", color: "#378ADD" },
  { time: "10:30", title: "顧客MTG：ABC商事", color: "#0F6E56" },
  { time: "13:00", title: "提案書レビュー", color: "#993C1D" },
  { time: "15:00", title: "1on1（上長）", color: "#534AB7" },
  { time: "16:30", title: "夕会", color: "#378ADD" },
  { time: "18:00", title: "架電タイム", color: "#0F6E56" },
];

const sampleTasks1: TaskItem[] = [
  { category: "架電", targetValue: 10, unit: "件", actualValue: 11, note: "午前中に集中して架電できた" },
  { category: "商談", targetValue: 2, unit: "件", actualValue: 1, note: "1件は先方都合でリスケ" },
  { category: "提案書作成", targetValue: 1, unit: "枚", actualValue: 1, note: "想定より早く仕上がった" },
];

const sampleTasks2: TaskItem[] = [
  { category: "CS対応", targetValue: 5, unit: "件", actualValue: 5, note: "" },
  { category: "事務処理", targetValue: 3, unit: "時間", actualValue: 2, note: "" },
  { category: "面談", targetValue: 2, unit: "件", actualValue: 2, note: "" },
];

export const MOCK_ADMIN_RECORDS: DailyRecord[] = [
  {
    id: "rec-1", userId: "user-1", date: todayStr(),
    tasks: sampleTasks1,
    checkinAt: "08:52", checkoutAt: "18:10",
    reflection: "架電は目標超えで好調。商談は1件リスケになったが、提案書は完成できた。明日は商談の再調整を優先する。",
    status: "done", score: 85,
  },
  {
    id: "rec-2", userId: "user-2", date: todayStr(),
    tasks: sampleTasks2,
    checkinAt: "09:01", checkoutAt: null,
    reflection: "", status: "working", score: null,
  },
  {
    id: "rec-3", userId: "user-3", date: todayStr(),
    tasks: [], checkinAt: null, checkoutAt: null,
    reflection: "", status: "absent", score: null,
  },
];

export const MOCK_WEEKLY_SCORES: WeeklyScore[] = [
  { date: "2024-04-14", label: "月", score: 78 },
  { date: "2024-04-15", label: "火", score: 85 },
  { date: "2024-04-16", label: "水", score: 72 },
  { date: "2024-04-17", label: "木", score: 91 },
  { date: "2024-04-18", label: "金", score: 68 },
  { date: "2024-04-19", label: "今日", score: null },
];

// Googleカレンダーの実際のURLを開く
export const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/r/day";
