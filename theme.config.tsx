import { socialMetadata } from "@tangle-network/brand/social";
import { useRouter } from "next/router";
import { DocsThemeConfig, ThemeSwitch, useConfig } from "nextra-theme-docs";
import Footer from "./components/Footer";
import HeaderLogo from "./components/HeaderLogo";
import HelpDiscordBtn from "./components/HelpDiscordBtn";
import Navigation from "./components/Navigation";

const SITE_ROOT = "https://docs.tangle.tools";

// These are the committed, inspected 1200 x 630 PNG cards. Keep an added
// front-matter image's facts here before advertising it in a social preview.
const posterAlt: Record<string, string> = {
  "/og-tangle-v1.png": "Tangle logo beside an indigo knot",
  "/images/og/integrations-hub.png": "Integration Hub: Connect the tools your business uses",
  "/images/og/cloudbeds.png": "Connect Cloudbeds: Property data, housekeeping, and folios",
  "/images/og/pricelabs.png": "Connect PriceLabs: Pricing data, costs, and setup requirements",
  "/images/og/deepgram.png": "Connect Deepgram: Voice notes for staff and vendors",
  "/images/og/whatsapp.png": "WhatsApp business line: Choose a number and verify your phone",
};

function Head() {
  const router = useRouter();
  const pathname = router.asPath.split(/[?#]/)[0];
  const fullUrl = `${SITE_ROOT}${pathname}`;

  // `title` is the page's front-matter title, else its first heading.
  const { frontMatter, title: pageTitle } = useConfig();

  // Set default values for title and description
  const defaultTitle = "Tangle Docs";
  const defaultDescription =
    "Build agents with Tangle Sandbox, Router, and Intelligence using SDK guides and API references.";

  // Get the title and description from the front matter, or use the default values
  const heading = frontMatter.title || pageTitle;
  const title =
    heading && pathname !== "/"
      ? `${heading} | ${defaultTitle}`
      : defaultTitle;

  const description = frontMatter.description || defaultDescription;

  // Social preview image: a page can set `image` in its front matter (a
  // repo-relative path like /images/og/example.png); otherwise the shared
  // branded card is used. Keep the asset local — external hosts can rot or
  // rebrand and break every link preview at once.
  const imagePath = typeof frontMatter.image === "string"
    ? frontMatter.image
    : "/og-tangle-v1.png";
  if (!Object.hasOwn(posterAlt, imagePath)) {
    throw new Error(`Add verified social poster facts for ${imagePath}`);
  }
  const social = socialMetadata({
    url: fullUrl,
    title,
    description,
    siteName: "Tangle",
    image: {
      url: `${SITE_ROOT}${imagePath}`,
      type: "image/png",
      width: 1200,
      height: 630,
      alt: posterAlt[imagePath],
    },
  });

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="icon" href="/favicon-v1.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon-v1.png" sizes="180x180" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#1F1D2B" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={social.canonicalUrl} />
      {social.tags.map((tag) => (
        <meta key={"property" in tag ? tag.property : tag.name} {...tag} />
      ))}
      <meta property="og:locale" content="en_US" />
      <link rel="prefetch" href="/" as="document" />
    </>
  );
}

const theme: DocsThemeConfig = {
  docsRepositoryBase: "https://github.com/tangle-network/tangle-docs/tree/main",
  toc: {
    float: true,
  },
  logo: HeaderLogo,
  logoLink: false,
  head: Head,
  editLink: {
    content: "Edit this page on GitHub",
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
  },
  navbar: {
    component: Navigation,
    extraContent: (
      <>
        <HelpDiscordBtn className="hidden xs:inline-block" />
        <ThemeSwitch
          lite
          className="hidden border xs:inline-block md:hidden lg:inline-block dark:border-gray-600"
        />
      </>
    ),
  },
  // Remove React warning in console https://github.com/shuding/nextra/issues/1213#issuecomment-1493038320
  search: {
    loading: "Loading...",
  },
  footer: {
    component: Footer,
  },
  nextThemes: {
    defaultTheme: "light",
  },
  color: {
    hue: 236,
    saturation: {
      light: 80,
      dark: 40,
    },
  },
};

export default theme;
