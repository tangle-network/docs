import React from "react";
import { useRouter } from "next/router";
import { DocsThemeConfig, useConfig, useTheme } from "nextra-theme-docs";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import HeaderLogo from "./components/HeaderLogo";
import { Discord, Github, Twitter } from "./components/Social";
import HelpDiscordBtn from "./components/HelpDiscordBtn";

const SITE_ROOT = "https://docs.tangle.tools";

const LaunchAppButton = () => {
  const router = useRouter();

  const handleClick = () => {
    window.open("http://app.tangle.tools/", "_blank");
  };
  return (
    <button
      type="button"
      className="text-white !bg-gradient-to-br align-middle mt-2 ml-12 from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      onClick={handleClick}
    >
      Launch App
    </button>
  );
};

const theme: DocsThemeConfig = {
  docsRepositoryBase: "https://github.com/webb-tools/tangle-docs/tree/main",
  useNextSeoProps() {
    const { frontMatter } = useConfig();

    const defaultTitle = frontMatter.overrideTitle;

    return {
      description: frontMatter.description,
      defaultTitle,
      titleTemplate: `%s - Tangle Network`,
    };
  },
  toc: {
    float: true,
  },
  logo: HeaderLogo,
  logoLink: false,
  head() {
    const router = useRouter();
    const { systemTheme = "dark" } = useTheme();
    const fullUrl =
      router.asPath === "/" ? SITE_ROOT : `${SITE_ROOT}${router.asPath}`;

    const { frontMatter } = useConfig();

    // Set default values for title and description
    const defaultTitle = "Tangle Tools Documentation";
    const defaultDescription = "Comprehensive documentation for Tangle Tools";

    // Get the title and description from the front matter, or use the default values
    const title = frontMatter.title || defaultTitle;
    const description = frontMatter.description || defaultDescription;

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
        <meta name="twitter:card" content="summary_medium_image" />
        <meta name="twitter:site" content="@tangle_network" />
        <meta name="twitter:creator" content="@webbprotocol" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={fullUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="twitter:image"
          content="https://assets-global.website-files.com/6494562b44a28080aafcbad4/6494599436915879aa403230_Tangle%20Logo.png"
        />
        <meta
          property="og:image"
          content="https://assets-global.website-files.com/6494562b44a28080aafcbad4/6494599436915879aa403230_Tangle%20Logo.png"
        />
        <meta property="og:locale" content="en_IE" />
        <meta property="og:site_name" content="Tangle Network" />
        <link rel="prefetch" href="/" as="document" />
      </>
    );
  },
  editLink: {
    text: "Edit this page on GitHub",
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
  },
  navbar: {
    component: Navigation,
    extraContent: (
      <>
        <HelpDiscordBtn />
      </>
    ),
  },
  footer: {
    component: Footer,
  },
  nextThemes: {
    defaultTheme: "light",
  },
  // Remove React warning in console https://github.com/shuding/nextra/issues/1213#issuecomment-1493038320
  search: {
    loading: "Loading...",
  },
};

export default theme;
