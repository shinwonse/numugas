import { cn } from '#/utils/cn';

function PitcherStatTableHead() {
  return (
    <thead className={cn('text-center text-nowrap whitespace-nowrap')}>
      <tr>
        <th>이름</th>
        <th>방어율</th>
        <th>게임수</th>
        <th>승</th>
        <th>패</th>
        <th>세</th>
        <th>홀드</th>
        <th>승률</th>
        <th>타자</th>
        <th>투구수</th>
        <th>이닝</th>
        <th>피안타</th>
        <th>피홈런</th>
        <th>볼넷</th>
        <th>사구</th>
        <th>탈삼진</th>
        <th>실점</th>
        <th>자책점</th>
      </tr>
    </thead>
  );
}

export default PitcherStatTableHead;
