import { fetchCalendarItem } from '@/lib/fetchers/calendar';
import { notFound } from 'next/navigation';
import { EventDetailModal } from '../../../event-detail-modal';

/** 캘린더 안에서 일정을 누르면 이 라우트가 가로채 모달(모바일은 전체 화면)로 띄운다 */
export default async function InterceptedEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const item = await fetchCalendarItem((await params).id);
  if (!item) notFound();
  return <EventDetailModal item={item} />;
}
