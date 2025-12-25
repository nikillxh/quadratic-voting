import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "lh3.google.com",
    ],
  }
};

export default nextConfig;
