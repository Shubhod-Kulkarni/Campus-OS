/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow react-rnd and framer-motion to work correctly
  transpilePackages: ['react-rnd'],
  // Disable powered by header
  poweredByHeader: false,
};

export default nextConfig;
