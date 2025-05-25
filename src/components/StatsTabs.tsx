interface StatsTab {
  key: string;
  label: string;
  href?: string;
}

interface StatsTabsProps {
  tabs: StatsTab[];
  current: string;
  className?: string;
  onTabClick?: (key: string) => void;
}

export default function StatsTabs({
  tabs,
  current,
  className = '',
  onTabClick,
}: StatsTabsProps) {
  return (
    <div
      className={
        'w-full max-w-md mx-auto grid grid-cols-' +
        tabs.length +
        ' h-12 rounded-xl mb-8 bg-zinc-900 border border-zinc-800 shadow-lg ' +
        className
      }
      role="tablist"
      aria-orientation="horizontal"
      tabIndex={0}
      data-orientation="horizontal"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === current;
        const handleClick = (e: React.MouseEvent) => {
          if (onTabClick) {
            e.preventDefault();
            onTabClick(tab.key);
          }
        };
        return (
          <a
            key={tab.key}
            href={tab.href ?? '#'}
            onClick={handleClick}
            className={
              'flex items-center justify-center h-full w-full text-center font-bold text-lg transition-all duration-150 select-none ' +
              (isActive
                ? 'bg-red-600 text-white shadow-md scale-105'
                : 'bg-zinc-900 text-zinc-400 hover:text-red-400') +
              ' rounded-xl'
            }
            style={{ fontFamily: 'inherit' }}
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            role="tab"
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}
