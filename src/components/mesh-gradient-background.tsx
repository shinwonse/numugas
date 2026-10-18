/** 페이지 뒤에 고정으로 깔리는 붉은 빛 번짐(메시 그라디언트) 배경 */
export function MeshGradientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-red-600/15 blur-[120px]" />
      <div className="absolute top-[20%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-rose-500/10 blur-[100px]" />
      <div className="absolute -bottom-[20%] left-[30%] h-[60vh] w-[60vh] rounded-full bg-red-900/10 blur-[120px]" />
    </div>
  );
}
