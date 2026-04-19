import { clsx, type ClassValue } from "clsx";
import { TaskItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function scoreColor(score: number | null): string {
  if (score === null) return "text-gray-400";
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

export function scoreBg(score: number | null): string {
  if (score === null) return "bg-gray-100";
  if (score >= 80) return "bg-emerald-50";
  if (score >= 60) return "bg-amber-50";
  return "bg-red-50";
}

export function statusLabel(status: string) {
  switch (status) {
    case "working": return { label: "勤務中", cls: "bg-emerald-100 text-emerald-700" };
    case "done":    return { label: "退勤済", cls: "bg-blue-100 text-blue-700" };
    case "absent":  return { label: "未出勤", cls: "bg-gray-100 text-gray-500" };
    default:        return { label: "未出勤", cls: "bg-gray-100 text-gray-500" };
  }
}

export function todayLabel() {
  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric", weekday: "short",
  });
}

// タスクの達成率 (0〜1)
export function achievementRate(task: TaskItem): number {
  if (task.targetValue <= 0) return 0;
  return Math.min(1, task.actualValue / task.targetValue);
}

// 達成率に応じた色
export function rateColor(rate: number): string {
  if (rate >= 1)   return "text-emerald-600";
  if (rate >= 0.7) return "text-amber-500";
  return "text-red-500";
}

export function rateBgBar(rate: number): string {
  if (rate >= 1)   return "bg-emerald-500";
  if (rate >= 0.7) return "bg-amber-400";
  return "bg-red-400";
}

// diff表示用
export function diffLabel(task: TaskItem): string {
  const diff = task.actualValue - task.targetValue;
  if (diff > 0)  return `+${diff}${task.unit}`;
  if (diff < 0)  return `${diff}${task.unit}`;
  return "ちょうど";
}
