import { useRouter } from "next/router";
import { DocsThemeConfig, ThemeSwitch, useConfig } from "nextra-theme-docs";
import Footer from "./components/Footer";
import HeaderLogo from "./components/HeaderLogo";
import HelpDiscordBtn from "./components/HelpDiscordBtn";
import Navigation from "./components/Navigation";

const SITE_ROOT = "https://docs.tangle.tools";

function Head() {
  const router = useRouter();
  const fullUrl =
    router.asPath === "/" ? SITE_ROOT : `${SITE_ROOT}${router.asPath}`;

  const { frontMatter } = useConfig();

  // Set default values for title and description
  const defaultTitle = "Tangle Docs";
  const tabTitle = "Tangle Docs - AI Agent Infrastructure";
  const defaultDescription =
    "Build and run AI agents with Tangle Sandbox, Runtime, Router, Integrations, and Intelligence.";

  // Get the title and description from the front matter, or use the default values
  const title = frontMatter.title
    ? `${frontMatter.title} - ${defaultTitle}`
    : defaultTitle;

  const description = frontMatter.description || defaultDescription;

  // Social preview image: a page can set `image` in its front matter (a
  // repo-relative path like /images/og/example.png); otherwise the shared
  // branded card is used. Keep the asset local — external hosts can rot or
  // rebrand and break every link preview at once.
  const defaultImage = `${SITE_ROOT}/images/og/default.png`;
  const frontMatterImage =
    typeof frontMatter.image === "string" && frontMatter.image.startsWith("/")
      ? `${SITE_ROOT}${frontMatter.image}`
      : undefined;
  const image = frontMatterImage ?? defaultImage;

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/images/favicon/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/images/favicon/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/images/favicon/favicon-16x16.png`}
      />
      <link
        rel="mask-icon"
        href={`/images/favicon/safari-pinned-tab.svg`}
        color="#000000"
      />
      <link rel="shortcut icon" href={`/images/favicon/favicon.ico`} />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#1F1D2B" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tangle_network" />
      <meta name="twitter:creator" content="@tanglenetwork" />
      <title>{tabTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="twitter:image" content={image} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Tangle Network" />
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
