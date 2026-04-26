import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.32.100'],
  experimental: {
    staleTimes: {
      dynamic: 300,
    },
  },
};

export default nextConfig;
