import RankerCard from '#/app/components/RankerCard';
import { fetchTopPitchers } from '#/libs/fetchTopPitchers';
import { cn } from '#/utils/cn';

async function TopPitcher() {
  const { topInningPitcher, topSoPitcher, topWinPitcher } =
    await fetchTopPitchers();
  return (
    <div
      className={cn(
        'grid md:grid-cols-3 gap-4 text-primary font-bold grid-cols-2'
      )}
    >
      <RankerCard
        playerName={topInningPitcher?.name.split('(')[0]}
        playerNumber={topInningPitcher?.name.split('(')[1].split(')')[0]}
        title="이닝"
        value={topInningPitcher?.inning}
      />
      <RankerCard
        playerName={topWinPitcher?.name.split('(')[0]}
        playerNumber={topWinPitcher?.name.split('(')[1].split(')')[0]}
        title="다승"
        value={topWinPitcher?.win}
      />
      <RankerCard
        playerName={topSoPitcher?.name.split('(')[0]}
        playerNumber={topSoPitcher?.name.split('(')[1].split(')')[0]}
        title="탈삼진"
        value={topSoPitcher?.so}
      />
    </div>
  );
}

export default TopPitcher;
