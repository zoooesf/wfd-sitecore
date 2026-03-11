const path = require('path');
const SassAlias = require('sass-alias');
// BEGIN CUSTOMIZATION - Available locales for the application
const { applicationLocales, defaultLocale } = require('./src/lib/i18n/i18n-config');
// END CUSTOMIZATION

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // BEGIN CUSTOMIZATION - Add multilingual support
  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: applicationLocales, // CUSTOMIZATION
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/about`.
    defaultLocale: process.env.DEFAULT_LANGUAGE || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || defaultLocale, // CUSTOMIZATION
    localeDetection: false, // CUSTOMIZATION
  },
  // END CUSTOMIZATION

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
      // BEGIN CUSTOMIZATION - Safelist domains to show user profile picture for Auth0 login functionality
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
        port: '',
      },
      // END CUSTOMIZATION
    ],
  },

  async rewrites() {
    return [
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      // robots route
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      // BEGIN CUSTOMIZATION - Sitemap for people (must be before the general sitemap rewrite)
      {
        source: '/sitemap-people.xml',
        destination: '/api/sitemap-people',
      },
      // END CUSTOMIZATION
      // sitemap route
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap',
      },
      // feaas api route
      {
        source: '/feaas-render',
        destination: '/api/editing/feaas/render',
      },
    ];
  },

  webpack: (config, options) => {
    if (!options.isServer) {
      // Add a loader to strip out getComponentServerProps from components in the client bundle
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        use: ['@sitecore-content-sdk\\nextjs\\component-props-loader'],
      });
    } else {
      // Force use of CommonJS on the server for FEAAS SDK since Content SDK also uses CommonJS entrypoint to FEAAS SDK.
      // This prevents issues arising due to FEAAS SDK's dual CommonJS/ES module support on the server (via conditional exports).
      // See https://nodejs.org/api/packages.html#dual-package-hazard.
      config.externals = [
        {
          '@sitecore-feaas/clientside/react': 'commonjs @sitecore-feaas/clientside/react',
          '@sitecore/byoc': 'commonjs @sitecore/byoc',
          '@sitecore/byoc/react': 'commonjs @sitecore/byoc/react',
        },
        ...config.externals,
      ];
    }

    return config;
  },

  // Add sass settings for SXA themes and styles
  sassOptions: {
    importer: new SassAlias({
      '@globals': path.join(process.cwd(), './src/assets', 'globals'),
      '@fontawesome': path.join(process.cwd(), './node_modules', 'font-awesome'),
    }).getImporter(),
    // temporary measure until new versions of bootstrap and font-awesome released
    quietDeps: true,    
    silenceDeprecations: ["import", "legacy-js-api"],
  },

  // BEGIN CUSTOMIZATION - Security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://workflow-app-nine.vercel.app https://pages.sitecorecloud.io/",
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // END CUSTOMIZATION
};

module.exports = nextConfig;
