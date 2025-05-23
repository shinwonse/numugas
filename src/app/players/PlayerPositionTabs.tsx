'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  photo: string;
  stats: Record<string, number>;
}

interface PlayerPositionTabsProps {
  positions: string[];
  players: Player[];
}

export default function PlayerPositionTabs({
  positions,
  players,
}: PlayerPositionTabsProps) {
  const [selectedPosition, setSelectedPosition] = useState(positions[0]);
  const filteredPlayers = players.filter(
    (p) => p.position === selectedPosition,
  );

  return (
    <>
      <Tabs
        value={selectedPosition}
        onValueChange={setSelectedPosition}
        className="mb-10 flex flex-col items-center"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-2">
          {positions.map((pos) => (
            <TabsTrigger key={pos} value={pos} className="text-lg py-2">
              {pos}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
        {filteredPlayers.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">
            해당 포지션의 선수가 없습니다.
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <Card
              key={player.id}
              className="bg-black/70 border-white/10 hover:border-red-500 transition-all duration-300 shadow-lg shadow-red-500/10"
            >
              <CardHeader className="flex flex-col items-center gap-2 bg-transparent pb-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-red-600 mb-2">
                  <Image
                    src={player.photo}
                    alt={player.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardTitle className="text-xl text-center">
                  {player.name}
                </CardTitle>
                <div className="text-sm text-gray-400">
                  #{player.number} | {player.position}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {Object.entries(player.stats).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="text-gray-400 font-medium">
                          {key}
                        </TableCell>
                        <TableCell className="text-right text-red-500 font-bold">
                          {typeof value === 'number' ? value : value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
