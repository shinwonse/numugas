interface PlayerDetailPageProps {
  params: { id: string };
}

export default function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const { id } = params;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Player Detail</h1>
      <p className="text-lg">선수 ID: {id}</p>
      <p className="mt-8 text-gray-400">(이 페이지는 임시입니다)</p>
    </main>
  );
}
