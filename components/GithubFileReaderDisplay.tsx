import { dedentCode, getLanguage } from "./shiki";
import CodeDisplay from "./CodeDisplay";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface GithubFileReaderDisplayProps {
  url: string;
  fromLine?: number;
  toLine?: number;
  title?: string;
  dedent?: boolean;
}

export default function GithubFileReaderDisplay({
  url,
  fromLine = 1,
  toLine,
  title,
  dedent = true,
}: GithubFileReaderDisplayProps) {
  const [file, setFile] = useState<{ url: string; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setFile(null);
    setError(null);
    const fetchContent = async () => {
      try {
        const rawUrl = url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");
        const response = await fetch(rawUrl, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch file content");
        const text = await response.text();
        if (!controller.signal.aborted) setFile({ url, text });
      } catch (error) {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch file content",
          );
      }
    };
    void fetchContent();
    return () => controller.abort();
  }, [url]);

  if (error) {
    return (
      <div
        role="alert"
        className="my-6 rounded-lg border border-red-200 p-4 text-red-600 dark:border-red-800 dark:text-red-400"
      >
        {error}
      </div>
    );
  }

  if (!file || file.url !== url) {
    return (
      <div
        role="status"
        aria-label="Loading source code"
        className="my-6 flex items-center justify-center rounded-lg border p-8"
      >
        <FaSpinner
          className="animate-spin text-purple-500"
          aria-hidden="true"
        />
      </div>
    );
  }

  const lines = file.text.split("\n");
  if (
    !Number.isInteger(fromLine) ||
    fromLine < 1 ||
    fromLine > lines.length ||
    (toLine !== undefined &&
      (!Number.isInteger(toLine) || toLine < fromLine || toLine > lines.length))
  ) {
    return (
      <div
        role="alert"
        className="my-6 rounded-lg border border-red-200 p-4 text-red-600 dark:text-red-400"
      >
        The source line range is unavailable.
      </div>
    );
  }
  const selected = lines.slice(fromLine - 1, toLine ?? lines.length).join("\n");
  const code = dedent ? dedentCode(selected) : selected;
  const fragment = toLine ? `#L${fromLine}-L${toLine}` : `#L${fromLine}`;

  return (
    <CodeDisplay
      code={code}
      language={getLanguage(url)}
      title={title ?? url.split("/").pop()}
      fromLine={fromLine}
      sourceUrl={`${url}${fragment}`}
    />
  );
}
