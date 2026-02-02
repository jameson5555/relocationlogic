import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // For self-hosted Node environments
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Disable Vercel-specific features
  experimental: {
    // No edge runtime or Vercel-specific features
  },
  
  // ISR revalidation times
  async rewrites() {
    return [];
  },
};

export default nextConfig;
