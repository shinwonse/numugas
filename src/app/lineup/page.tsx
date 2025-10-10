'use client';

import { SectionBackground } from '@/components/animated/section-background';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Download, Home, Monitor, RotateCcw } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { LineupPreview } from './lineup-preview';

interface PlayerPosition {
  position: string;
  name: string;
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

export default function LineupPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [league, setLeague] = useState('');
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [startingPitcher, setStartingPitcher] = useState('');
  const [isExporting, setIsExporting] = useState(false);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setDate('');
    setLocation('');
    setLeague('');
    setPlayerImage(null);
    setStartingPitcher('');
    setLineup(
      Array.from({ length: 9 }, (_, i) => ({
        position: '',
        name: '',
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

  return (
    <>
      <main className="relative min-h-screen bg-black text-white py-12 md:py-16 overflow-hidden">
        <SectionBackground variant="gradient" />

        <div className="relative z-10 px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-16 md:mb-20">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-red-500">
                LINEUP GENERATOR
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display text-white tracking-tight"
            >
              라인업 <span className="text-red-500">작성</span>
            </motion.h1>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto h-1 w-20 bg-gradient-to-r from-transparent via-red-500 to-transparent"
            />
          </div>

          {/* 고정 레이아웃 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={`flex gap-8 justify-center items-start overflow-x-auto ${
              isMobile ? 'blur-sm pointer-events-none select-none' : ''
            }`}
          >
            {/* 편집용 미리보기 (항상 표시) */}
            <div className="flex-shrink-0">
              <LineupPreview
                lineup={lineup}
                playerImage={playerImage}
                startingPitcher={startingPitcher}
                date={formatDate(date)}
                location={location}
                league={league}
                disableTransform={false}
                isExporting={false}
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
                  date={formatDate(date)}
                  location={location}
                  league={league}
                  disableTransform={true}
                  isExporting={true}
                />
              </div>
            )}

            {/* 라인업 입력 폼 */}
            <Card
              className="p-6 flex-shrink-0 bg-black/40 backdrop-blur-sm border-white/10 shadow-xl"
              style={{ width: '500px' }}
            >
              <h2 className="text-xl font-semibold mb-4 text-white">
                라인업 정보
              </h2>

              {/* 날짜, 장소, 리그, 이미지 입력 */}
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <Label htmlFor="date" className="mb-2 block text-gray-300">
                    날짜
                  </Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="YYYY/MM/DD HH:MM"
                    className="bg-black/60 border-white/10 hover:border-red-500/50 focus:border-red-500 transition-colors text-white"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="location"
                    className="mb-2 block text-gray-300"
                  >
                    장소
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="경기 장소"
                    className="bg-black/60 border-white/10 hover:border-red-500/50 focus:border-red-500 transition-colors text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="league" className="mb-2 block text-gray-300">
                    리그 선택
                  </Label>
                  <Select value={league} onValueChange={setLeague}>
                    <SelectTrigger className="bg-black/60 border-white/10 hover:border-red-500/50 transition-colors text-white">
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
                  <Label
                    htmlFor="playerImage"
                    className="mb-2 block text-gray-300"
                  >
                    대표 선수 사진
                  </Label>
                  <Input
                    id="playerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer bg-black/60 border-white/10 hover:border-red-500/50 transition-colors text-white file:bg-red-500/20 file:text-red-400 file:border-0 file:mr-4 file:py-2 file:px-4"
                  />
                </div>
              </div>

              {/* 선발투수 입력 */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-3 text-white">
                  선발투수
                </h3>
                <Input
                  value={startingPitcher}
                  onChange={(e) => setStartingPitcher(e.target.value)}
                  placeholder="선발투수 이름"
                  className="bg-black/60 border-white/10 hover:border-red-500/50 focus:border-red-500 transition-colors text-white"
                />
              </div>

              {/* 선수 입력 */}
              <h3 className="text-lg font-semibold mb-3 text-white">
                타자 라인업
              </h3>
              <div className="space-y-3">
                {lineup.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border border-white/10 rounded-lg bg-black/20 hover:border-red-500/30 transition-colors"
                  >
                    <Label className="font-bold text-lg w-8 text-red-500">
                      {player.battingOrder}
                    </Label>
                    <div className="flex-1 flex gap-3">
                      <Select
                        value={player.position}
                        onValueChange={(value) =>
                          handlePositionChange(index, value)
                        }
                      >
                        <SelectTrigger className="w-[120px] bg-black/60 border-white/10 hover:border-red-500/50 transition-colors text-white">
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
                        placeholder="선수 이름"
                        className="flex-1 bg-black/60 border-white/10 hover:border-red-500/50 focus:border-red-500 transition-colors text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1 bg-black/60 border-white/10 hover:border-red-500/50 hover:bg-red-500/10 transition-colors text-white"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isExporting}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white"
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? '생성 중...' : '이미지 다운로드'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* 모바일 안내 메시지 */}
          {isMobile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <Card className="max-w-md p-8 text-center space-y-4 bg-black/80 backdrop-blur-md border-white/20">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-500/10 rounded-full">
                    <Monitor className="w-12 h-12 text-red-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  데스크톱에서 이용해주세요
                </h2>
                <p className="text-gray-400">
                  라인업 작성 기능은 더 나은 경험을 위해
                  <br />
                  데스크톱 환경에서만 지원됩니다.
                </p>
                <p className="text-sm text-gray-500">
                  PC 또는 태블릿의 가로 모드로 접속해주세요.
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 transition-colors text-white"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
