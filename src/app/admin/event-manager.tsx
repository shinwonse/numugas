'use client';

import { ClubEventForm } from '@/components/club-event-form';
import { toKstDateKey, toKstTime } from '@/lib/calendar-utils';
import {
  AdminRequestError,
  clubEventToForm,
  emptyClubEventForm,
  requestClubEvent,
  type ClubEventPayload,
} from '@/lib/club-events-client';
import { cn } from '@/lib/cn';
import { supabase } from '@/lib/supabase';
import { CLUB_EVENT_TYPE_LABELS, type ClubEvent } from '@/types/calendar';
import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function EventManager({
  secret,
  onUnauthorized,
}: {
  secret: string;
  onUnauthorized: () => void;
}) {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [editing, setEditing] = useState<ClubEvent | null>(null);
  // 등록/수정 완료 시 폼을 초기화하기 위한 리마운트 키
  const [formKey, setFormKey] = useState(0);
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

  const request = async (
    method: 'POST' | 'PATCH' | 'DELETE',
    body: { id?: string; event?: ClubEventPayload },
  ) => {
    try {
      await requestClubEvent(secret, method, body);
    } catch (err) {
      if (err instanceof AdminRequestError && err.status === 401) {
        onUnauthorized();
      }
      throw err;
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
  };

  const handleSubmit = async (event: ClubEventPayload) => {
    setMessage(null);
    if (editing) {
      await request('PATCH', { id: editing.id, event });
    } else {
      await request('POST', { event });
    }
    setMessage({ ok: true, text: editing ? '일정을 수정했습니다.' : '일정을 등록했습니다.' });
    resetForm();
    await loadEvents();
  };

  const handleDelete = async (event: ClubEvent) => {
    if (!window.confirm(`"${event.title}" 일정을 삭제할까요?`)) return;
    setMessage(null);
    try {
      await request('DELETE', { id: event.id });
      if (editing?.id === event.id) resetForm();
      setMessage({ ok: true, text: '일정을 삭제했습니다.' });
      await loadEvents();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-red-400" />
        <h2 className="text-xl font-bold">구단 일정 관리</h2>
      </div>

      <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
        <ClubEventForm
          key={`${editing?.id ?? 'new'}-${formKey}`}
          initial={editing ? clubEventToForm(editing) : emptyClubEventForm()}
          submitLabel={editing ? '수정' : '등록'}
          onSubmit={handleSubmit}
          onCancel={editing ? resetForm : undefined}
        />
        {message && (
          <p className={cn('mt-3 text-sm', message.ok ? 'text-green-400' : 'text-red-400')}>
            {message.text}
          </p>
        )}
      </div>

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
              editing?.id === event.id && 'border-red-500/40',
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
                setEditing(event);
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
