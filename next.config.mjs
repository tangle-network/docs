import nextra from "nextra";
import { withPlausibleProxy } from "next-plausible";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    legacyBrowsers: false,
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/restake",
        destination: "/restake/introduction/",
        permanent: true,
      },
      {
        source: "/developers",
        destination: "/developers/developer-overview/",
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
};

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  flexsearch: true,
  latex: true,
});

export default withPlausibleProxy()(withNextra(nextConfig));
