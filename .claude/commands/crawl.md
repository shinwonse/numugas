# 데이터 크롤링 실행

API 라우트를 통해 데이터를 크롤링합니다.

## 사용 가능한 크롤링 엔드포인트

$ARGUMENTS가 비어있으면 아래 옵션을 보여주고 선택하게 해주세요:

1. **batter** - 타자 통계 크롤링 (`/api/crawl-batter`)
2. **pitcher** - 투수 통계 크롤링 (`/api/crawl-pitcher`)
3. **team** - 팀 통계 크롤링 (`/api/crawl-team`)
4. **team-total** - 팀 시즌 총합 통계 (`/api/crawl-team/total`)
5. **schedule** - 경기 일정 크롤링 (`/api/crawl-schedule`)
6. **all** - 모든 데이터 크롤링

## 실행 방법

개발 서버가 실행 중인지 확인하고, curl을 사용해 해당 API 엔드포인트를 호출하세요.

```bash
curl http://localhost:3000/api/crawl-{type}
```

$ARGUMENTS: 크롤링할 데이터 타입 (batter, pitcher, team, team-total, schedule, all)
