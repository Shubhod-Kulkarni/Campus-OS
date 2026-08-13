import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow react-rnd and framer-motion to work correctly
  transpilePackages: ['react-rnd'],
  // Disable powered by header
  poweredByHeader: false,
};

export default nextConfig;
