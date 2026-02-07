'use client';

import { Card } from '@/components/ui/card';
import { forwardRef } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface PlayerPosition {
  position: string;
  name: string;
  battingOrder: number;
}

export interface ImageTransform {
  scale: number;
  positionX: number;
  positionY: number;
}

interface LineupPreviewProps {
  lineup: PlayerPosition[];
  playerImage: string | null;
  startingPitcher?: string;
  manager?: string;
  date?: string;
  location?: string;
  league?: string;
  disableTransform?: boolean;
  isExporting?: boolean;
  imageTransform?: ImageTransform;
  onTransformChange?: (transform: ImageTransform) => void;
}

export const LineupPreview = forwardRef<HTMLDivElement, LineupPreviewProps>(
  function LineupPreview(
    {
      lineup,
      playerImage,
      startingPitcher,
      manager,
      date,
      location,
      league,
      disableTransform = false,
      isExporting = false,
      imageTransform,
      onTransformChange,
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
          <div className="relative h-full z-10 flex flex-col">
            {/* 메인 컨텐츠 영역 */}
            <div className="flex-1 flex min-h-0">
              {/* 좌측 영역 (55%) - 라인업 정보 */}
              <div
                className="relative z-20 flex flex-col"
                style={{ width: '55%' }}
              >
                <div className="absolute inset-0 bg-black/85" />
                <div className="relative z-10 flex flex-col h-full px-12 pt-16" style={{ paddingBottom: '240px' }}>
                  {/* 팀 로고 */}
                  <div className="flex items-start mb-6">
                    <div className="w-32 h-32 relative">
                      <img
                        src="/logo.png"
                        alt="Team Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* STARTING LINEUP 타이틀 */}
                  <h2
                    className="font-bold text-white leading-none mb-6"
                    style={{ fontSize: '5rem' }}
                  >
                    STARTING
                    <br />
                    LINEUP
                  </h2>

                  {/* 리그명 */}
                  {leagueText && (
                    <p
                      className="font-bold text-red-600 mb-4"
                      style={{ fontSize: '2.2rem' }}
                    >
                      {leagueText}
                    </p>
                  )}

                  {/* 경기 정보 */}
                  <div className="mb-6">
                    <p
                      className="text-gray-400 font-bold font-aggravo leading-tight"
                      style={{ fontSize: '2rem' }}
                    >
                      {date || '날짜'} / {location || '장소'}
                    </p>
                  </div>

                  {/* 구분선 */}
                  <div className="w-full h-px bg-white/20 mb-6" />

                  {/* 선발투수 */}
                  <div
                    className="border-l-4 border-l-gray-400 mb-3"
                    style={{ padding: '16px 24px' }}
                  >
                    <div className="flex items-center gap-6">
                      <span
                        className="text-gray-400 font-extrabold w-20 shrink-0 font-aggravo leading-none"
                        style={{ fontSize: '1.8rem' }}
                      >
                        SP
                      </span>
                      <span
                        className="text-white font-extrabold flex-1 font-aggravo leading-none"
                        style={{ fontSize: '2.6rem' }}
                      >
                        {startingPitcher || '이름'}
                      </span>
                    </div>
                  </div>

                  {/* 구분선 */}
                  <div className="w-full h-px bg-white/20 mb-6" />

                  {/* 타자 라인업 + 감독 */}
                  <div className="flex-1 flex flex-col justify-between">
                    {/* 타자 목록 */}
                    <div className="flex flex-col space-y-7">
                      {lineup.map((player, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-l-red-700"
                          style={{ padding: '16px 24px' }}
                        >
                          <div className="flex items-center gap-6">
                            <span
                              className="text-red-700 font-extrabold w-20 shrink-0 font-aggravo leading-none"
                              style={{ fontSize: '1.8rem' }}
                            >
                              {player.position || '-'}
                            </span>
                            <span
                              className="text-white font-extrabold flex-1 font-aggravo leading-none"
                              style={{ fontSize: '2.6rem' }}
                            >
                              {player.name || '이름'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 감독 정보 */}
                    <div className="pt-8 border-t border-white/20">
                      <p
                        className="text-white/70 font-bold font-aggravo leading-tight"
                        style={{ fontSize: '2.4rem' }}
                      >
                        감독 {manager || ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 선수 이미지 - 전체 캔버스에 자유 배치 (라인업 위, 띠 배너 아래) */}
            <div className="absolute inset-0 z-[25]">
              {playerImage && !disableTransform && (
                <TransformWrapper
                  initialScale={imageTransform?.scale ?? 1}
                  initialPositionX={imageTransform?.positionX ?? 0}
                  initialPositionY={imageTransform?.positionY ?? 0}
                  minScale={0.1}
                  maxScale={4}
                  centerOnInit={false}
                  limitToBounds={false}
                  alignmentAnimation={{ disabled: true }}
                  wheel={{ smoothStep: 0.01 }}
                  panning={{ disabled: false }}
                  onTransformed={(ref) => {
                    if (onTransformChange) {
                      onTransformChange({
                        scale: ref.state.scale,
                        positionX: ref.state.positionX,
                        positionY: ref.state.positionY,
                      });
                    }
                  }}
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
              {playerImage && disableTransform && imageTransform && (
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <div
                    style={{
                      transform: `translate(${imageTransform.positionX}px, ${imageTransform.positionY}px) scale(${imageTransform.scale})`,
                      transformOrigin: '0 0',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={playerImage}
                      alt="대표 선수"
                      className="max-w-none h-full object-contain"
                    />
                  </div>
                </div>
              )}
              {playerImage && disableTransform && !imageTransform && (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={playerImage}
                    alt="대표 선수"
                    className="max-w-none h-full object-contain"
                  />
                </div>
              )}
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
