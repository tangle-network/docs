import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { FaGithub, FaLink, FaSpinner } from "react-icons/fa";

interface GithubFileReaderDisplayProps {
  url: string;
  fromLine?: number;
  toLine?: number;
  title?: string;
}

const GithubFileReaderDisplay: React.FC<GithubFileReaderDisplayProps> = ({
  url,
  fromLine = 1,
  toLine,
  title,
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

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
        return "text";
    }
  };

  useEffect(() => {
    const fetchGithubContent = async () => {
      try {
        const rawUrl = url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");

        const response = await fetch(rawUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch file content");
        }

        const text = await response.text();
        const lines = text.split("\n");
        const selectedLines = lines.slice(fromLine - 1, toLine || lines.length);
        const codeContent = selectedLines.join("\n");
        setContent(codeContent);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchGithubContent();
  }, [url, fromLine, toLine]);

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

  const language = getLanguage(url);

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
        <pre className="nx-bg-primary-700/5 nx-overflow-x-auto nx-font-medium nx-subpixel-antialiased dark:nx-bg-primary-300/10 nx-text-[.9em]">
          <code 
            className={`language-${getLanguage(url)} nx-cdx`}
            data-language={getLanguage(url)}
            data-theme={theme}
          >
            {content}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default GithubFileReaderDisplay;