/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow react-rnd and framer-motion to work correctly
  transpilePackages: ['react-rnd'],
  // Disable powered by header
  poweredByHeader: false,
  webpack: (config, { dev }) => {
    // Disable disk caching during development to prevent ENOSPC warnings on disk partitions
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
