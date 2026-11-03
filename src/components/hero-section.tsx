import { GridBackground } from '@/components/animated/grid-background';
import Image from 'next/image';

/** 야구공 실밥 곡선: 화면 양 끝에서 로고를 감싸듯 휘어진다 */
function BaseballSeams() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {[
        'M 140 -40 C 420 220, 420 580, 140 840',
        'M 1060 -40 C 780 220, 780 580, 1060 840',
      ].map((d, i) => (
        <g key={d}>
          <path
            d={d}
            pathLength={1}
            fill="none"
            stroke="rgba(239,68,68,0.35)"
            strokeWidth={1.5}
            strokeDasharray="1"
            style={{
              animation: `draw-stroke 2.4s cubic-bezier(0.65, 0, 0.35, 1) ${String(0.2 + i * 0.15)}s both`,
            }}
          />
          {/* 실밥 바늘땀: 같은 곡선을 굵은 점선으로 한 번 더 그린다 */}
          <path
            d={d}
            fill="none"
            stroke="rgba(239,68,68,0.5)"
            strokeWidth={10}
            strokeDasharray="2 22"
            transform={i === 0 ? 'translate(14 0)' : 'translate(-14 0)'}
            style={{
              animation: `fade-in-only 1.2s ease-out ${String(1.6 + i * 0.15)}s both`,
            }}
          />
        </g>
      ))}
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <GridBackground />
      <BaseballSeams />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/25 via-black/70 to-black" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div
          className="w-full max-w-2xl"
          style={{
            animation:
              'hero-scale-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
          }}
        >
          <Image
            src="/title.png"
            alt="담장NUMUGAS"
            width={600}
            height={120}
            className="w-full object-contain drop-shadow-[0_0_50px_rgba(239,68,68,0.5)]"
            priority
            fetchPriority="high"
          />
        </div>

        {/* 글자 없이 선만 흘러 아래에 내용이 있음을 알린다 */}
        <a
          href="#통계"
          aria-label="팀 기록으로 이동"
          className="mt-16 flex flex-col items-center p-2"
          style={{ animation: 'fade-in-only 1s ease-out 1.6s both' }}
        >
          <span className="relative h-12 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/3 bg-red-500 animate-[scroll-cue_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] motion-reduce:animate-none" />
          </span>
        </a>
      </div>
    </section>
  );
}
