/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
