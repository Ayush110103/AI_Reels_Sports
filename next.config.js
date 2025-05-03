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
  // Optimized for Vercel deployment
  output: 'standalone',
  poweredByHeader: false,
  // Increase static generation concurrency for faster builds
  staticPageGenerationTimeout: 120,
  // Add redirects to handle potential 404s
  async redirects() {
    return [
      {
        source: '/',
        destination: '/reels',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig

