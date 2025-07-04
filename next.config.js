/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sports-celebrity-reels.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'sports-celebrity-reels.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'reelbucket1.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
  output: 'standalone',
  poweredByHeader: false,
  staticPageGenerationTimeout: 120,
  // Add environment variables that should be available at build time
  env: {
    VERCEL_ENV: process.env.VERCEL_ENV || 'development',
  }
}

module.exports = nextConfig





