/* eslint-disable @typescript-eslint/no-var-requires */

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  flexsearch: true,
  latex: true,
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  experimental: {
    legacyBrowsers: false,
  },
  staticPageGenerationTimeout: 120,
  async redirects() {
    return [
      {
        source: "/restake",
        destination: "/restake/introduction/",
        permanent: true,
      },
      {
        source: "/developers",
        destination: "/developers/blueprints/introduction",
        permanent: true,
      },
      {
        source: "/operators",
        destination: "/operators/introduction/",
        permanent: true,
      },
    ];
  },
  rewrites() {
    return {
      // beforeFiles: [
      //   {
      //     source: "/sitemap.xml",
      //     destination:
      //     //TODO: SUBMIT SITE MAP
      //       "",
      //   },
      // ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.github.com",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(withNextra(nextConfig));
