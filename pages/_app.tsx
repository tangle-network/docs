// _app.tsx

import "katex/dist/katex.min.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import "../globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getShikiHighlighter } from "../components/shiki";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type NextraAppProps = AppProps & {
  Component: NextPageWithLayout;
};

// Shim requestIdleCallback in Safari
if (typeof window !== "undefined" && !("requestIdleCallback" in window)) {
  // @ts-ignore
  window.requestIdleCallback = (fn) => setTimeout(fn, 1);
  // @ts-ignore
  window.cancelIdleCallback = (id) => clearTimeout(id);
}

// Initialize the highlighter when the app starts
getShikiHighlighter();

export default function Nextra({ Component, pageProps }: NextraAppProps) {
  // Define a layout if it doesn't exist in the page component
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <svg height="0px" width="0px" style={{ position: "absolute" }}>
        {" "}
        {/* Adjust style as needed */}
        <defs>
          <linearGradient
            id="pink-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(156, 81, 161, 1)" />
            <stop offset="70%" stopColor="rgba(255, 30, 86, 1)" />
          </linearGradient>
        </defs>
      </svg>

      {getLayout(
        <>
          <Component {...pageProps} />
          <GoogleAnalytics gaId="G-JEQ15MLV6B" />
        </>,
      )}
    </>
  );
}
