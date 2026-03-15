import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_HUB_API_URL: process.env.NEXT_PUBLIC_HUB_API_URL || "https://api.huangting.ai",
    NEXT_PUBLIC_HUB_WS_URL: process.env.NEXT_PUBLIC_HUB_WS_URL || "wss://api.huangting.ai",
  },
};

export default nextConfig;
