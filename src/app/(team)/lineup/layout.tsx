import { aggravo } from '@/lib/fonts';
import type { ReactNode } from 'react';

export default function LineupLayout({ children }: { children: ReactNode }) {
  return <div className={aggravo.variable}>{children}</div>;
}
