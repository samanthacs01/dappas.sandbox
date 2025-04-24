import { composePlugins, withNx } from '@nx/next';
import { withSentryConfig } from '@sentry/nextjs';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: 'randomuser.me',
      },
      {
        hostname: 'localhost',
      },
      {
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '250mb',
    } 
  },
};

const sentryPlugin = (nextConfig) => withSentryConfig(nextConfig, {
  org: "selectorhq",
  project: "pulse-web",

  silent: false, // Can be used to suppress logs
  sourcemaps: {
    disable: true,
    deleteSourcemapsAfterUpload: true
  }
});

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  sentryPlugin,
];

export default composePlugins(...plugins)(nextConfig);
