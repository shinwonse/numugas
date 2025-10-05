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
}

export const LineupPreview = forwardRef<HTMLDivElement, LineupPreviewProps>(
  function LineupPreview(
    { lineup, playerImage, startingPitcher, date, location, league },
    ref,
  ) {
    const leagueText = (() => {
      if (league === 'ecoking') return 'ECOKING LEAGUE';
      if (league === 'jungnang') return 'JUNGNANG LEAGUE';
      if (league === 'nowon') return 'NOWON TOURNAMENT';
      return null;
    })();
    return (
      <div className="flex justify-center w-full">
        <Card
          ref={ref}
          data-export-target
          className="overflow-hidden p-0 w-full aspect-[9/16] relative"
        >
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/background.png)' }}
          />
          <div className="relative h-full z-10">
            {/* 선수 이미지 영역 - 전체 배경 */}
            <div className="absolute inset-0 z-10">
              {playerImage && (
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
            </div>

            {/* 리그 텍스트 & STARTING LINEUP 타이틀 */}
            <div className="absolute top-16 left-6 z-30">
              {leagueText && (
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-2">
                  {leagueText}
                </p>
              )}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                STARTING
                <br /> LINEUP
              </h2>
            </div>

            {/* 우측 영역 - 라인업 리스트 */}
            <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-black/80 p-4 sm:p-5 md:p-6 flex flex-col z-20">
              {/* 팀 로고 */}
              <div className="flex items-center justify-center mb-8 pt-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
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
                  className="text-gray-400 font-bold text-lg sm:text-xl md:text-2xl"
                  style={{ lineHeight: '1.2' }}
                >
                  {date || '날짜'}
                </p>
                <p
                  className="text-gray-400 font-medium text-lg sm:text-xl md:text-2xl"
                  style={{ lineHeight: '1.2' }}
                >
                  {location || '장소'}
                </p>
              </div>

              {/* 선수 목록 */}
              <div className="flex-1 flex flex-col justify-start overflow-y-auto">
                <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                  {/* 선발투수 */}
                  <div
                    className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 rounded-sm px-3 sm:px-4 shadow-lg border-l-4 border-l-gray-400 backdrop-blur-sm"
                    style={{ padding: '12px 16px' }}
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <span
                        className="text-gray-400 font-extrabold text-xl sm:text-2xl md:text-3xl w-10 sm:w-12 shrink-0"
                        style={{
                          lineHeight: '1',
                          verticalAlign: 'middle',
                          display: 'inline-block',
                        }}
                      >
                        SP
                      </span>
                      <span
                        className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl flex-1 text-right break-words"
                        style={{
                          lineHeight: '1',
                          verticalAlign: 'middle',
                          display: 'inline-block',
                        }}
                      >
                        {startingPitcher || '선수 이름'}
                      </span>
                    </div>
                  </div>
                  {/* 타자 라인업 */}
                  {lineup.map((player, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 rounded-sm px-3 sm:px-4 shadow-lg border-l-4 border-l-red-700 backdrop-blur-sm hover:border-l-red-400 transition-all duration-200"
                      style={{ padding: '12px 16px' }}
                    >
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <span
                          className="text-red-700 font-extrabold text-xl sm:text-2xl md:text-3xl w-10 sm:w-12 shrink-0"
                          style={{
                            lineHeight: '1',
                            verticalAlign: 'middle',
                            display: 'inline-block',
                          }}
                        >
                          {player.position || '-'}
                        </span>
                        <span
                          className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl flex-1 text-right break-words"
                          style={{
                            lineHeight: '1',
                            verticalAlign: 'middle',
                            display: 'inline-block',
                          }}
                        >
                          {player.name || '선수 이름'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* 감독 정보 */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p
                      className="text-white/70 text-xl sm:text-2xl md:text-3xl font-bold text-right"
                      style={{ lineHeight: '1.2' }}
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
              <div className="h-8 bg-black/70 flex items-center justify-start overflow-hidden">
                <p className="text-white text-[10px] sm:text-xs font-bold tracking-widest whitespace-nowrap">
                  NUMUGAS BASEBALL CLUB • DAMJANG NUMUGAS BASEBALL CLUB •
                  DAMJANG NUMUGAS BASEBALL CLUB
                </p>
              </div>
              {/* 두 번째 띠 */}
              <div className="h-8 bg-black/70 flex items-center justify-start overflow-hidden">
                <p className="text-white text-[10px] sm:text-xs font-bold tracking-widest whitespace-nowrap">
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
