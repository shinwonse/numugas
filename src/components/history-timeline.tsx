'use client';

import { cn } from '@/lib/cn';
import { TEAM_HISTORY } from '@/data/history';
import { motion } from 'framer-motion';

export function HistoryTimeline() {
  return (
    <div className="relative">
      {/* Vertical timeline line - center on desktop, left on mobile */}
      <div
        className={cn(
          'absolute top-0 bottom-0 w-px',
          'left-6 md:left-1/2 md:-translate-x-px',
          'bg-gradient-to-b from-red-500/50 via-red-500/20 to-transparent',
        )}
      />

      <div className="space-y-16 md:space-y-20">
        {TEAM_HISTORY.map((item, yearIndex) => {
          const isLeft = yearIndex % 2 === 0;

          return (
            <div key={item.year} className="relative">
              {/* Year marker */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'flex items-center gap-4',
                  'md:justify-center',
                  'mb-8',
                )}
              >
                {/* Mobile: offset for left line */}
                <div className="relative z-10 flex items-center">
                  {/* Circle marker on the line */}
                  <div
                    className={cn(
                      'absolute left-6 md:left-1/2 md:-translate-x-1/2',
                      'w-4 h-4 rounded-full',
                      'border-2 border-red-500',
                      yearIndex === 0
                        ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                        : 'bg-black',
                    )}
                  />
                </div>

                {/* Year text */}
                <div
                  className={cn(
                    'pl-16 md:pl-0',
                    'font-orbitron text-3xl md:text-4xl font-bold',
                    'bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent',
                  )}
                >
                  {item.year}
                </div>
              </motion.div>

              {/* Event cards */}
              <div className="space-y-4">
                {item.events.map((event, eventIndex) => (
                  <motion.div
                    key={`${item.year}-${eventIndex}`}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -50 : 50,
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: eventIndex * 0.1,
                      ease: 'easeOut',
                    }}
                    className={cn(
                      // Mobile: always right of line
                      'ml-16 md:ml-0',
                      // Desktop: alternate sides
                      'md:w-[calc(50%-2rem)]',
                      isLeft ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4',
                    )}
                  >
                    {/* Small dot on the line for each event */}
                    <div
                      className={cn(
                        'absolute left-[22px] md:left-1/2 md:-translate-x-[3px]',
                        'w-1.5 h-1.5 rounded-full bg-red-500/60',
                        'mt-5',
                      )}
                    />

                    {/* Card */}
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
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
