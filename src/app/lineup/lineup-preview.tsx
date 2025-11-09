'use client';

import { Card } from '@/components/ui/card';
import { forwardRef } from 'react';
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
  league?: string;
  disableTransform?: boolean;
  isExporting?: boolean;
}

export const LineupPreview = forwardRef<HTMLDivElement, LineupPreviewProps>(
  function LineupPreview(
    {
      lineup,
      playerImage,
      startingPitcher,
      date,
      location,
      league,
      disableTransform = false,
      isExporting = false,
    },
    ref,
  ) {
    const leagueText = (() => {
      if (league === 'ecoking') return 'ECOKING LEAGUE';
      if (league === 'jungnang') return 'JUNGNANG LEAGUE';
      if (league === 'nowon') return 'NOWON TOURNAMENT';
      return null;
    })();

    const WIDTH = 1080;
    const HEIGHT = 1920;
    const SCALE = isExporting ? 1 : 0.5;

    return (
      <div
        style={{
          width: `${WIDTH * SCALE}px`,
          height: `${HEIGHT * SCALE}px`,
        }}
      >
        <Card
          ref={ref}
          data-export-target
          className="overflow-hidden p-0 relative"
          style={{
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
          }}
        >
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/background.png)' }}
          />
          <div className="relative h-full z-10">
            {/* 선수 이미지 영역 - 전체 배경 */}
            <div className="absolute inset-0 z-10">
              {playerImage && !disableTransform && (
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
              )}
              {playerImage && disableTransform && (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={playerImage}
                    alt="대표 선수"
                    className="max-w-none h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* 리그 텍스트 & STARTING LINEUP 타이틀 */}
            <div className="absolute top-40 left-6 z-30">
              {leagueText && (
                <p
                  className="font-bold text-2xl text-red-700 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-4"
                  style={{ fontSize: '3rem' }}
                >
                  {leagueText}
                </p>
              )}
              <h2
                className="font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                style={{ fontSize: '5.5rem', lineHeight: '1.1' }}
              >
                STARTING
                <br /> LINEUP
              </h2>
            </div>

            {/* 우측 영역 - 라인업 리스트 */}
            <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-black/80 p-6 flex flex-col z-20">
              {/* 팀 로고 */}
              <div className="flex items-center justify-center mb-8 pt-16">
                <div className="w-48 h-48 relative">
                  <img
                    src="/logo.png"
                    alt="Team Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 경기 정보 */}
              <div className="text-center space-y-3 mb-8">
                <p
                  className="text-gray-400 font-bold font-aggravo leading-tight"
                  style={{ fontSize: '2.5rem' }}
                >
                  {date || '날짜'}
                </p>
                <p
                  className="text-gray-400 font-medium font-aggravo leading-tight"
                  style={{ fontSize: '2.5rem' }}
                >
                  {location || '장소'}
                </p>
              </div>

              {/* 선수 목록 */}
              <div className="flex-1 flex flex-col justify-start overflow-y-auto">
                <div className="space-y-4">
                  {/* 선발투수 */}
                  <div
                    className="rounded-sm px-4 border-l-4 border-l-gray-400 backdrop-blur-sm"
                    style={{
                      padding: '24px 32px',
                      boxShadow:
                        '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-6">
                      <span
                        className="text-gray-400 font-extrabold w-24 shrink-0 font-aggravo leading-none inline-block align-middle"
                        style={{ fontSize: '2rem' }}
                      >
                        SP
                      </span>
                      <span
                        className="text-white font-extrabold flex-1 text-right break-words font-aggravo leading-none inline-block align-middle"
                        style={{ fontSize: '3rem' }}
                      >
                        {startingPitcher || '이름'}
                      </span>
                    </div>
                  </div>
                  {/* 타자 라인업 */}
                  {lineup.map((player, index) => (
                    <div
                      key={index}
                      className="rounded-sm px-4 border-l-4 border-l-red-700 backdrop-blur-sm hover:border-l-red-400 transition-all duration-200"
                      style={{
                        padding: '24px 32px',
                        boxShadow:
                          '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-6">
                        <span
                          className="text-red-700 font-extrabold w-24 shrink-0 font-aggravo leading-none inline-block align-middle"
                          style={{ fontSize: '2rem' }}
                        >
                          {player.position || '-'}
                        </span>
                        <span
                          className="text-white font-extrabold flex-1 text-right break-words font-aggravo leading-none inline-block align-middle"
                          style={{ fontSize: '3rem' }}
                        >
                          {player.name || '이름'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* 감독 정보 */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p
                      className="text-white/70 font-bold text-right font-aggravo leading-tight"
                      style={{ fontSize: '3rem' }}
                    >
                      감독 주형준
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 띠 영역 */}
            <div className="absolute bottom-10 left-0 right-0 z-30 gap-4 flex flex-col">
              {/* 첫 번째 띠 */}
              <div className="h-16 bg-black/70 flex items-center justify-start overflow-hidden">
                <p
                  className="text-white font-bold tracking-widest whitespace-nowrap"
                  style={{ fontSize: '1rem' }}
                >
                  NUMUGAS BASEBALL CLUB • DAMJANG NUMUGAS BASEBALL CLUB •
                  DAMJANG NUMUGAS BASEBALL CLUB • DAMJANG NUMUGAS BASEBALL CLUB
                </p>
              </div>
              {/* 두 번째 띠 */}
              <div className="h-16 bg-black/70 flex items-center justify-start overflow-hidden">
                <p
                  className="text-white font-bold tracking-widest whitespace-nowrap"
                  style={{ fontSize: '1rem' }}
                >
                  CLUB • DAMJANG NUMUGAS BASEBALL CLUB • DAMJANG NUMUGAS
                  BASEBALL CLUB • DAMJANG NUMUGAS BASEBALL CLUB
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  },
);
