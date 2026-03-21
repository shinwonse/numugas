'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { Calendar, Clock, MapPin } from 'lucide-react';

const upcomingGames = [
  {
    id: 1,
    opponent: '블루 타이거즈',
    date: '2023년 8월 15일',
    time: '오후 6:30',
    location: '레드 드래곤즈 스타디움',
    isHome: true,
  },
  {
    id: 2,
    opponent: '그린 이글스',
    date: '2023년 8월 18일',
    time: '오후 5:00',
    location: '이글스 파크',
    isHome: false,
  },
  {
    id: 3,
    opponent: '골든 라이온즈',
    date: '2023년 8월 20일',
    time: '오후 2:00',
    location: '라이온즈 필드',
    isHome: false,
  },
  {
    id: 4,
    opponent: '퍼플 팬서스',
    date: '2023년 8월 23일',
    time: '오후 6:30',
    location: '레드 드래곤즈 스타디움',
    isHome: true,
  },
];

export function ScheduleSection() {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section
      id="경기일정"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(80px)',
        transition: 'opacity 1s ease-out, transform 1s ease-out',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4 font-display"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s, transform 0.6s',
            }}
          >
            <span className="text-red-600">경기</span> 일정
          </h2>
          <p
            className="text-gray-400 max-w-2xl mx-auto"
            style={{
              opacity: isInView ? 1 : 0,
              transition: 'opacity 0.6s 0.2s',
            }}
          >
            레드 드래곤즈의 다가오는 경기 일정을 확인하세요.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingGames.map((game, index) => (
            <div
              key={game.id}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView
                  ? 'translateY(0) scale(1)'
                  : 'translateY(40px) scale(0.95)',
                transition: `opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.12}s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.12}s`,
              }}
            >
              <Card
                className={`${
                  game.isHome
                    ? 'border-l-4 border-l-red-600'
                    : 'border-l-4 border-l-gray-600'
                } bg-black/60 border-white/10 hover:shadow-lg hover:shadow-red-400/20 transition-all duration-300`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>vs {game.opponent}</span>
                    {game.isHome ? (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                        홈
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                        원정
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{game.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{game.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{game.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="w-full text-center text-sm text-gray-400">
                    {game.isHome ? '홈 경기' : '원정 경기'}
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        <div
          className="text-center mt-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s 0.6s, transform 0.6s 0.6s',
          }}
        >
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            전체 일정 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
