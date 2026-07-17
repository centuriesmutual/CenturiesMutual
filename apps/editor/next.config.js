/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper routing
  trailingSlash: false,
  // Optimize for production
  poweredByHeader: false,
  // Environment variables
  env: {
    BOX_CLIENT_ID: process.env.BOX_CLIENT_ID,
    BOX_CLIENT_SECRET: process.env.BOX_CLIENT_SECRET,
    BOX_ENTERPRISE_ID: process.env.BOX_ENTERPRISE_ID,
    JWT_SECRET: process.env.JWT_SECRET,
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    NEWSPAPER_DOMAIN: process.env.NEWSPAPER_DOMAIN || 'newspaper.centuriesmutual.com'
  },
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies that aren't needed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'coffee-script': false,
    };
    
    // Ignore vm2 warnings (it's a server-side only dependency)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'vm2': false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig

