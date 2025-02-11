import nextra from "nextra";

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
};

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  staticImage: true,
  flexsearch: true,
  latex: true,
});

export default withNextra(nextConfig);
