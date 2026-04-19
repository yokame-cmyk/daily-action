"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DailyRecord, AttendanceStatus, TaskItem } from "@/types";
import { calcScore } from "@/lib/demoData";
import { useAuth } from "@/lib/authContext";

interface RecordContextType {
  record: DailyRecord | null;
  checkin: (tasks: TaskItem[]) => void;
  checkout: (data: { tasks: TaskItem[]; reflection: string }) => void;
  status: AttendanceStatus;
}

const RecordContext = createContext<RecordContextType | null>(null);

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function nowTime() {
  return new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function emptyRecord(userId: string): DailyRecord {
  return {
    id: `rec-${Date.now()}`,
    userId,
    date: todayStr(),
    tasks: [],
    checkinAt: null,
    checkoutAt: null,
    reflection: "",
    status: "before",
    score: null,
  };
}

export function RecordProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [record, setRecord] = useState<DailyRecord | null>(null);

  useEffect(() => {
    if (!user) { setRecord(null); return; }
    try {
      const stored = localStorage.getItem("daily_action_record_v2");
      if (stored) {
        const parsed: DailyRecord = JSON.parse(stored);
        if (parsed.userId === user.id && parsed.date === todayStr()) {
          setRecord(parsed);
          return;
        }
      }
    } catch {}
    setRecord(emptyRecord(user.id));
  }, [user]);

  const save = useCallback((next: DailyRecord) => {
    setRecord(next);
    localStorage.setItem("daily_action_record_v2", JSON.stringify(next));
  }, []);

  const checkin = useCallback((tasks: TaskItem[]) => {
    if (!user) return;
    const base = record ?? emptyRecord(user.id);
    save({ ...base, tasks, checkinAt: nowTime(), status: "working" });
  }, [record, user, save]);

  const checkout = useCallback((data: { tasks: TaskItem[]; reflection: string }) => {
    if (!record) return;
    const updated: DailyRecord = {
      ...record,
      tasks: data.tasks,
      reflection: data.reflection,
      checkoutAt: nowTime(),
      status: "done",
    };
    updated.score = calcScore(updated);
    save(updated);
  }, [record, save]);

  return (
    <RecordContext.Provider value={{ record, checkin, checkout, status: record?.status ?? "before" }}>
      {children}
    </RecordContext.Provider>
  );
}

export function useRecord() {
  const ctx = useContext(RecordContext);
  if (!ctx) throw new Error("useRecord must be used inside RecordProvider");
  return ctx;
}
