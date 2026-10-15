'use client';

import { toKstDateKey, toKstTime } from '@/lib/calendar-utils';
import { cn } from '@/lib/cn';
import { supabase } from '@/lib/supabase';
import {
  CLUB_EVENT_TYPE_LABELS,
  CLUB_EVENT_TYPES,
  type ClubEvent,
  type ClubEventType,
} from '@/types/calendar';
import { CalendarDays, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface FormState {
  title: string;
  type: ClubEventType;
  date: string; // YYYY-MM-DD (KST)
  startTime: string; // HH:mm
  endTime: string; // HH:mm, optional
  allDay: boolean;
  location: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  type: 'training',
  date: '',
  startTime: '',
  endTime: '',
  allDay: false,
  location: '',
  description: '',
};

const inputClass = cn(
  'w-full px-3 py-2.5 rounded-xl text-sm',
  'bg-white/5 border border-white/10',
  'text-white placeholder:text-gray-600',
  'focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20',
);

function toKstIso(date: string, time: string) {
  return `${date}T${time || '00:00'}:00+09:00`;
}

function eventToForm(event: ClubEvent): FormState {
  return {
    title: event.title,
    type: event.type,
    date: toKstDateKey(event.starts_at),
    startTime: event.all_day ? '' : toKstTime(event.starts_at),
    endTime: event.ends_at && !event.all_day ? toKstTime(event.ends_at) : '',
    allDay: event.all_day,
    location: event.location ?? '',
    description: event.description ?? '',
  };
}

export function EventManager({
  secret,
  onUnauthorized,
}: {
  secret: string;
  onUnauthorized: () => void;
}) {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const loadEvents = useCallback(async () => {
    // 지난 30일 이후 일정만 관리 목록에 표시
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('club_events')
      .select('*')
      .gte('starts_at', since)
      .order('starts_at', { ascending: true });
    if (error) {
      setMessage({ ok: false, text: `일정 목록 조회 실패: ${error.message}` });
      return;
    }
    setEvents(data as ClubEvent[]);
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const request = async (method: 'POST' | 'PATCH' | 'DELETE', body: object) => {
    const res = await fetch('/api/admin/events', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) onUnauthorized();
    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.allDay && !form.startTime) {
      setMessage({ ok: false, text: '시작 시간을 입력하거나 종일을 선택하세요.' });
      return;
    }

    const event = {
      title: form.title,
      type: form.type,
      starts_at: toKstIso(form.date, form.allDay ? '' : form.startTime),
      ends_at:
        !form.allDay && form.endTime ? toKstIso(form.date, form.endTime) : null,
      all_day: form.allDay,
      location: form.location,
      description: form.description,
    };

    setIsSaving(true);
    setMessage(null);
    try {
      if (editingId) {
        await request('PATCH', { id: editingId, event });
      } else {
        await request('POST', { event });
      }
      setMessage({ ok: true, text: editingId ? '일정을 수정했습니다.' : '일정을 등록했습니다.' });
      resetForm();
      await loadEvents();
    } catch (err) {
      setMessage({ ok: false, text: String(err instanceof Error ? err.message : err) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (event: ClubEvent) => {
    if (!window.confirm(`"${event.title}" 일정을 삭제할까요?`)) return;
    setMessage(null);
    try {
      await request('DELETE', { id: event.id });
      if (editingId === event.id) resetForm();
      setMessage({ ok: true, text: '일정을 삭제했습니다.' });
      await loadEvents();
    } catch (err) {
      setMessage({ ok: false, text: String(err instanceof Error ? err.message : err) });
    }
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-red-400" />
        <h2 className="text-xl font-bold">구단 일정 관리</h2>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="rounded-2xl p-5 bg-white/5 border border-white/10 space-y-3"
      >
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="제목 (예: 정기 훈련)"
            className={inputClass}
            required
          />
          <select
            value={form.type}
            onChange={(e) => update('type', e.target.value as ClubEventType)}
            className={cn(inputClass, 'w-auto')}
          >
            {CLUB_EVENT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-black">
                {CLUB_EVENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => update('startTime', e.target.value)}
            className={inputClass}
            disabled={form.allDay}
            aria-label="시작 시간"
          />
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => update('endTime', e.target.value)}
            className={inputClass}
            disabled={form.allDay}
            aria-label="종료 시간 (선택)"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.allDay}
            onChange={(e) => update('allDay', e.target.checked)}
            className="accent-red-500"
          />
          종일
        </label>

        <input
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
          placeholder="장소 (선택)"
          className={inputClass}
        />
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="메모 (선택)"
          rows={3}
          className={inputClass}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className={cn(
              'flex-1 py-2.5 rounded-xl font-medium text-sm',
              'bg-red-500 hover:bg-red-600 disabled:opacity-50',
              'flex items-center justify-center gap-2 transition-colors',
            )}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingId ? '수정' : '등록'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10"
            >
              취소
            </button>
          )}
        </div>

        {message && (
          <p className={cn('text-sm', message.ok ? 'text-green-400' : 'text-red-400')}>
            {message.text}
          </p>
        )}
      </form>

      <ul className="mt-4 space-y-2">
        {events.length === 0 && (
          <li className="text-sm text-gray-500 text-center py-6">
            등록된 일정이 없습니다
          </li>
        )}
        {events.map((event) => (
          <li
            key={event.id}
            className={cn(
              'flex items-center gap-3 rounded-xl p-3',
              'bg-white/5 border border-white/10',
              editingId === event.id && 'border-red-500/40',
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                <span className="text-gray-400 mr-2">
                  {CLUB_EVENT_TYPE_LABELS[event.type]}
                </span>
                {event.title}
              </p>
              <p className="text-xs text-gray-500 tabular-nums">
                {toKstDateKey(event.starts_at)}{' '}
                {event.all_day ? '종일' : toKstTime(event.starts_at)}
                {event.location && ` · ${event.location}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingId(event.id);
                setForm(eventToForm(event));
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="수정"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => void handleDelete(event)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              aria-label="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
