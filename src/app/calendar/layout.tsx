import type { ReactNode } from 'react';
import { CalendarAdminProvider } from './calendar-admin';

export default function CalendarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-red-600/15 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-rose-500/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[30%] h-[60vh] w-[60vh] rounded-full bg-red-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <CalendarAdminProvider>{children}</CalendarAdminProvider>
      </div>
    </div>
  );
}
