import { cn } from '#/utils/cn';

function BatterStatTableHead() {
  return (
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
  );
}

export default BatterStatTableHead;
