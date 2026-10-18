/**
 * 천천히 흐르는 붉은 격자 배경.
 * 50px 격자를 한 칸 크게 그려 두고 transform으로 한 칸씩 밀어 반복한다
 * (매 프레임 다시 그리는 canvas 대신 GPU 합성만 쓰고, 화면 밖에서도 비용이 거의 없다).
 */
export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: 'screen', animation: 'fade-in-only 2s ease-in-out forwards' }}
    >
      <div
        className="absolute -inset-[50px] animate-[grid-drift_4s_linear_infinite] motion-reduce:animate-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(239,68,68,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(239,68,68,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
