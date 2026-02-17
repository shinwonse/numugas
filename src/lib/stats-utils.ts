import { calculateRankingsWithTies } from '@/lib/calculate-rankings-with-ties';
import type { Stat } from '@/types/stats';

interface CategoryConfig {
  category: string;
  key: string;
}

export function groupByField<T extends Record<string, any>>(
  data: T[],
  field: keyof T & string,
): Record<string, T[]> {
  return data.reduce<Record<string, T[]>>((acc, row) => {
    const key = row[field] as string;
    (acc[key] ??= []).push(row);
    return acc;
  }, {});
}

export function sumNumericFields(
  records: Record<string, any>[],
  fields: readonly string[],
): Record<string, number> {
  return Object.fromEntries(
    fields.map((field) => [
      field,
      records.reduce((sum, cur) => sum + Number(cur[field] ?? 0), 0),
    ]),
  );
}

export function extractTopPlayers(
  data: Record<string, any>[],
  categories: CategoryConfig[],
  getTeam?: (p: Record<string, any>) => string,
): Stat[] {
  return categories.map(({ category, key }) => {
    const getValue = (p: Record<string, any>) => Number(p[key]);
    const sort = (a: Record<string, any>, b: Record<string, any>) =>
      getValue(b) - getValue(a);

    const topPlayers = [...data]
      .filter((p) => getValue(p) > 0 && p.name)
      .sort(sort);

    let allPlayers = [...topPlayers];
    if (topPlayers.length < 3) {
      const pickedNames = new Set(topPlayers.map((p) => p.name));
      const fillers = [...data]
        .filter(
          (p) => getValue(p) === 0 && p.name && !pickedNames.has(p.name),
        )
        .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
        .slice(0, 3 - topPlayers.length);
      allPlayers.push(...fillers);
    }

    const playersWithValue = allPlayers.map((p) => ({
      name: p.name as string,
      team: getTeam?.(p) ?? '',
      value: getValue(p),
    }));

    const players = calculateRankingsWithTies(playersWithValue);
    return { category, players };
  });
}

export function createFallbackStats(categoryNames: string[]): Stat[] {
  return categoryNames.map((category) => ({
    category,
    players: [
      { rank: 1, name: '-', team: '', value: 0 },
      { rank: 2, name: '-', team: '', value: 0 },
      { rank: 3, name: '-', team: '', value: 0 },
    ],
  }));
}
