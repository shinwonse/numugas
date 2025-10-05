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
  startingPitcher?: string;
  date?: string;
  location?: string;
}

export function LineupPreview({
  lineup,
  playerImage,
  startingPitcher,
  date,
  location,
}: LineupPreviewProps) {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full">
        <Card className="overflow-hidden p-0 w-full aspect-[9/16] relative">
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/background.png)' }}
          />
          <div className="relative h-full z-10">
            {/* 선수 이미지 영역 - 전체 배경 */}
            <div className="absolute inset-0 z-10">
              {playerImage ? (
                <TransformWrapper
                  initialScale={1}
                  minScale={0.1}
                  maxScale={4}
                  centerOnInit={false}
                  limitToBounds={false}
                  alignmentAnimation={{ disabled: true }}
                  wheel={{ smoothStep: 0.01 }}
                  panning={{ disabled: false }}
                >
                  <TransformComponent
                    wrapperClass="!w-full !h-full absolute inset-0"
                    contentClass="!w-full !h-full flex items-center justify-center"
                  >
                    <img
                      src={playerImage}
                      alt="대표 선수"
                      className="max-w-none h-full object-contain"
                    />
                  </TransformComponent>
                </TransformWrapper>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400/30 text-6xl font-bold">
                    NO IMAGE
                  </div>
                </div>
              )}
            </div>

            {/* STARTING LINEUP 타이틀 */}
            <div className="absolute top-20 left-6 z-30">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                STARTING
                <br /> LINEUP
              </h2>
            </div>

            {/* 우측 영역 - 라인업 리스트 */}
            <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-black/80 p-4 sm:p-5 md:p-6 flex flex-col z-20">
              {/* 팀 로고 */}
              <div className="flex items-center justify-center mb-4 pt-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
                  <img
                    src="/logo.png"
                    alt="Team Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 경기 정보 */}
              <div className="text-center space-y-1 mb-6">
                <p className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl">
                  {date || '날짜'}
                </p>
                <p className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                  {location || '장소'}
                </p>
              </div>

              {/* 선수 목록 */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  {/* 선발투수 */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 py-1.5 sm:py-2 md:py-2.5 border-b border-slate-800">
                    <span className="text-red-400 font-extrabold text-sm sm:text-base md:text-lg w-10 sm:w-12">
                      SP
                    </span>
                    <span className="text-white font-extrabold text-lg sm:text-xl md:text-2xl flex-1 truncate text-right">
                      {startingPitcher || '선수 이름'}
                    </span>
                  </div>
                  {/* 타자 라인업 */}
                  {lineup.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 sm:gap-3 py-1.5 sm:py-2 md:py-2.5 border-b border-slate-800 last:border-b-0"
                    >
                      <span className="text-red-400 font-extrabold text-sm sm:text-base md:text-lg w-10 sm:w-12">
                        {player.position || '-'}
                      </span>
                      <span className="text-white font-extrabold text-lg sm:text-xl md:text-2xl flex-1 truncate text-right">
                        {player.name || '선수 이름'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 하단 띠 영역 */}
            <div className="absolute bottom-10 left-0 right-0 z-30 gap-4 flex flex-col">
              {/* 첫 번째 띠 */}
              <div className="h-8 bg-gray-700 flex items-center justify-center overflow-hidden">
                <p className="text-white text-[10px] sm:text-xs font-bold tracking-widest whitespace-nowrap">
                  DAMJANG NUMUGAS BASEBALL CLUB • DAMJANG NUMUGAS BASEBALL CLUB
                  • DAMJANG NUMUGAS BASEBALL CLUB
                </p>
              </div>
              {/* 두 번째 띠 */}
              <div className="h-8 bg-gray-600 flex items-center justify-center overflow-hidden">
                <p className="text-white text-[10px] sm:text-xs font-bold tracking-widest whitespace-nowrap">
                  DAMJANG NUMUGAS BASEBALL CLUB • DAMJANG NUMUGAS BASEBALL CLUB
                  • DAMJANG NUMUGAS BASEBALL CLUB
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
