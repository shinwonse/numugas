# 새 API 라우트 생성

Next.js App Router API 라우트를 생성합니다.

## API 이름: $ARGUMENTS

## 생성 규칙

1. **파일 위치**: `src/app/api/{name}/route.ts`
2. **HTTP 메서드**: GET, POST, PUT, DELETE 중 필요한 것만 export

## 템플릿

```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // URL 파라미터 가져오기 (필요시)
    const { searchParams } = new URL(request.url);
    const param = searchParams.get('param');

    // Supabase 쿼리
    const { data, error } = await supabase
      .from('table_name')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터를 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
```

## 동적 라우트

파라미터가 필요한 경우: `src/app/api/{name}/[id]/route.ts`

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

## 기존 API 라우트 참고

- `src/app/api/batter-career/route.ts` - 타자 커리어 통계
- `src/app/api/pitcher-career/route.ts` - 투수 커리어 통계
- `src/app/api/crawl-batter/route.ts` - 타자 데이터 크롤링
