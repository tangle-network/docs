import React, { useEffect, useState } from "react";
import { FaGithub, FaLink, FaSpinner } from "react-icons/fa";
import { getHighlighter, type Highlighter, bundledLanguages } from "shiki";
import { useTheme } from "next-themes";

interface GithubFileReaderDisplayProps {
  url: string;
  fromLine?: number;
  toLine?: number;
  title?: string;
}

// Create a singleton promise for the highlighter
let highlighterPromise: Promise<Highlighter> | null = null;

// Singleton function to get or create the highlighter
const getShikiHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ["github-dark", "github-light"],
      langs: Object.keys(bundledLanguages),
    });
  }
  return highlighterPromise;
};

// Language detection utility
const getLanguage = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "rs":
      return "rust";
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    default:
      return "plaintext";
  }
};

const GithubFileReaderDisplay: React.FC<GithubFileReaderDisplayProps> = ({
  url,
  fromLine = 1,
  toLine,
  title,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme: currentTheme } = useTheme();

  useEffect(() => {
    const fetchAndHighlightContent = async () => {
      try {
        const rawUrl = url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");

        const [response, highlighter] = await Promise.all([
          fetch(rawUrl),
          getShikiHighlighter(),
        ]);

        if (!response.ok) {
          throw new Error("Failed to fetch file content");
        }

        const text = await response.text();
        const lines = text.split("\n");
        const selectedLines = lines.slice(fromLine - 1, toLine || lines.length);
        const codeContent = selectedLines.join("\n");

        // Set the theme based on current theme
        const theme = currentTheme === "dark" ? "github-dark" : "github-light";

        // Highlight the code with the current theme and line numbers
        const highlightedCode = highlighter.codeToHtml(codeContent, {
          lang: getLanguage(url),
          theme: theme,
          lineOptions: Array.from({ length: selectedLines.length }, (_, i) => ({
            line: i + 1,
            classes: [`line-${i + fromLine}`],
          })),
        });

        // Wrap the highlighted code with a div that sets the starting line number
        const wrappedCode = `<div style="--start-line: ${fromLine}">${highlightedCode}</div>`;
        setContent(wrappedCode);
        setLoading(false);
      } catch (err) {
        console.error("Highlighting error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchAndHighlightContent();
  }, [url, fromLine, toLine, currentTheme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 border border-gray-200 dark:border-gray-800 rounded-lg">
        <FaSpinner className="animate-spin text-purple-500 text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="my-6 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <FaGithub className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title || url.split("/").slice(-1)[0]}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Lines {fromLine}-{toLine || "end"}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
            aria-label="View on GitHub"
          >
            <FaLink className="text-sm" />
          </a>
        </div>
      </div>

      <div className="nextra-code-block nx-relative">
        <div
          className="nx-bg-primary-700/5 nx-overflow-x-auto nx-font-medium nx-subpixel-antialiased dark:nx-bg-primary-300/10 nx-text-[.9em]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default GithubFileReaderDisplay;
