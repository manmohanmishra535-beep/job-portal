const path = require('path');

/**
 * When AUTH_SHIM=true, `@clerk/nextjs` and `@clerk/nextjs/server` are replaced
 * with local development stubs so the app can run without real Clerk keys.
 *
 * This is opt-in and local-development only. Leave it unset for real builds.
 */
const AUTH_SHIM = process.env.AUTH_SHIM === 'true' || process.env.NEXT_PUBLIC_AUTH_SHIM === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    if (AUTH_SHIM) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Exact-match aliases ($) so subpath imports are not swallowed.
        '@clerk/nextjs$': path.resolve(__dirname, 'lib/dev-auth/clerk-client.tsx'),
        '@clerk/nextjs/server$': path.resolve(__dirname, 'lib/dev-auth/clerk-server.ts'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
