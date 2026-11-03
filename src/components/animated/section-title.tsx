import { cn } from '@/lib/cn';

interface SectionTitleProps {
  /** 제목 위 작은 안내 문구 (시즌·기준 등 실제 정보가 있을 때만) */
  subtitle?: string;
  title: string;
  description?: string;
  /** 섹션 순번 ("01"). 있으면 제목 왼쪽에 크게 표시한다 */
  index?: string;
  isInView: boolean;
  /** 제목 오른쪽 끝에 붙는 요소 (탭, 링크 등) */
  action?: React.ReactNode;
}

/**
 * 전광판 느낌의 섹션 제목: 왼쪽 정렬, 붉은 순번, 아래에서 밀려 올라오는 큰 제목.
 */
export function SectionTitle({
  subtitle,
  title,
  description,
  index,
  isInView,
  action,
}: SectionTitleProps) {
  const reveal = (delay: number): React.CSSProperties => ({
    transform: isInView ? 'translate3d(0,0,0)' : 'translate3d(0,110%,0)',
    transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${String(delay)}s`,
  });

  return (
    <div className="mb-10 md:mb-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-end gap-4 md:gap-6">
          {index && (
            <span className="overflow-hidden">
              <span
                className="block text-5xl font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(239,68,68)] md:text-7xl"
                style={reveal(0)}
              >
                {index}
              </span>
            </span>
          )}
          <div className="min-w-0">
            {subtitle && (
              <p className="overflow-hidden">
                <span
                  className="block text-xs font-semibold text-red-400 md:text-sm"
                  style={reveal(0.05)}
                >
                  {subtitle}
                </span>
              </p>
            )}
            <h2 className="mt-2 overflow-hidden pb-1">
              <span
                className={cn(
                  'block text-3xl font-black tracking-tight text-white md:text-5xl',
                )}
                style={reveal(0.12)}
              >
                {title}
              </span>
            </h2>
          </div>
        </div>
        {action && (
          <div
            style={{
              opacity: isInView ? 1 : 0,
              transition: 'opacity 0.6s 0.3s',
            }}
          >
            {action}
          </div>
        )}
      </div>

      <div
        className="mt-6 h-px origin-left bg-gradient-to-r from-red-500 via-white/15 to-transparent"
        style={{
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1) 0.2s',
        }}
      />

      {description && (
        <p
          className="mt-6 max-w-2xl text-base text-gray-400 md:text-lg"
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
