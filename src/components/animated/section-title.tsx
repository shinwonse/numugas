import { cn } from '@/lib/cn';

interface SectionTitleProps {
  subtitle: string;
  title: string;
  description?: string;
  isInView: boolean;
}

export function SectionTitle({
  subtitle,
  title,
  description,
  isInView,
}: SectionTitleProps) {
  return (
    <div className="text-center mb-16 md:mb-20">
      {/* Subtitle Badge */}
      <div
        className="mb-6 inline-flex"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      >
        <span
          className={cn(
            'px-4 py-1.5 rounded-full',
            'text-xs font-semibold uppercase tracking-[0.2em]',
            'bg-white/5 backdrop-blur-sm',
            'border border-white/10',
            'text-gray-400',
          )}
        >
          {subtitle}
        </span>
      </div>

      {/* Main Title */}
      <h2
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl',
          'font-bold tracking-tight',
          'text-white',
        )}
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s 0.1s, transform 0.6s 0.1s',
        }}
      >
        {title}
      </h2>

      {/* Gradient Underline */}
      <div
        className="mt-6 mx-auto h-0.5 w-16 bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-full"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'opacity 0.8s 0.2s, transform 0.8s 0.2s',
        }}
      />

      {description && (
        <p
          className="mt-6 text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
          style={{
            opacity: isInView ? 1 : 0,
            transition: 'opacity 0.6s 0.3s',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
