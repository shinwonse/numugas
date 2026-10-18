import { ListOrdered, type LucideIcon, RefreshCw, Wallet } from 'lucide-react';

export type TeamMenuItem = {
  label: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** 팀 비밀번호를 입력해야 열리는 메뉴 */
  locked?: boolean;
};

/** 팀원 전용 페이지들. `/team` 허브와 하단 네비의 TEAM 탭이 이 목록을 함께 쓴다. */
export const TEAM_ITEMS: readonly TeamMenuItem[] = [
  {
    label: 'LINEUP',
    title: '라인업',
    description: '경기 라인업을 짜고 이미지로 저장',
    href: '/lineup',
    icon: ListOrdered,
  },
  {
    label: 'LEDGER',
    title: '회계 장부',
    description: '회비 납부 현황과 입출금 내역',
    href: '/ledger',
    icon: Wallet,
    locked: true,
  },
  {
    label: 'ADMIN',
    title: '데이터 관리',
    description: '기록·일정을 다시 불러와 사이트에 반영',
    href: '/admin',
    icon: RefreshCw,
    locked: true,
  },
];

export const TEAM_HUB_HREF = '/team';
