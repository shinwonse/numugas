import { cn } from '#/utils/cn';

type Props = {
  stats?: any;
};

function PitcherStatTableBody({ stats }: Props) {
  return (
    <tbody className={cn('text-center text-nowrap whitespace-nowrap')}>
      {Array.from(stats.values()).map((stat: any) => (
        <tr key={stat.name}>
          <td>{stat.name}</td>
          <td>{!Number.isNaN(stat.era) ? stat.era.toFixed(2) : '99.99'}</td>
          <td>{stat.games}</td>
          <td>{stat.win}</td>
          <td>{stat.lose}</td>
          <td>{stat.save}</td>
          <td>{stat.hold}</td>
          <td>
            {!Number.isNaN(stat.winRate) ? stat.winRate.toFixed(3) : '0.000'}
          </td>
          <td>{stat.ab}</td>
          <td>{stat.pitch}</td>
          <td>{stat.inning}</td>
          <td>{stat.hit}</td>
          <td>{stat.hr}</td>
          <td>{stat.bb}</td>
          <td>{stat.hbp}</td>
          <td>{stat.so}</td>
          <td>{stat.runs}</td>
          <td>{stat.earnedRuns}</td>
        </tr>
      ))}
    </tbody>
  );
}

export default PitcherStatTableBody;
