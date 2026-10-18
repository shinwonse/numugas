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
import type { ClubEvent } from '@/types/calendar';
import { KeyRound, Loader2 } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  deleteClubEventAction,
  saveClubEventAction,
  verifyCalendarAdmin,
} from './actions';

interface CalendarAdminContextValue {
  /** 아래 동작들은 매번 관리자 키를 먼저 묻고, 확인되면 이어서 실행한다 */
  openCreate: (date: string) => void;
  openEdit: (record: ClubEvent) => void;
  openDelete: (record: ClubEvent, onDeleted?: () => void) => void;
}

const CalendarAdminContext = createContext<CalendarAdminContextValue | null>(
  null,
);

export function useCalendarAdmin() {
  const value = useContext(CalendarAdminContext);
  if (!value) throw new Error('CalendarAdminProvider가 필요합니다.');
  return value;
}

const dialogClass =
  'max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-white/10 bg-[#0c0c10] text-white sm:rounded-2xl [&>button]:text-white/60';

type EditorState =
  | { mode: 'create'; date: string }
  | { mode: 'edit'; record: ClubEvent }
  | null;

/**
 * 캘린더 일정 관리: 추가/수정/삭제를 누를 때마다 관리자 키를 묻는다.
 * 키는 그 동작(폼·삭제 확인)이 끝날 때까지만 메모리에 두고 버린다.
 * 레이아웃에 두어 월 이동·상세 모달에서도 쓴다.
 */
export function CalendarAdminProvider({ children }: { children: ReactNode }) {
  const [secret, setSecret] = useState<string | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [deleting, setDeleting] = useState<{
    record: ClubEvent;
    onDeleted?: () => void;
  } | null>(null);
  // 키 입력이 끝나면 이어서 실행할 동작 (일정 추가/수정/삭제)
  const pendingRef = useRef<(() => void) | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 열린 동작이 하나도 없으면 키를 버린다 → 다음 동작에서 다시 묻는다
  useEffect(() => {
    if (!editor && !deleting && !unlockOpen) setSecret(null);
  }, [editor, deleting, unlockOpen]);

  const requireAdmin = useCallback((action: () => void) => {
    pendingRef.current = action;
    setUnlockError(null);
    setUnlockOpen(true);
  }, []);

  /** 저장 도중 키가 바뀌어 401이 나면 같은 동작을 다시 열 수 있게 키를 다시 묻는다 */
  const handleAuthFailure = useCallback(() => {
    const retryEditor = editor;
    const retryDeleting = deleting;
    pendingRef.current = () => {
      if (retryEditor) setEditor(retryEditor);
      if (retryDeleting) setDeleting(retryDeleting);
    };
    setEditor(null);
    setDeleting(null);
    setSecret(null);
    setUnlockError('관리자 키가 더 이상 유효하지 않습니다. 다시 입력하세요.');
    setUnlockOpen(true);
  }, [editor, deleting]);

  // Server Action 응답에 갱신된 화면이 함께 오므로 별도 refresh가 필요 없다
  const save = async (payload: ClubEventPayload) => {
    if (!secret || !editor) return;
    const result = await saveClubEventAction(
      secret,
      editor.mode === 'edit' ? editor.record.id : null,
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
      const result = await deleteClubEventAction(secret, deleting.record.id);
      if (result.ok) {
        setDeleting(null);
        deleting.onDeleted?.();
      }
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
      openCreate: (date) => {
        requireAdmin(() => {
          setEditor({ mode: 'create', date });
        });
      },
      openEdit: (record) => {
        requireAdmin(() => {
          setEditor({ mode: 'edit', record });
        });
      },
      openDelete: (record, onDeleted) => {
        requireAdmin(() => {
          setDeleteError(null);
          setDeleting({ record, onDeleted });
        });
      },
    }),
    [requireAdmin],
  );

  return (
    <CalendarAdminContext.Provider value={value}>
      {children}

      <UnlockDialog
        open={unlockOpen}
        initialError={unlockError}
        onOpenChange={(open) => {
          setUnlockOpen(open);
          // 키 입력을 취소하면 대기 중이던 동작도 버린다
          if (!open) pendingRef.current = null;
        }}
        onUnlocked={(key) => {
          setSecret(key);
          setUnlockOpen(false);
          const pending = pendingRef.current;
          pendingRef.current = null;
          pending?.();
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
              key={editor.mode === 'edit' ? editor.record.id : editor.date}
              initial={
                editor.mode === 'edit'
                  ? clubEventToForm(editor.record)
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
              &ldquo;{deleting?.record.title}&rdquo; 일정이 캘린더에서 삭제됩니다.
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
          <DialogTitle>관리자 확인</DialogTitle>
          <DialogDescription className="text-white/50">
            일정을 추가·수정·삭제하려면 관리자 키를 입력하세요.
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
              autoComplete="off"
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
