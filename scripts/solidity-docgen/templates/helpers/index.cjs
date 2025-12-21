const path = require("path");

function stripSol(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\\.sol$/i, "");
}

function basenameNoExt(value) {
  if (typeof value !== "string") return value;
  const base = path.basename(value);
  return base.replace(/\\.sol$/i, "");
}

function githubSourceUrl(absolutePath) {
  if (typeof absolutePath !== "string") return "";
  const repoRoot =
    process.env.TNT_CORE_DIR && process.env.TNT_CORE_DIR.length > 0
      ? path.resolve(process.env.TNT_CORE_DIR)
      : path.resolve(process.cwd(), "../tnt-core");
  const repo =
    process.env.TNT_CORE_GITHUB_REPO && process.env.TNT_CORE_GITHUB_REPO.length > 0
      ? process.env.TNT_CORE_GITHUB_REPO
      : "https://github.com/tangle-network/tnt-core";

  const ref =
    process.env.TNT_CORE_GITHUB_REF && process.env.TNT_CORE_GITHUB_REF.length > 0
      ? process.env.TNT_CORE_GITHUB_REF
      : "feature/modular-protocol";
  const rel = path.relative(repoRoot, absolutePath).split(path.sep).join("/");
  return `${repo}/blob/${ref}/${rel}`;
}

module.exports = {
  stripSol,
  basenameNoExt,
  githubSourceUrl,
};
