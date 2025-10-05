'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { LineupPreview } from './lineup-preview';

interface PlayerPosition {
  position: string;
  name: string;
  battingOrder: number;
}

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

export default function LineupPage() {
  const [lineup, setLineup] = useState<PlayerPosition[]>([
    { position: '', name: '', battingOrder: 1 },
    { position: '', name: '', battingOrder: 2 },
    { position: '', name: '', battingOrder: 3 },
    { position: '', name: '', battingOrder: 4 },
    { position: '', name: '', battingOrder: 5 },
    { position: '', name: '', battingOrder: 6 },
    { position: '', name: '', battingOrder: 7 },
    { position: '', name: '', battingOrder: 8 },
    { position: '', name: '', battingOrder: 9 },
  ]);

  const handlePositionChange = (index: number, position: string) => {
    const newLineup = [...lineup];
    newLineup[index].position = position;
    setLineup(newLineup);
  };

  const handleNameChange = (index: number, name: string) => {
    const newLineup = [...lineup];
    newLineup[index].name = name;
    setLineup(newLineup);
  };

  const handleReset = () => {
    setLineup(
      Array.from({ length: 9 }, (_, i) => ({
        position: '',
        name: '',
        battingOrder: i + 1,
      })),
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">라인업 작성</h1>

      {/* Mobile: 세로 배치, PC: 가로 배치 */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
        {/* 라인업 미리보기 */}
        <LineupPreview lineup={lineup} />

        {/* 라인업 입력 폼 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">선수 입력</h2>
          <div className="space-y-3">
            {lineup.map((player, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <Label className="font-bold text-lg w-8">
                  {player.battingOrder}
                </Label>
                <div className="flex-1 flex gap-3">
                  <Select
                    value={player.position}
                    onValueChange={(value) =>
                      handlePositionChange(index, value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="포지션" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={player.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder="선수 이름"
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button className="flex-1" variant="outline" onClick={handleReset}>
              초기화
            </Button>
            <Button className="flex-1">저장</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
