/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
    turbopack: false, // Additional flag for completeness
  },
  // Also try adding this to skip Turbopack entirely
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack tweaks if needed, but start empty
    return config;
  },
};

export default nextConfig;