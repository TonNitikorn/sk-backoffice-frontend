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
    domains: ["angpaos.games","the1pg.com" , "public-cdn-softkingdom.sgp1.digitaloceanspaces.com" , "public-cdn-softkingdom.sgp1.cdn.digitaloceanspaces.com" ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public-cdn-softkingdom.sgp1.cdn.digitaloceanspaces.com',
        // port: '',
        // pathname: '/account123/**',
      },]
  },
};

// https://angpaos.games/wp-content/uploads/2023/03/

module.exports = nextConfig;
