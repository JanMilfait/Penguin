/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_API_DOMAIN],
    loader: 'default',
    path: process.env.NEXT_PUBLIC_API_BASE_URL + '/storage/'
  }
};

module.exports = nextConfig;
