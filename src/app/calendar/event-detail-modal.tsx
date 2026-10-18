'use client';

import { cn } from '@/lib/cn';
import type { CalendarItem } from '@/types/calendar';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EventDetail } from './event-detail';

/**
 * 캘린더에서 일정을 눌렀을 때(가로챈 라우트) 띄우는 상세 화면.
 * PC(md 이상)는 가운데 모달, 모바일은 화면 전체를 덮는 페이지처럼 보인다.
 * 닫으면 history를 되돌려 URL도 캘린더로 돌아간다.
 */
export function EventDetailModal({ item }: { item: CalendarItem }) {
  const router = useRouter();

  return (
    <DialogPrimitive.Root
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed z-50 flex flex-col bg-[#0c0c10] text-white',
            'inset-0',
            'md:inset-x-0 md:top-[12vh] md:bottom-auto md:mx-auto md:w-full md:max-w-lg',
            'md:max-h-[76vh] md:rounded-2xl md:border md:border-white/10 md:shadow-2xl',
            'duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'max-md:data-[state=open]:slide-in-from-right-full md:data-[state=open]:zoom-in-95',
            'focus:outline-none',
          )}
        >
          <DialogPrimitive.Title className="sr-only">{item.title}</DialogPrimitive.Title>

          {/* 모바일: 페이지형 상단 바 */}
          <div className="flex items-center gap-1 border-b border-white/10 px-2 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] md:hidden">
            <DialogPrimitive.Close className="flex h-11 cursor-pointer items-center gap-0.5 rounded-xl pl-1 pr-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
              캘린더
            </DialogPrimitive.Close>
          </div>

          {/* PC: 모달 닫기 버튼 */}
          <DialogPrimitive.Close
            aria-label="닫기"
            className="absolute right-3 top-3 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white md:flex"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="flex-1 overflow-y-auto px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 md:p-6 md:pr-12">
            <EventDetail item={item} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
