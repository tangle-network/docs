import { GoogleAnalytics } from "@next/third-parties/google";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* First-party journey: pages and clicks, sent to Platform (id.tangle.tools/v1/events). */}
        <script
          src="https://id.tangle.tools/journey.js"
          data-surface="docs"
          defer
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>

      <GoogleAnalytics gaId="G-JEQ15MLV6B" />
    </Html>
  );
}
