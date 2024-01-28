import { cn } from '#/utils/cn';

type Props = {
  stats?: any;
};

function BatterStatTableBody({ stats }: Props) {
  return (
    <tbody className={cn('text-center text-nowrap whitespace-nowrap')}>
      {Array.from(stats.values()).map((stat: any) => (
        <tr key={stat.name}>
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
  );
}

export default BatterStatTableBody;
