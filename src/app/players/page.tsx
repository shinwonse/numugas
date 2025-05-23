import PlayerPositionTabs from './PlayerPositionTabs';

// Mock player data
const players = [
  {
    id: 1,
    name: '홍길동',
    position: '투수',
    number: 11,
    photo: '/mock-player-1.png',
    stats: { ERA: 2.31, W: 5, L: 1, SO: 48 },
  },
  {
    id: 2,
    name: '김철수',
    position: '포수',
    number: 27,
    photo: '/mock-player-2.png',
    stats: { AVG: 0.312, HR: 3, RBI: 21, SB: 4 },
  },
  {
    id: 3,
    name: '이영희',
    position: '내야수',
    number: 7,
    photo: '/mock-player-3.png',
    stats: { AVG: 0.288, HR: 2, RBI: 17, SB: 7 },
  },
  {
    id: 4,
    name: '박민수',
    position: '외야수',
    number: 51,
    photo: '/mock-player-4.png',
    stats: { AVG: 0.301, HR: 1, RBI: 14, SB: 10 },
  },
];

const POSITIONS = ['투수', '포수', '내야수', '외야수'];

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center font-display">
          <span className="text-red-600">선수단</span> 명단
        </h1>
        <PlayerPositionTabs positions={POSITIONS} players={players} />
      </div>
    </main>
  );
}
