"use client";

import { CalendarEvent } from "@/types";
import { DUMMY_CALENDAR_EVENTS, GOOGLE_CALENDAR_URL } from "@/lib/demoData";
import { Card, SectionTitle } from "@/components/ui";

interface Props {
  compact?: boolean;
}

export default function GoogleCalendarCard({ compact = false }: Props) {
  const events: CalendarEvent[] = DUMMY_CALENDAR_EVENTS;

  const shown = compact ? events.slice(0, 3) : events;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle>本日の予定</SectionTitle>
        <a
          href={GOOGLE_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Googleカレンダーを開く
        </a>
      </div>

      <ul className="flex flex-col divide-y divide-gray-50">
        {shown.map((ev) => (
          <li key={ev.time} className="flex items-center gap-3 py-2.5">
            <span className="text-xs text-gray-400 w-12 flex-shrink-0 font-mono">{ev.time}</span>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ev.color }} />
            <span className="text-sm text-gray-700">{ev.title}</span>
          </li>
        ))}
      </ul>

      {compact && events.length > 3 && (
        <p className="text-xs text-gray-400 mt-2 text-right">+{events.length - 3}件の予定</p>
      )}

      <p className="text-xs text-gray-300 mt-3 pt-2 border-t border-gray-50">
        ※ ダミーデータを表示中。実連携時はOAuth2で取得します。
      </p>
    </Card>
  );
}
