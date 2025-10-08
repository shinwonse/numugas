import { useEffect, useRef, useState } from 'react';

interface UseCountAnimationOptions {
  /** 목표 값 */
  end: number | string;
  /** 애니메이션 지속 시간 (ms) */
  duration?: number;
  /** 애니메이션 시작 여부 */
  isInView?: boolean;
  /** 소수점 자리수 (숫자인 경우) */
  decimals?: number;
}

/**
 * 숫자 크기에 따라 적절한 애니메이션 duration을 계산
 */
function calculateDuration(value: number): number {
  const absoluteValue = Math.abs(value);

  if (absoluteValue < 1) return 1000; // 소수점 (예: 0.583)
  if (absoluteValue < 10) return 800; // 한 자릿수
  if (absoluteValue < 100) return 1200; // 두 자릿수
  if (absoluteValue < 1000) return 1600; // 세 자릿수
  if (absoluteValue < 10000) return 2000; // 네 자릿수
  return 2400; // 다섯 자릿수 이상
}

/**
 * 숫자가 올라가는 카운팅 애니메이션 훅
 */
export function useCountAnimation({
  end,
  duration,
  isInView = true,
  decimals = 0,
}: UseCountAnimationOptions) {
  const [count, setCount] = useState<string | number>(0);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // 뷰에서 벗어나면 카운트를 0으로 리셋
    if (!isInView) {
      setCount(0);
      return;
    }

    // 문자열인 경우 (예: '0.583')
    if (typeof end === 'string') {
      const numericEnd = parseFloat(end);
      if (isNaN(numericEnd)) {
        setCount(end);
        return;
      }

      const startValue = 0;
      const hasDecimal = end.includes('.');
      const decimalPlaces = hasDecimal
        ? end.split('.')[1]?.length || decimals
        : decimals;

      // duration이 명시되지 않았으면 숫자 크기에 따라 자동 계산
      const animationDuration = duration ?? calculateDuration(numericEnd);

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / animationDuration, 1);

        // easeOutExpo 이징 함수
        const easeProgress =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        const current = startValue + (numericEnd - startValue) * easeProgress;

        if (hasDecimal) {
          setCount(current.toFixed(decimalPlaces));
        } else {
          setCount(Math.floor(current));
        }

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(hasDecimal ? numericEnd.toFixed(decimalPlaces) : numericEnd);
        }
      };

      frameRef.current = requestAnimationFrame(animate);

      return () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
        startTimeRef.current = undefined;
      };
    }

    // 숫자인 경우
    const numericEnd = end;
    const startValue = 0;

    // duration이 명시되지 않았으면 숫자 크기에 따라 자동 계산
    const animationDuration = duration ?? calculateDuration(numericEnd);

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / animationDuration, 1);

      // easeOutExpo 이징 함수
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const current = startValue + (numericEnd - startValue) * easeProgress;

      if (decimals > 0) {
        setCount(Number(current.toFixed(decimals)));
      } else {
        setCount(Math.floor(current));
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(numericEnd);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = undefined;
    };
  }, [end, duration, isInView, decimals]);

  return count;
}
