import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow switching to static export mode for cPanel deployments by
  // setting the NEXT_EXPORT environment variable to 'true'.
  output: process.env.NEXT_EXPORT === 'true' ? 'export' : 'standalone', // Use static export when NEXT_EXPORT=true
  trailingSlash: true,
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
