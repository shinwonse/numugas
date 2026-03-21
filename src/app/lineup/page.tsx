'use client';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLineupRecommend } from '@/hooks/use-lineup-recommend';
import { useIsMobile } from '@/hooks/use-mobile';
import type { LineupRecommendResponse } from '@/types/lineup';
import { cn } from '@/lib/cn';
import {
  ChevronDown,
  Download,
  Home,
  Image as ImageIcon,
  Loader2,
  Monitor,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ImageTransform, LineupPreview } from './lineup-preview';

interface PlayerPosition {
  position: string;
  name: string;
  number: string;
  battingOrder: number;
}

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];

  return `${month}/${day}(${weekday}) ${hours}:${minutes}`;
};

// Glass input style
const glassInput = cn(
  'bg-white/[0.04] backdrop-blur-xl',
  'border-white/[0.06] hover:border-white/[0.12] focus:border-red-500/40',
  'rounded-xl transition-colors duration-200 text-white',
);

// Glass select trigger style
const glassSelect = cn(
  'bg-white/[0.04] backdrop-blur-xl',
  'border-white/[0.06] hover:border-white/[0.12]',
  'rounded-xl transition-colors duration-200 text-white cursor-pointer',
);

export default function LineupPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [league, setLeague] = useState('');
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [playerImageName, setPlayerImageName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [startingPitcher, setStartingPitcher] = useState('');
  const [startingPitcherNumber, setStartingPitcherNumber] = useState('');
  const [manager, setManager] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });
  const [lineup, setLineup] = useState<PlayerPosition[]>([
    { position: '', name: '', number: '', battingOrder: 1 },
    { position: '', name: '', number: '', battingOrder: 2 },
    { position: '', name: '', number: '', battingOrder: 3 },
    { position: '', name: '', number: '', battingOrder: 4 },
    { position: '', name: '', number: '', battingOrder: 5 },
    { position: '', name: '', number: '', battingOrder: 6 },
    { position: '', name: '', number: '', battingOrder: 7 },
    { position: '', name: '', number: '', battingOrder: 8 },
    { position: '', name: '', number: '', battingOrder: 9 },
  ]);
  const [aiReasoning, setAiReasoning] = useState<LineupRecommendResponse | null>(null);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const lineupMutation = useLineupRecommend();

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

  const handleNumberChange = (index: number, number: string) => {
    const newLineup = [...lineup];
    newLineup[index].number = number;
    setLineup(newLineup);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlayerImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPlayerImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPlayerImage(null);
    setPlayerImageName('');
    setImageTransform({ scale: 1, positionX: 0, positionY: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setDate('');
    setLocation('');
    setLeague('');
    setPlayerImage(null);
    setPlayerImageName('');
    setStartingPitcher('');
    setStartingPitcherNumber('');
    setManager('');
    setImageTransform({ scale: 1, positionX: 0, positionY: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLineup(
      Array.from({ length: 9 }, (_, i) => ({
        position: '',
        name: '',
        number: '',
        battingOrder: i + 1,
      })),
    );
  };

  const handleDownloadImage = async () => {
    setIsExporting(true);

    try {
      // Export용 컴포넌트가 렌더링되고 ref가 연결될 때까지 기다리기
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!previewRef.current) {
        throw new Error('미리보기 요소를 찾을 수 없습니다.');
      }

      // 폰트가 로드될 때까지 기다리기
      await document.fonts.ready;

      // 렌더링 완료 보장
      await new Promise((resolve) => setTimeout(resolve, 300));

      // modern-screenshot을 사용하여 이미지 생성
      const dataUrl = await domToPng(previewRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        filter: (node) => {
          // TransformWrapper 관련 요소 제외
          if (
            node instanceof Element &&
            (node.classList?.contains('react-transform-wrapper') ||
              node.classList?.contains('react-transform-component'))
          ) {
            return false;
          }
          return true;
        },
      });

      const link = document.createElement('a');
      const timestamp = new Date()
        .toISOString()
        .slice(0, 16)
        .replace(/:/g, '-');
      link.download = `lineup-${timestamp}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('이미지 다운로드 중 오류가 발생했습니다:', error);
      alert('이미지 다운로드에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAIRecommend = () => {
    lineupMutation.mutate(undefined, {
      onSuccess: (data) => {
        setLineup(
          data.lineup.map((p) => ({
            battingOrder: p.battingOrder,
            position: '',
            name: p.name,
            number: p.number,
          })),
        );
        setStartingPitcher(data.startingPitcher.name);
        setStartingPitcherNumber(data.startingPitcher.number);
        setAiReasoning(data);
        setIsReasoningOpen(true);
      },
    });
  };

  return (
    <>
      <main className="relative min-h-screen text-white overflow-hidden">
        {/* Apple-style mesh gradient orbs */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-[30%] -left-[20%] h-[70vh] w-[70vh] rounded-full bg-red-600/15 blur-[120px]" />
          <div className="absolute top-[20%] -right-[15%] h-[50vh] w-[50vh] rounded-full bg-rose-500/10 blur-[100px]" />
          <div className="absolute -bottom-[20%] left-[30%] h-[60vh] w-[60vh] rounded-full bg-red-900/10 blur-[120px]" />
        </div>

        {/* Subtle noise texture overlay */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-4 pt-24 pb-16 md:pt-28 md:pb-20">
          {/* Header Section */}
          <div className="text-center mb-10 md:mb-14">
            {/* Glass badge */}
            <div
              className="mb-5 inline-flex"
              style={{ animation: 'fade-in-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                Lineup Generator
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 font-display tracking-tight"
              style={{ animation: 'fade-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both' }}
            >
              <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
                라인업{' '}
              </span>
              <span className="bg-gradient-to-b from-red-400 to-red-600 bg-clip-text text-transparent">
                작성
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm md:text-base text-gray-500 mb-8"
              style={{ animation: 'fade-in-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s both' }}
            >
              라인업을 작성하고 이미지로 저장하세요
            </p>

            {/* Decorative line */}
            <div
              className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
              style={{ animation: 'scale-in-x 0.8s ease 0.25s both' }}
            />
          </div>

          {/* 고정 레이아웃 */}
          <div
            className={`flex gap-8 justify-center items-start overflow-x-auto ${
              isMobile ? 'blur-sm pointer-events-none select-none' : ''
            }`}
            style={{ animation: 'fade-in-up 0.7s ease 0.3s both' }}
          >
            {/* 편집용 미리보기 (항상 표시) */}
            <div className="flex-shrink-0">
              <LineupPreview
                lineup={lineup}
                playerImage={playerImage}
                startingPitcher={startingPitcher}
                startingPitcherNumber={startingPitcherNumber}
                manager={manager}
                date={formatDate(date)}
                location={location}
                league={league}
                disableTransform={false}
                isExporting={false}
                imageTransform={imageTransform}
                onTransformChange={setImageTransform}
              />
            </div>

            {/* Export용 미리보기 (화면 밖, export 시에만 렌더링) */}
            {isExporting && (
              <div
                style={{
                  position: 'fixed',
                  left: '-9999px',
                  top: '0',
                }}
              >
                <LineupPreview
                  ref={previewRef}
                  lineup={lineup}
                  playerImage={playerImage}
                  startingPitcher={startingPitcher}
                  startingPitcherNumber={startingPitcherNumber}
                  manager={manager}
                  date={formatDate(date)}
                  location={location}
                  league={league}
                  disableTransform={true}
                  isExporting={true}
                  imageTransform={imageTransform}
                />
              </div>
            )}

            {/* 라인업 입력 폼 */}
            <div
              className={cn(
                'flex-shrink-0 p-6',
                'rounded-2xl',
                'bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150',
                'border border-white/[0.06]',
                'shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]',
              )}
              style={{ width: '500px' }}
            >
              <h2 className="text-lg font-bold mb-5 text-white">
                라인업 정보
              </h2>

              {/* AI 라인업 추천 버튼 */}
              <div className="mb-6 pb-6 border-b border-white/[0.06]">
                <Button
                  onClick={handleAIRecommend}
                  disabled={lineupMutation.isPending}
                  className={cn(
                    'w-full cursor-pointer',
                    'bg-gradient-to-r from-violet-600 to-purple-600',
                    'hover:from-violet-500 hover:to-purple-500',
                    'transition-all duration-200 text-white font-semibold',
                    'shadow-[0_4px_16px_rgba(139,92,246,0.3)]',
                    'hover:shadow-[0_4px_24px_rgba(139,92,246,0.4)]',
                  )}
                  size="lg"
                >
                  {lineupMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI 분석 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI 라인업 추천
                    </>
                  )}
                </Button>

                {lineupMutation.isError && (
                  <p className="mt-2 text-xs text-red-400">
                    {lineupMutation.error?.message || 'AI 추천에 실패했습니다.'}
                  </p>
                )}

                {/* AI 추천 이유 패널 */}
                {aiReasoning && (
                  <Collapsible
                    open={isReasoningOpen}
                    onOpenChange={setIsReasoningOpen}
                    className="mt-3"
                  >
                    <CollapsibleTrigger
                      className={cn(
                        'flex items-center justify-between w-full px-4 py-2.5',
                        'rounded-xl text-sm font-medium',
                        'bg-violet-500/10 border border-violet-500/20',
                        'hover:bg-violet-500/15 transition-colors duration-200',
                        'text-violet-300 cursor-pointer',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI 추천 이유 ({aiReasoning.seasonUsed} 시즌 기준)
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isReasoningOpen && 'rotate-180',
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div
                        className={cn(
                          'mt-2 p-4 rounded-xl text-sm leading-relaxed',
                          'bg-white/[0.02] border border-white/[0.06]',
                          'text-gray-400',
                        )}
                      >
                        <p className="text-gray-300 font-medium mb-3">
                          {aiReasoning.overallReasoning}
                        </p>
                        <div className="space-y-2">
                          {aiReasoning.lineup.map((player) => (
                            <div
                              key={player.battingOrder}
                              className="flex gap-2 text-xs"
                            >
                              <span className="text-violet-400 font-mono font-bold shrink-0">
                                {player.battingOrder}번
                              </span>
                              <span className="text-gray-500">
                                {player.name} — {player.reasoning}
                              </span>
                            </div>
                          ))}
                          <div className="flex gap-2 text-xs pt-2 border-t border-white/[0.06]">
                            <span className="text-violet-400 font-mono font-bold shrink-0">
                              SP
                            </span>
                            <span className="text-gray-500">
                              {aiReasoning.startingPitcher.name} — {aiReasoning.startingPitcher.reasoning}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>

              {/* 날짜, 장소, 리그, 이미지 입력 */}
              <div className="space-y-4 mb-6 pb-6 border-b border-white/[0.06]">
                <div>
                  <Label htmlFor="date" className="mb-2 block text-sm text-gray-400">
                    날짜
                  </Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="YYYY/MM/DD HH:MM"
                    className={glassInput}
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="mb-2 block text-sm text-gray-400">
                    장소
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="경기 장소"
                    className={glassInput}
                  />
                </div>
                <div>
                  <Label htmlFor="league" className="mb-2 block text-sm text-gray-400">
                    리그 선택
                  </Label>
                  <Select value={league} onValueChange={setLeague}>
                    <SelectTrigger className={glassSelect}>
                      <SelectValue placeholder="리그를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecoking">에코킹리그</SelectItem>
                      <SelectItem value="jungnang">중랑리그</SelectItem>
                      <SelectItem value="nowon">노원구청장기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-3 block text-sm font-semibold text-gray-400">
                    대표 선수 사진
                  </Label>

                  {/* 이미지 미리보기 또는 업로드 영역 */}
                  {playerImage ? (
                    <div className="relative group">
                      <div
                        className={cn(
                          'relative h-48 rounded-xl overflow-hidden',
                          'bg-white/[0.04] border border-white/[0.06]',
                        )}
                      >
                        <img
                          src={playerImage}
                          alt="선수 사진 미리보기"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="bg-red-500 hover:bg-red-600 cursor-pointer"
                          >
                            <X className="w-4 h-4 mr-2" />
                            제거
                          </Button>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-600 truncate">
                        {playerImageName}
                      </p>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'relative h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors duration-200',
                        isDragging
                          ? 'border-red-500/50 bg-red-500/5'
                          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]',
                      )}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
                        <div className="p-3 rounded-full bg-white/[0.06]">
                          {isDragging ? (
                            <Upload className="w-6 h-6 text-red-400" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-1">
                            {isDragging
                              ? '이미지를 놓으세요'
                              : '클릭하거나 드래그하여 업로드'}
                          </p>
                          <p className="text-xs text-gray-600">
                            PNG, JPG, GIF 등 (최대 10MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 숨겨진 파일 인풋 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* 선발투수 & 감독 입력 */}
              <div className="mb-6 pb-6 border-b border-white/[0.06] space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-300">
                    선발투수
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={startingPitcher}
                      onChange={(e) => setStartingPitcher(e.target.value)}
                      placeholder="이름"
                      className={cn(glassInput, 'flex-1')}
                    />
                    <Input
                      value={startingPitcherNumber}
                      onChange={(e) => setStartingPitcherNumber(e.target.value)}
                      placeholder="등번호"
                      className={cn(glassInput, 'w-20')}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-300">
                    감독
                  </h3>
                  <Input
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="감독 이름"
                    className={glassInput}
                  />
                </div>
              </div>

              {/* 선수 입력 */}
              <h3 className="text-sm font-semibold mb-3 text-gray-300">
                타자 라인업
              </h3>
              <div className="space-y-2">
                {lineup.map((player, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-3 p-2.5',
                      'border border-white/[0.04] rounded-xl',
                      'bg-white/[0.02]',
                      'hover:bg-white/[0.04] transition-colors duration-150',
                    )}
                  >
                    <span className="font-bold text-base w-7 text-center text-red-500 font-mono">
                      {player.battingOrder}
                    </span>
                    <div className="flex-1 flex gap-2">
                      <Select
                        value={player.position}
                        onValueChange={(value) =>
                          handlePositionChange(index, value)
                        }
                      >
                        <SelectTrigger className={cn(glassSelect, 'w-[110px] h-9 text-sm')}>
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
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                        placeholder="이름"
                        className={cn(glassInput, 'flex-1 h-9 text-sm')}
                      />
                      <Input
                        value={player.number}
                        onChange={(e) =>
                          handleNumberChange(index, e.target.value)
                        }
                        placeholder="No."
                        className={cn(glassInput, 'w-16 h-9 text-sm text-center')}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  className={cn(
                    'flex-1 cursor-pointer',
                    'bg-white/[0.04] border border-white/[0.06]',
                    'hover:bg-white/[0.08]',
                    'transition-colors duration-200 text-gray-300',
                  )}
                  variant="outline"
                  onClick={handleReset}
                  disabled={isExporting}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white cursor-pointer"
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? '생성 중...' : '이미지 다운로드'}
                </Button>
              </div>
            </div>
          </div>

          {/* 모바일 안내 메시지 */}
          {isMobile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div
                className={cn(
                  'max-w-md p-8 text-center space-y-4',
                  'rounded-2xl',
                  'bg-white/[0.04] backdrop-blur-2xl',
                  'border border-white/[0.08]',
                  'shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
                )}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/[0.06] rounded-full">
                    <Monitor className="w-12 h-12 text-red-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  데스크톱에서 이용해주세요
                </h2>
                <p className="text-gray-400 text-sm">
                  라인업 작성 기능은 더 나은 경험을 위해
                  <br />
                  데스크톱 환경에서만 지원됩니다.
                </p>
                <p className="text-xs text-gray-600">
                  PC 또는 태블릿의 가로 모드로 접속해주세요.
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 transition-colors text-white cursor-pointer"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
