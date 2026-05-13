import type { NextConfig } from "next";

const isCapacitor = process.env.CAPACITOR === 'true';

const CORS_HEADERS = [
  { key: 'Access-Control-Allow-Origin', value: '*' },
  { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' },
];

const nextConfig: NextConfig = {
  ...(isCapacitor ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: isCapacitor,
  headers: async () => [
    { source: '/api/:path*', headers: CORS_HEADERS },
  ],
};

export default nextConfig;
