import { MeshGradientBackground } from '@/components/mesh-gradient-background';
import type { ReactNode } from 'react';
import { CalendarAdminProvider } from './calendar-admin';

export default function CalendarLayout({
  children,
  modal,
}: {
  children: ReactNode;
  /** 일정 상세 모달 슬롯 (@modal) */
  modal: ReactNode;
}) {
  return (
    <div className="bg-under-nav relative min-h-screen bg-[#050508] overflow-hidden">
      <MeshGradientBackground />

      <div className="relative z-10">
        <CalendarAdminProvider>
          {children}
          {modal}
        </CalendarAdminProvider>
      </div>
    </div>
  );
}
