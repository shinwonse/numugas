'use client';

import { cn } from '@/lib/cn';
import { TEAM_HISTORY } from '@/data/history';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

function TimelineYear({
  item,
  yearIndex,
}: {
  item: (typeof TEAM_HISTORY)[number];
  yearIndex: number;
}) {
  const isLeft = yearIndex % 2 === 0;
  const { ref, isInView } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '-50px',
  });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="relative">
      {/* Year marker */}
      <div
        className="relative mb-8"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      >
        <div
          className={cn(
            'absolute left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2',
            'z-10 w-4 h-4 rounded-full',
            'border-2 border-red-500',
            yearIndex === 0
              ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
              : 'bg-black',
          )}
        />
        <div
          className={cn(
            'pl-14 md:pl-[calc(50%+1.5rem)]',
            'font-orbitron text-3xl md:text-4xl font-bold',
            'bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent',
          )}
        >
          {item.year}
        </div>
      </div>

      {/* Event cards */}
      <div className="space-y-4">
        {item.events.map((event, eventIndex) => (
          <div key={`${item.year}-${eventIndex}`} className="relative">
            <div
              className={cn(
                'absolute left-6 md:left-1/2 -translate-x-1/2',
                'top-5 w-1.5 h-1.5 rounded-full bg-red-500/60',
              )}
            />
            <div
              className={cn(
                'ml-14 md:ml-0',
                'md:w-[calc(50%-2rem)]',
                isLeft ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4',
              )}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? 'translateX(0)'
                  : `translateX(${isLeft ? '-50px' : '50px'})`,
                transition: `opacity 0.6s ease-out ${eventIndex * 0.1}s, transform 0.6s ease-out ${eventIndex * 0.1}s`,
              }}
            >
              <div
                className={cn(
                  'bg-black/40 backdrop-blur-xl',
                  'border border-white/10 rounded-2xl',
                  'p-5 md:p-6',
                  'transition-all duration-300',
                  'hover:border-red-500/30 hover:bg-black/50',
                  'hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]',
                )}
              >
                {event.month && (
                  <span className="text-xs font-medium text-red-400/80 tracking-wider uppercase">
                    {event.month}월
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white mt-1">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistoryTimeline() {
  return (
    <div className="relative">
      <div
        className={cn(
          'absolute top-0 bottom-0 w-px',
          'left-6 md:left-1/2',
          'bg-gradient-to-b from-red-500/50 via-red-500/20 to-transparent',
        )}
      />

      <div className="space-y-16 md:space-y-20">
        {TEAM_HISTORY.map((item, yearIndex) => (
          <TimelineYear
            key={item.year}
            item={item}
            yearIndex={yearIndex}
          />
        ))}
      </div>
    </div>
  );
}
