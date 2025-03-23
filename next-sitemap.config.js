/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://docs.tangle.tools",
  generateRobotsTxt: true,
  exclude: ["/404", "/500", "/api/*", "*/_meta"],
  outDir: "public",
  generateIndexSitemap: true,
};

export default config;
