# 새 컴포넌트 생성

이 프로젝트의 컨벤션에 맞는 새 React 컴포넌트를 생성합니다.

## 컴포넌트 이름: $ARGUMENTS

## 생성 규칙

1. **파일 위치**: `src/components/` 디렉토리에 kebab-case 파일명으로 생성
2. **컴포넌트명**: PascalCase 사용
3. **기본 구조**:
   - 함수형 컴포넌트 사용
   - Props 인터페이스 정의 (컴포넌트명 + Props)
   - 필요시 'use client' 지시어 추가

## 템플릿

```tsx
import { cn } from '@/lib/cn';

interface {ComponentName}Props {
  className?: string;
}

export function {ComponentName}({ className }: {ComponentName}Props) {
  return (
    <div className={cn('', className)}>
      {/* 컴포넌트 내용 */}
    </div>
  );
}
```

## 추가 고려사항

- UI 컴포넌트면 shadcn/ui 사용 검토
- 애니메이션 필요시 `src/components/animated/`에 생성하고 Framer Motion 사용
- Tailwind CSS 유틸리티 클래스 사용
