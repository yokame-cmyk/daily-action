import { cn } from "@/lib/utils";
import React from "react";

// ── Button ──────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}
export function Button({ variant = "secondary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",
        { primary: "bg-gray-900 text-white hover:bg-gray-700 focus:ring-gray-900",
          secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
          success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
          danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
          ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
        }[variant],
        { sm: "text-xs px-3 h-8", md: "text-sm px-4 h-10", lg: "text-base px-6 h-12 w-full" }[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <input
        className={cn(
          "w-full h-10 px-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
      <textarea
        className={cn(
          "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all",
          className
        )}
        rows={4}
        {...props}
      />
    </div>
  );
}

// ── Card ──────────────────────────────────────────────
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm p-5", className)}>
      {children}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────
export function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", className)}>
      {label}
    </span>
  );
}

// ── Avatar ──────────────────────────────────────────────
export function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={cn(
      "rounded-full bg-gray-900 text-white flex items-center justify-center font-medium flex-shrink-0",
      { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base" }[size]
    )}>
      {initials}
    </div>
  );
}

// ── SectionTitle ──────────────────────────────────────
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{children}</p>;
}

// ── ProgressBar ──────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = "bg-emerald-500", className }: { value: number; max?: number; color?: string; className?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn("w-full h-1.5 bg-gray-100 rounded-full overflow-hidden", className)}>
      <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── NumberInput ─ 目標/実績の数値入力 ────────────────────
interface NumberInputProps {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  highlight?: "target" | "actual";
}
export function NumberInput({ label, value, unit, onChange, min = 0, max = 999, highlight }: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className={cn("text-xs font-medium",
        highlight === "target" ? "text-blue-600" :
        highlight === "actual" ? "text-emerald-600" :
        "text-gray-500"
      )}>{label}</label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm flex items-center justify-center transition-colors"
        >−</button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
          className={cn(
            "w-14 h-7 text-center text-sm font-bold rounded-lg border transition-all focus:outline-none",
            highlight === "target" ? "border-blue-200 bg-blue-50 text-blue-700 focus:ring-2 focus:ring-blue-300" :
            highlight === "actual" ? "border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-2 focus:ring-emerald-300" :
            "border-gray-200 bg-white text-gray-800"
          )}
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm flex items-center justify-center transition-colors"
        >+</button>
        <span className="text-xs text-gray-500 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}
