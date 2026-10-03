import { getShikiHighlighter, SHIKI_SUPPORTED_LANGUAGES } from "./shiki";
import { useTheme } from "nextra-theme-docs";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import React, { useEffect, useId, useRef, useState } from "react";

type Language = (typeof SHIKI_SUPPORTED_LANGUAGES)[number];

interface CodeExample {
  code: string;
  language: Language;
  title?: string;
  fromLine?: number;
  sourceUrl?: string;
}

type CodeDisplayProps =
  | (CodeExample & { examples?: never })
  | { examples: readonly [CodeExample, ...CodeExample[]] };

const languageTitles: Partial<Record<Language, string>> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
};
const languageTitle = (language: Language) =>
  languageTitles[language] ?? language;

export default function CodeDisplay(props: CodeDisplayProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const id = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = props.examples
    ? props.examples[selectedIndex] ?? props.examples[0]
    : props;
  const {
    code,
    language,
    title = languageTitle(language),
    fromLine = 1,
    sourceUrl,
  } = selected;

  const selectWithKeyboard = (event: React.KeyboardEvent, index: number) => {
    if (!props.examples) return;
    const last = props.examples.length - 1;
    const destinations: Partial<Record<string, number>> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = destinations[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelectedIndex(next);
    tabRefs.current[next]?.focus();
  };
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
      <div
        className={`flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-800 ${props.examples ? "px-3 py-1.5" : "flex-wrap px-4 py-2"}`}
      >
        {props.examples ? (
          <div
            role="tablist"
            aria-label="Code language"
            className="flex min-w-0 gap-1 overflow-x-auto"
          >
            {props.examples.map((example, index) => (
              <button
                key={`${example.language}-${index}`}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`${id}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-controls={`${id}-code`}
                tabIndex={index === selectedIndex ? 0 : -1}
                onClick={() => setSelectedIndex(index)}
                onKeyDown={(event) => selectWithKeyboard(event, index)}
                className={`min-h-[44px] shrink-0 rounded-md px-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${index === selectedIndex ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
              >
                {example.title ?? languageTitle(example.language)}
              </button>
            ))}
          </div>
        ) : (
          <span className="min-w-0 truncate text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
        )}
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
            <span className={props.examples ? "hidden sm:inline" : undefined}>
              {copyState === "copied" ? "Copied" : "Copy"}
            </span>
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
        id={`${id}-code`}
        role={props.examples ? "tabpanel" : "region"}
        aria-label={props.examples ? undefined : `${title} code`}
        aria-labelledby={
          props.examples ? `${id}-tab-${selectedIndex}` : undefined
        }
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
