import type { ReactNode } from 'react';

export default function StatsLayout({ children }: { children: ReactNode }) {
  return <div className="bg-black px-2">{children}</div>;
}
