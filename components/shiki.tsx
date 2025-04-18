import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
  type PlainTextLanguage,
} from "shiki";

export const SHIKI_SUPPORTED_LANGUAGES = [
  "rust",
  "typescript",
  "javascript",
  "solidity",
  "plaintext",
  "toml",
] as const satisfies ReadonlyArray<BundledLanguage | PlainTextLanguage>;

// Create a singleton promise for the highlighter
let highlighterPromise: Promise<Highlighter> | null = null;

// Singleton function to get or create the highlighter
export const getShikiHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: SHIKI_SUPPORTED_LANGUAGES.slice(),
    });
  }
  return highlighterPromise;
};

// Language detection utility
export const getLanguage = (
  url: string,
): (typeof SHIKI_SUPPORTED_LANGUAGES)[number] => {
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
    case "toml":
      return "toml";
    default:
      return "plaintext";
  }
};

export const dedentCode = (code: string): string => {
  const lines = code.split("\n");

  // Filter out empty lines for calculating minimum indentation
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) return code;

  // Find the minimum indentation level across all non-empty lines
  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => {
      const match = line.match(/^[ \t]*/);
      return match ? match[0].length : 0;
    }),
  );

  // Remove the common indentation from all lines
  if (minIndent > 0) {
    return lines.map((line) => line.slice(minIndent)).join("\n");
  }

  return code;
};
