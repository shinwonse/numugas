/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 서버(.next)를 띄운 채 검증용 빌드를 따로 돌릴 때 NEXT_DIST_DIR로 출력 폴더를 분리한다
  distDir: process.env.NEXT_DIST_DIR || '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 리그 필터가 쿼리(?league=)에서 경로로 바뀌어, 예전 링크를 새 주소로 보낸다
  async redirects() {
    return [
      {
        source: '/stats/:type/:season',
        has: [{ type: 'query', key: 'league', value: '(?<league>[A-Z]+)' }],
        destination: '/stats/:type/:season/:league',
        permanent: true,
      },
      // 상대 전적이 팀 기록 페이지로 합쳐졌다 (?team= 은 그대로 넘어간다)
      {
        source: '/stats/opponents',
        destination: '/stats/team',
        permanent: true,
      },
    ];
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
