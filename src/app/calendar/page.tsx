import type { Metadata } from 'next/types';
import { CalendarMonth } from './calendar-month';

export const revalidate = 300;

export const metadata: Metadata = {
  title: '구단 캘린더',
  description: '담장NUMUGAS 경기 일정과 결과, 훈련·행사 등 구단 일정을 확인하세요.',
};

export default function CalendarPage() {
  // 이번 달(KST) — ISR 주기마다 다시 계산된다
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return (
    <CalendarMonth year={now.getUTCFullYear()} month={now.getUTCMonth() + 1} />
  );
}
