import { redirect } from 'next/navigation';

export default function PitcherStatsRedirectPage() {
  const currentYear = new Date().getFullYear();
  redirect(`/stats/pitcher/${currentYear}`);
}
