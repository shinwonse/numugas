import { TeamNav } from '@/components/team-nav';
import type React from 'react';

/** 라인업·회계 장부 등 팀원용 페이지 공통 레이아웃: 상단 버튼으로 `/team` 허브에 돌아간다. */
export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TeamNav />
      {children}
    </>
  );
}
