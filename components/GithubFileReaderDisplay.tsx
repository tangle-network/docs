import React, { useEffect, useState } from "react";
import { FaGithub, FaLink, FaSpinner } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";

let lightTheme = oneLight;
let darkTheme = oneDark;

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
      case "sol":
        return "solidity";
      case "md":
      case "mdx":
        return "markdown";
      case "toml":
        return "toml";
      case "yaml":
      case "yml":
        return "yaml";
      case "json":
        return "json";
      case "sh":
        return "bash";
      case "py":
        return "python";
      case "go":
        return "go";
      case "cpp":
      case "c++":
      case "cc":
        return "cpp";
      case "c":
        return "c";
      case "java":
        return "java";
      case "php":
        return "php";
      case "rb":
        return "ruby";
      case "swift":
        return "swift";
      case "kt":
        return "kotlin";
      case "cs":
        return "csharp";
      case "html":
        return "html";
      case "css":
        return "css";
      case "scss":
        return "scss";
      case "sql":
        return "sql";
      case "graphql":
      case "gql":
        return "graphql";
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
        setContent(selectedLines.join("\n"));
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

      <SyntaxHighlighter
        language={getLanguage(url)}
        style={theme === "light" ? lightTheme : darkTheme}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        showLineNumbers
        startingLineNumber={fromLine}
        wrapLines
        wrapLongLines
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

export default GithubFileReaderDisplay;
