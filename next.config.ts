import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // IMPORTANT: Add this for Capacitor
  trailingSlash: true,
};

export default nextConfig;