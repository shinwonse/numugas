'use client';

import { Card } from '@/components/ui/card';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface PlayerPosition {
  position: string;
  name: string;
  battingOrder: number;
}

interface LineupPreviewProps {
  lineup: PlayerPosition[];
  playerImage: string | null;
}

export function LineupPreview({ lineup, playerImage }: LineupPreviewProps) {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-[450px]">
        <Card className="overflow-hidden p-0 bg-slate-900 w-full aspect-[9/16]">
          <div className="flex h-full">
            {/* 좌측 영역 - 선수 이미지 영역 */}
            <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
              {playerImage ? (
                <TransformWrapper
                  initialScale={1}
                  minScale={0.3}
                  maxScale={4}
                  centerOnInit
                  wheel={{ smoothStep: 0.01 }}
                >
                  <TransformComponent
                    wrapperClass="!w-full !h-full absolute inset-0"
                    contentClass="!w-full !h-full"
                  >
                    <img
                      src={playerImage}
                      alt="대표 선수"
                      className="w-full h-full object-cover"
                      style={{ minWidth: '100%', minHeight: '100%' }}
                    />
                  </TransformComponent>
                </TransformWrapper>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
                      STARTING
                    </h2>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400">
                      LINEUP
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* 우측 영역 - 라인업 리스트 */}
            <div className="w-[45%] bg-slate-950/50 p-3 sm:p-4 md:p-5 flex flex-col justify-center">
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                {lineup.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 md:py-2.5 border-b border-slate-800 last:border-b-0"
                  >
                    <span className="text-cyan-400 font-semibold text-xs sm:text-sm w-8 sm:w-10">
                      {player.position || '-'}
                    </span>
                    <span className="text-white font-bold text-sm sm:text-base md:text-lg flex-1 truncate">
                      {player.name || '선수 이름'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
