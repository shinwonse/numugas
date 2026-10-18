// v2: 모든 GET을 무제한 저장하던 v1 캐시를 정리한다
const CACHE_NAME = 'numugas-v2';
const STATIC_ASSETS = ['/', '/players', '/stats', '/about', '/lineup'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

/** 파일명에 해시가 붙어 내용이 바뀌지 않는 정적 파일 */
function isImmutableAsset(url) {
  return url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/fonts/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  // Next.js 화면 데이터(RSC) 요청은 브라우저/라우터 캐시에 맡긴다
  if (url.searchParams.has('_rsc') || request.headers.get('RSC')) return;

  // 정적 파일: 캐시 우선
  if (isImmutableAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // 페이지 이동: 네트워크 우선, 오프라인이면 저장해 둔 페이지(없으면 홈)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached ?? caches.match('/'))
            .then((cached) => cached ?? new Response('Offline', { status: 503 })),
        ),
    );
  }
});
