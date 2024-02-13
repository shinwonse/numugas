/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*.clubone.kr',
      }
    ]
  },
}

module.exports = nextConfig
