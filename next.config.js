/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  images: {
    domains: ["the1pg.com" , "api-007bet.superfast-auto.com" , "admin-007bet.superfast-auto.com","images.unsplash.com","cdn.softkingdoms.sgp1.digitaloceanspaces.com"],
  },
};

module.exports = nextConfig;
