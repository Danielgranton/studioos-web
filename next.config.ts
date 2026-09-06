import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "stub-media.local",
      },
      {
        protocol: "https",
        hostname: "studioos-files.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
