# 새 커스텀 훅 생성

이 프로젝트의 컨벤션에 맞는 새 React 커스텀 훅을 생성합니다.

## 훅 이름: $ARGUMENTS

## 생성 규칙

1. **파일 위치**: `src/hooks/` 디렉토리
2. **파일명**: `use-{name}.ts` (kebab-case)
3. **함수명**: `use{Name}` (camelCase, use로 시작)

## 데이터 페칭 훅 템플릿 (TanStack Query 사용)

```typescript
import { useQuery } from '@tanstack/react-query';

interface {DataType} {
  // 데이터 타입 정의
}

async function fetch{Name}(): Promise<{DataType}> {
  const response = await fetch('/api/{endpoint}');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

export function use{Name}() {
  return useQuery({
    queryKey: ['{name}'],
    queryFn: fetch{Name},
  });
}
```

## 일반 훅 템플릿

```typescript
import { useState, useCallback } from 'react';

export function use{Name}(initialValue?: {Type}) {
  const [state, setState] = useState(initialValue);

  const handler = useCallback(() => {
    // 로직
  }, []);

  return { state, handler };
}
```

## 기존 훅 참고

- `use-batting-stats.ts` - 타자 통계 페칭
- `use-pitching-stats.ts` - 투수 통계 페칭
- `use-team.ts` - 팀 정보 페칭
- `use-mobile.ts` - 모바일 감지
