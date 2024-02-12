/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['file.clubone.kr'],
  },
}

module.exports = nextConfig
