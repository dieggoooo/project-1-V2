import type { NextConfig } from "next";

const isCapacitor = process.env.CAPACITOR === 'true';

const nextConfig: NextConfig = {
  ...(isCapacitor ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: isCapacitor,
};

export default nextConfig;
