import { getShikiHighlighter, SHIKI_SUPPORTED_LANGUAGES } from "./shiki";
import { useTheme } from "nextra-theme-docs";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Language = (typeof SHIKI_SUPPORTED_LANGUAGES)[number];

interface CodeDisplayProps {
  code: string;
  language: Language;
  title?: string;
  fromLine?: number;
  sourceUrl?: string;
}

export default function CodeDisplay({
  code,
  language,
  title = language === "typescript" ? "TypeScript" : language,
  fromLine = 1,
  sourceUrl,
}: CodeDisplayProps) {
  const { theme, systemTheme } = useTheme();
  const highlightTheme =
    (theme === "system" ? systemTheme : theme) === "dark"
      ? "github-dark"
      : "github-light";
  const [highlight, setHighlight] = useState<{
    code: string;
    language: Language;
    theme: string;
    html: string;
  } | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const copyRequest = useRef(0);
  const currentCode = useRef(code);
  currentCode.current = code;

  useEffect(() => {
    let active = true;
    getShikiHighlighter()
      .then((highlighter) => {
        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: highlightTheme,
        });
        if (active)
          setHighlight({ code, language, theme: highlightTheme, html });
      })
      .catch(() => {
        // The readable source remains available if highlighting cannot load.
      });
    return () => {
      active = false;
    };
  }, [code, language, highlightTheme]);

  useEffect(() => {
    copyRequest.current += 1;
    setCopyState("idle");
    return () => {
      copyRequest.current += 1;
    };
  }, [code]);

  useEffect(() => {
    if (copyState !== "copied") return;
    const timeout = setTimeout(() => setCopyState("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const copy = async () => {
    const request = ++copyRequest.current;
    try {
      await navigator.clipboard.writeText(code);
      if (request === copyRequest.current && currentCode.current === code)
        setCopyState("copied");
    } catch {
      if (request === copyRequest.current && currentCode.current === code)
        setCopyState("failed");
    }
  };

  const currentHighlight =
    highlight?.code === code &&
    highlight.language === language &&
    highlight.theme === highlightTheme
      ? highlight.html
      : null;
  const startLineStyle = { "--start-line": fromLine } as React.CSSProperties;
  const lines = code.split("\n");

  return (
    <div className="my-6 min-w-0 overflow-hidden border border-gray-200 rounded-lg dark:border-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800">
        <span className="min-w-0 text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <div className="flex shrink-0 items-center gap-3">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] min-w-[44px] items-center text-sm underline underline-offset-2"
            >
              View on GitHub
            </a>
          )}
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${title} code`}
            className="inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {copyState === "copied" ? (
              <CheckIcon size={16} aria-hidden="true" />
            ) : (
              <ClipboardIcon size={16} aria-hidden="true" />
            )}
            {copyState === "copied" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <span
        role="status"
        className={
          copyState === "failed"
            ? "block px-4 py-2 text-sm text-red-600 dark:text-red-400"
            : "sr-only"
        }
      >
        {copyState === "failed"
          ? "Could not copy. Select the code and copy it manually."
          : copyState === "copied"
            ? "Code copied."
            : ""}
      </span>
      <div
        role="region"
        aria-label={`${title} code`}
        tabIndex={0}
        style={startLineStyle}
        className="nextra-code-block nx-relative overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 nx-bg-primary-700/5 dark:nx-bg-primary-300/10"
      >
        {currentHighlight ? (
          <div dangerouslySetInnerHTML={{ __html: currentHighlight }} />
        ) : (
          <pre className="shiki">
            <code>
              {lines.map((line, index) => (
                <React.Fragment key={index}>
                  <span className="line">{line}</span>
                  {index < lines.length - 1 ? "\n" : null}
                </React.Fragment>
              ))}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
