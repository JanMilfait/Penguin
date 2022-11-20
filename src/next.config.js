/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_API_DOMAIN]
  },
  // The @next/font/google font Roboto has no selected subsets.
  experimental: {
    fontLoaders: [
      {
        loader: '@next/font/google'
      }
    ]
  }
};

module.exports = nextConfig;
