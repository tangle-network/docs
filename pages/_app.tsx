// _app.tsx

import "../globals.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type NextraAppProps = AppProps & {
  Component: NextPageWithLayout;
};

// Shim requestIdleCallback in Safari
if (typeof window !== "undefined" && window.requestIdleCallback === undefined) {
  window.requestIdleCallback = (callback: IdleRequestCallback) =>
    setTimeout(callback, 1);
  window.cancelIdleCallback = (id: number) => clearTimeout(id);
}

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

      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
