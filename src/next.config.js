/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_API_DOMAIN]
  }
};

module.exports = nextConfig;
