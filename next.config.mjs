/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow react-rnd and framer-motion to work correctly
  transpilePackages: ['react-rnd'],
  // Disable powered by header
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      './C:/Users/SUBHODAY/AppData/Local/CampusOS_app/node_modules/next/dist/client/app-next-dev.js': 'next/dist/client/app-next-dev.js',
      './C:/Users/SUBHODAY/AppData/Local/CampusOS_app/node_modules/next/dist/client/next-dev.js': 'next/dist/client/next-dev.js',
    };
    return config;
  },
};

export default nextConfig;
