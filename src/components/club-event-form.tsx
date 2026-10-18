'use client';

import {
  clubEventFormToPayload,
  type ClubEventFormState,
  type ClubEventPayload,
} from '@/lib/club-events-client';
import { cn } from '@/lib/cn';
import {
  CLUB_EVENT_TYPE_LABELS,
  CLUB_EVENT_TYPES,
  type ClubEventType,
} from '@/types/calendar';
import { Loader2 } from 'lucide-react';
import { useId, useState } from 'react';

const inputClass = cn(
  'w-full px-3 py-2.5 rounded-xl text-sm',
  'bg-white/5 border border-white/10',
  'text-white placeholder:text-gray-600',
  'focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20',
  'disabled:opacity-40',
);

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-400';

/**
 * 구단 일정 등록/수정 폼. 상태·검증·저장 중 표시를 자체 관리하고,
 * 저장은 onSubmit에 위임한다 (실패 시 throw하면 메시지로 표시).
 * 초기값을 바꾸려면 key로 리마운트한다.
 */
export function ClubEventForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: ClubEventFormState;
  submitLabel: string;
  onSubmit: (payload: ClubEventPayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const id = useId();
  const [form, setForm] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ClubEventFormState>(
    key: K,
    value: ClubEventFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = clubEventFormToPayload(form);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit(result.payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const isGame = form.type === 'game';

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        {isGame ? (
          <div>
            <label htmlFor={`${id}-opponent`} className={labelClass}>
              상대팀
            </label>
            <input
              id={`${id}-opponent`}
              value={form.opponent}
              onChange={(e) => update('opponent', e.target.value)}
              placeholder="예: 크레이지 덕스"
              className={inputClass}
              autoFocus
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor={`${id}-title`} className={labelClass}>
              제목
            </label>
            <input
              id={`${id}-title`}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="예: 정기 훈련"
              className={inputClass}
              autoFocus
              required
            />
          </div>
        )}
        <div>
          <label htmlFor={`${id}-type`} className={labelClass}>
            종류
          </label>
          <select
            id={`${id}-type`}
            value={form.type}
            onChange={(e) => update('type', e.target.value as ClubEventType)}
            className={cn(inputClass, 'w-auto cursor-pointer')}
          >
            {CLUB_EVENT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-black">
                {CLUB_EVENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-date`} className={labelClass}>
          날짜
        </label>
        <input
          id={`${id}-date`}
          type="date"
          value={form.date}
          onChange={(e) => update('date', e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${id}-start`} className={labelClass}>
            시작
          </label>
          <input
            id={`${id}-start`}
            type="time"
            value={form.startTime}
            onChange={(e) => update('startTime', e.target.value)}
            className={inputClass}
            disabled={!isGame && form.allDay}
          />
        </div>
        <div>
          <label htmlFor={`${id}-end`} className={labelClass}>
            종료 (선택)
          </label>
          <input
            id={`${id}-end`}
            type="time"
            value={form.endTime}
            onChange={(e) => update('endTime', e.target.value)}
            className={inputClass}
            disabled={!isGame && form.allDay}
          />
        </div>
      </div>

      {isGame ? (
        <fieldset>
          <legend className={labelClass}>점수 (선택 · 경기 후 입력)</legend>
          <div className="flex items-center gap-3">
            <label className="flex flex-1 items-center gap-2">
              <span className="shrink-0 text-xs text-gray-400">우리</span>
              <input
                value={form.ourScore}
                onChange={(e) => update('ourScore', e.target.value)}
                inputMode="numeric"
                aria-label="우리 팀 점수"
                className={cn(inputClass, 'text-center tabular-nums')}
              />
            </label>
            <span className="text-gray-500">:</span>
            <label className="flex flex-1 items-center gap-2">
              <input
                value={form.theirScore}
                onChange={(e) => update('theirScore', e.target.value)}
                inputMode="numeric"
                aria-label="상대 팀 점수"
                className={cn(inputClass, 'text-center tabular-nums')}
              />
              <span className="shrink-0 text-xs text-gray-400">상대</span>
            </label>
          </div>
        </fieldset>
      ) : (
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.allDay}
            onChange={(e) => update('allDay', e.target.checked)}
            className="h-4 w-4 accent-red-500"
          />
          종일
        </label>
      )}

      <div>
        <label htmlFor={`${id}-location`} className={labelClass}>
          장소 (선택)
        </label>
        <input
          id={`${id}-location`}
          value={form.location}
          onChange={(e) => update('location', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`${id}-description`} className={labelClass}>
          메모 (선택)
        </label>
        <textarea
          id={`${id}-description`}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            'flex-1 py-2.5 rounded-xl font-medium text-sm',
            'bg-red-500 hover:bg-red-600 disabled:opacity-50',
            'flex items-center justify-center gap-2 transition-colors cursor-pointer',
          )}
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
