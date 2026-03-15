/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_HUB_URL: process.env.NEXT_PUBLIC_HUB_URL || 'https://api.huangting.ai',
  },
}

module.exports = nextConfig
