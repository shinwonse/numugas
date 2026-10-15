'use client';

import { ClubEventForm } from '@/components/club-event-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  clubEventToForm,
  emptyClubEventForm,
  type ClubEventPayload,
} from '@/lib/club-events-client';
import { cn } from '@/lib/cn';
import type { CalendarItem } from '@/types/calendar';
import { KeyRound, Loader2 } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  deleteClubEventAction,
  saveClubEventAction,
  verifyCalendarAdmin,
} from './actions';

type EventItem = Extract<CalendarItem, { kind: 'event' }>;

interface CalendarAdminContextValue {
  isAdmin: boolean;
  openUnlock: () => void;
  lock: () => void;
  openCreate: (date: string) => void;
  openEdit: (item: EventItem) => void;
  openDelete: (item: EventItem) => void;
}

const CalendarAdminContext = createContext<CalendarAdminContextValue | null>(
  null,
);

export function useCalendarAdmin() {
  const value = useContext(CalendarAdminContext);
  if (!value) throw new Error('CalendarAdminProvider가 필요합니다.');
  return value;
}

// 탭을 닫으면 사라지도록 sessionStorage에만 보관
const STORAGE_KEY = 'numugas:calendar-admin-secret';

function readStoredSecret() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeSecret(secret: string | null) {
  try {
    if (secret) sessionStorage.setItem(STORAGE_KEY, secret);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장 실패 시 이 페이지에서만 유지된다
  }
}

const dialogClass =
  'max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-white/10 bg-[#0c0c10] text-white sm:rounded-2xl [&>button]:text-white/60';

type EditorState =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; item: EventItem }
  | null;

/**
 * 캘린더 관리 모드: 관리자 키 확인 후 날짜에서 바로 일정 추가/수정/삭제.
 * 레이아웃에 두어 월 이동 후에도 관리 모드가 유지된다.
 */
export function CalendarAdminProvider({ children }: { children: ReactNode }) {
  const [secret, setSecret] = useState<string | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setSecret(readStoredSecret());
  }, []);

  const lock = useCallback(() => {
    storeSecret(null);
    setSecret(null);
  }, []);

  /** 키가 만료/변경되어 401이 나면 관리 모드를 풀고 다시 묻는다 */
  const handleAuthFailure = useCallback(() => {
    lock();
    setEditor(null);
    setDeleting(null);
    setUnlockError('관리자 키가 더 이상 유효하지 않습니다. 다시 입력하세요.');
    setUnlockOpen(true);
  }, [lock]);

  // Server Action 응답에 갱신된 화면이 함께 오므로 별도 refresh가 필요 없다
  const save = async (payload: ClubEventPayload) => {
    if (!secret || !editor) return;
    const result = await saveClubEventAction(
      secret,
      editor.mode === 'edit' ? editor.item.eventId : null,
      payload,
    );
    if (!result.ok) {
      if (result.status === 401) {
        handleAuthFailure();
        return;
      }
      throw new Error(result.error);
    }
    setEditor(null);
  };

  const confirmDelete = async () => {
    if (!secret || !deleting) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteClubEventAction(secret, deleting.eventId);
      if (result.ok) setDeleting(null);
      else if (result.status === 401) handleAuthFailure();
      else setDeleteError(result.error);
    } catch {
      setDeleteError('서버 연결에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const value = useMemo<CalendarAdminContextValue>(
    () => ({
      isAdmin: Boolean(secret),
      openUnlock: () => {
        setUnlockError(null);
        setUnlockOpen(true);
      },
      lock,
      openCreate: (date) => {
        setEditor({ mode: 'create', date });
      },
      openEdit: (item) => {
        setEditor({ mode: 'edit', item });
      },
      openDelete: (item) => {
        setDeleteError(null);
        setDeleting(item);
      },
    }),
    [secret, lock],
  );

  return (
    <CalendarAdminContext.Provider value={value}>
      {children}

      <UnlockDialog
        open={unlockOpen}
        initialError={unlockError}
        onOpenChange={setUnlockOpen}
        onUnlocked={(key) => {
          storeSecret(key);
          setSecret(key);
          setUnlockOpen(false);
        }}
      />

      <Dialog
        open={editor !== null}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
      >
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle>
              {editor?.mode === 'edit' ? '일정 수정' : '일정 추가'}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              저장하면 캘린더에 바로 반영됩니다.
            </DialogDescription>
          </DialogHeader>
          {editor && (
            <ClubEventForm
              key={editor.mode === 'edit' ? editor.item.id : editor.date}
              initial={
                editor.mode === 'edit'
                  ? clubEventToForm({
                      title: editor.item.title,
                      type: editor.item.eventType,
                      starts_at: editor.item.startsAt,
                      ends_at: editor.item.endsAt,
                      all_day: editor.item.allDay,
                      location: editor.item.location,
                      description: editor.item.description,
                    })
                  : emptyClubEventForm(editor.date)
              }
              submitLabel={editor.mode === 'edit' ? '수정' : '추가'}
              onSubmit={save}
              onCancel={() => {
                setEditor(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleting(null);
        }}
      >
        <AlertDialogContent className={dialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle>일정을 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              &ldquo;{deleting?.title}&rdquo; 일정이 캘린더에서 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-red-400" role="alert">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                // 삭제가 끝날 때까지 닫지 않는다
                e.preventDefault();
                void confirmDelete();
              }}
              className="rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CalendarAdminContext.Provider>
  );
}

function UnlockDialog({
  open,
  initialError,
  onOpenChange,
  onUnlocked,
}: {
  open: boolean;
  initialError: string | null;
  onOpenChange: (open: boolean) => void;
  onUnlocked: (secret: string) => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (open) {
      setValue('');
      setError(initialError);
    }
  }, [open, initialError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const key = value.trim();
    if (!key) return;
    setIsChecking(true);
    setError(null);
    try {
      if (await verifyCalendarAdmin(key)) onUnlocked(key);
      else setError('관리자 키가 올바르지 않습니다.');
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle>일정 관리</DialogTitle>
          <DialogDescription className="text-white/50">
            관리자 키를 입력하면 캘린더에서 바로 일정을 추가하고 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="관리자 키"
              aria-label="관리자 키"
              autoFocus
              className={cn(
                'w-full rounded-xl py-2.5 pl-10 pr-4 text-sm',
                'border border-white/10 bg-white/5 text-white placeholder:text-gray-600',
                'focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20',
              )}
            />
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isChecking || !value.trim()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-medium transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isChecking && <Loader2 className="h-4 w-4 animate-spin" />}
            확인
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
