import getStats from '@numugas/util/crawler';

import { cn } from '#/utils/cn';

type Props = {
  className?: string;
  season: string;
};

async function SeasonStatTable({ className, season }: Props) {
  const seasonStats = await getStats(season);

  if (seasonStats.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-52')}>
        시즌 기록이 존재하지 않습니다.
      </div>
    );
  }

  return (
    <table
      className={cn(
        'table overflow-x-scroll table-auto text-nowrap whitespace-nowrap border-separate border-spacing-4',
        className
      )}
    >
      <thead className={cn('text-center text-nowrap whitespace-nowrap')}>
        <tr>
          <th>이름</th>
          <th>타율</th>
          <th>출루율</th>
          <th>장타율</th>
          <th>OPS</th>
          <th>게임수</th>
          <th>타석</th>
          <th>타수</th>
          <th>득점</th>
          <th>총안타</th>
          <th>1루타</th>
          <th>2루타</th>
          <th>3루타</th>
          <th>홈런</th>
          <th>루타</th>
          <th>타점</th>
          <th>도루</th>
          <th>도루자</th>
          <th>볼넷</th>
          <th>사구</th>
          <th>삼진</th>
          <th>병살</th>
        </tr>
      </thead>
      <tbody className={cn('text-center text-nowrap whitespace-nowrap')}>
        {Array.from(seasonStats.values()).map((stat) => (
          <tr
            key={stat.name}
            className={cn('')}
          >
            <td>{stat.name}</td>
            <td>{stat.avg.toFixed(3)}</td>
            <td>{stat.obp.toFixed(3)}</td>
            <td>{stat.slg.toFixed(3)}</td>
            <td>{stat.ops.toFixed(3)}</td>
            <td>{stat.games}</td>
            <td>{stat.pa}</td>
            <td>{stat.ab}</td>
            <td>{stat.run}</td>
            <td>{stat.hit}</td>
            <td>{stat.oneBaseHit}</td>
            <td>{stat.twoBaseHit}</td>
            <td>{stat.threeBaseHit}</td>
            <td>{stat.hr}</td>
            <td>{stat.tb}</td>
            <td>{stat.rbi}</td>
            <td>{stat.sb}</td>
            <td>{stat.cs}</td>
            <td>{stat.bb}</td>
            <td>{stat.hbp}</td>
            <td>{stat.so}</td>
            <td>{stat.gdp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SeasonStatTable;