/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
    turbopack: false, // Additional flag for completeness
        optimizeCss: false, // disables lightningcss, fallback to PostCSS

  },

};

export default nextConfig;