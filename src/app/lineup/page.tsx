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
import { Download } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
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
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">라인업 작성</h1>

        {/* 고정 레이아웃 */}
        <div className="flex gap-8 justify-center items-start overflow-x-auto">
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
          <Card className="p-6 flex-shrink-0" style={{ width: '500px' }}>
            <h2 className="text-xl font-semibold mb-4">라인업 정보</h2>

            {/* 날짜, 장소, 리그, 이미지 입력 */}
            <div className="space-y-4 mb-6 pb-6 border-b">
              <div>
                <Label htmlFor="date" className="mb-2 block">
                  날짜
                </Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="YYYY/MM/DD HH:MM"
                />
              </div>
              <div>
                <Label htmlFor="location" className="mb-2 block">
                  장소
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="경기 장소"
                />
              </div>
              <div>
                <Label htmlFor="league" className="mb-2 block">
                  리그 선택
                </Label>
                <Select value={league} onValueChange={setLeague}>
                  <SelectTrigger>
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
                <Label htmlFor="playerImage" className="mb-2 block">
                  대표 선수 사진
                </Label>
                <Input
                  id="playerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* 선발투수 입력 */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-lg font-semibold mb-3">선발투수</h3>
              <Input
                value={startingPitcher}
                onChange={(e) => setStartingPitcher(e.target.value)}
                placeholder="선발투수 이름"
              />
            </div>

            {/* 선수 입력 */}
            <h3 className="text-lg font-semibold mb-3">타자 라인업</h3>
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
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleReset}
                disabled={isExporting}
              >
                초기화
              </Button>
              <Button
                className="flex-1"
                onClick={handleDownloadImage}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? '생성 중...' : '이미지 다운로드'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
