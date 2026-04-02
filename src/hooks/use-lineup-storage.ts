import type { ImageTransform, PlayerPosition, SavedLineup } from '@/types/lineup';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'numugas-lineups';

export interface LineupFormData {
  date: string;
  location: string;
  league: string;
  startingPitcher: string;
  startingPitcherNumber: string;
  manager: string;
  lineup: PlayerPosition[];
  playerImage: string | null;
  playerImageName: string;
  imageTransform: ImageTransform;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

export function useLineupStorage() {
  const [savedLineups, setSavedLineups] = useState<SavedLineup[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mount 시 localStorage에서 로드 (hydration-safe)
  useEffect(() => {
    setSavedLineups(readStorage<SavedLineup[]>(STORAGE_KEY, []));
    setIsLoaded(true);
  }, []);

  const saveLineup = useCallback(
    (data: LineupFormData, name?: string) => {
      const newEntry: SavedLineup = {
        id: crypto.randomUUID(),
        name: name || `라인업 ${new Date().toLocaleDateString('ko-KR')}`,
        savedAt: new Date().toISOString(),
        ...data,
      };
      const updated = [newEntry, ...savedLineups];
      setSavedLineups(updated);
      writeStorage(STORAGE_KEY, updated);
      return newEntry;
    },
    [savedLineups],
  );

  const deleteLineup = useCallback(
    (id: string) => {
      const updated = savedLineups.filter((l) => l.id !== id);
      setSavedLineups(updated);
      writeStorage(STORAGE_KEY, updated);
    },
    [savedLineups],
  );

  return { savedLineups, isLoaded, saveLineup, deleteLineup };
}
