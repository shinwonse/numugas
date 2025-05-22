import { redirect } from 'next/navigation';

export default function BatterStatsRedirectPage() {
  const currentYear = new Date().getFullYear();
  redirect(`/stats/batter/${currentYear}`);
}
