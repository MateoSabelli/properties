import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgar.zonapropcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static1.sosiva451.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.21online.lat",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sdecbbcorftaaspwzvfj.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagsapi.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

