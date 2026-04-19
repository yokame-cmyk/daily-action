export type UserRole = "employee" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dept: string;
  avatarInitials: string;
}

export type AttendanceStatus = "before" | "working" | "done" | "absent";

// 定型業務カテゴリ
export const TASK_CATEGORIES = [
  "架電",
  "LINE送信",
  "学校連絡",
  "学校訪問",
  "商談",
  "面談",
  "提案書作成",
  "事務処理",
  "CS対応",
  "イベント準備",
  "採用関連",
  "振り返り・改善",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

// 業務ごとの単位候補
export const TASK_UNITS = ["件", "回", "校", "枚", "時間", "分", "人", "社"] as const;
export type TaskUnit = (typeof TASK_UNITS)[number];

// 業務アイテム（出勤時に最大3つ設定）
export interface TaskItem {
  category: TaskCategory;
  targetValue: number;   // 目標数値
  unit: string;          // 単位
  actualValue: number;   // 実績値（退勤時に入力）
  note: string;          // 一言振り返り
}

export interface CalendarEvent {
  time: string;
  title: string;
  color: string;
}

export interface DailyRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  tasks: TaskItem[];
  checkinAt: string | null;
  checkoutAt: string | null;
  reflection: string;
  status: AttendanceStatus;
  score: number | null;
}

export interface WeeklyScore {
  date: string;
  label: string;
  score: number | null;
}
