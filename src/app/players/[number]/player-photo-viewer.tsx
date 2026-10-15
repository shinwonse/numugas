'use client';

import {
  useCallback,
  useRef,
  type KeyboardEvent,
  type TouchEvent,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { DrivePhoto } from '@/lib/google-drive';
import { PlayerDriveImage } from './player-drive-image';

interface Props {
  photos: DrivePhoto[];
  index: number;
  playerName?: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onRestoreFocus: () => void;
}

export function PlayerPhotoViewer({
  photos,
  index,
  playerName = '선수 사진',
  onIndexChange,
  onClose,
  onRestoreFocus,
}: Props) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const restoreFocus = useCallback(
    (event: Event) => {
      event.preventDefault();
      onRestoreFocus();
    },
    [onRestoreFocus],
  );
  const photo = photos.at(index);
  const handleOpen = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose],
  );
  const previous = useCallback(() => {
    if (index > 0) onIndexChange(index - 1);
  }, [index, onIndexChange]);
  const next = useCallback(() => {
    if (index < photos.length - 1) onIndexChange(index + 1);
  }, [index, photos.length, onIndexChange]);
  const handleKey = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previous();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      }
    },
    [previous, next],
  );
  const startSwipe = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches.item(0);
    touchStart.current =
      event.touches.length === 1
        ? { x: touch.clientX, y: touch.clientY }
        : null;
  }, []);
  const moveSwipe = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1) touchStart.current = null;
  }, []);
  const cancelSwipe = useCallback(() => {
    touchStart.current = null;
  }, []);
  const endSwipe = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start || event.touches.length || event.changedTouches.length !== 1)
        return;
      const touch = event.changedTouches.item(0);
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      // Ignore taps, vertical scrolling, and multi-touch/pinch gestures.
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) next();
      else previous();
    },
    [next, previous],
  );
  if (!photo) return null;
  return (
    <Dialog open onOpenChange={handleOpen}>
      <DialogContent
        aria-describedby={undefined}
        onCloseAutoFocus={restoreFocus}
        onKeyDown={handleKey}
        className="w-full max-w-6xl gap-0 border-0 bg-[#080808] p-0 text-white sm:w-[96vw] sm:rounded-lg [&>button]:z-20 [&>button]:rounded-full [&>button]:bg-black/50 [&>button]:p-2"
      >
        <DialogTitle className="sr-only">{playerName} 사진</DialogTitle>
        <div className="relative">
          <div
            className="h-[78dvh] [touch-action:pan-y_pinch-zoom] sm:h-[82vh]"
            onTouchStart={startSwipe}
            onTouchMove={moveSwipe}
            onTouchEnd={endSwipe}
            onTouchCancel={cancelSwipe}
          >
            <PlayerDriveImage key={photo.id} photo={photo} enlarged />
          </div>
          <button
            type="button"
            aria-label="이전 사진"
            disabled={index === 0}
            onClick={previous}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0 sm:left-4"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            type="button"
            aria-label="다음 사진"
            disabled={index === photos.length - 1}
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/70 disabled:pointer-events-none disabled:opacity-0 sm:right-4"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <span
            aria-live="polite"
            aria-atomic="true"
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[10px] tabular-nums text-white/70"
          >
            {index + 1} / {photos.length}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
