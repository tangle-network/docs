import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function resolveTntCoreDir() {
  const explicit = process.env.TNT_CORE_DIR;
  const candidates = [
    explicit && path.resolve(explicit),
    path.resolve(repoRoot, "../tnt-core"),
    path.resolve(repoRoot, "../../tnt-core"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (
      fs.existsSync(path.join(candidate, "src/interfaces/ITangleServices.sol"))
    ) {
      return candidate;
    }
  }

  throw new Error(
    `Unable to locate tnt-core checkout. Tried: ${candidates.join(", ")}`,
  );
}

const tntCoreDir = resolveTntCoreDir();

const helperPath = path.join(
  repoRoot,
  "scripts/solidity-docgen/templates/helpers/index.cjs",
);
const sourcePath = path.join(tntCoreDir, "src/interfaces/ITangleServices.sol");
const docsPaths = [
  path.join(repoRoot, "pages/developers/api/reference/ITangleServices.mdx"),
  path.join(
    repoRoot,
    "pages/developers/api/reference/generated/ITangleServices.mdx",
  ),
];

function readFile(targetPath) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Missing required file: ${targetPath}`);
  }
  return fs.readFileSync(targetPath, "utf8");
}

function assertIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`${label} is missing required snippet:\n${needle}`);
  }
}

const helper = readFile(helperPath);
assertIncludes(helper, ': "main"', "solidity docgen helper");

const source = readFile(sourcePath).replace(/\s+/g, " ");
const requiredSourceSnippets = [
  "Types.ConfidentialityPolicy confidentiality",
  "function getServiceRequestResourceRequirements(",
  "function approveService(Types.ApprovalParams calldata params)",
  "function expireServiceRequest(uint64 requestId)",
  "function getTeeCommitmentRoot(uint64 serviceId, address operator)",
  "function teeNonceFor(uint64 requestId)",
  "function terminateServiceForNonPayment(",
  "event ServiceTerminatedForNonPayment(",
];

for (const snippet of requiredSourceSnippets) {
  assertIncludes(source, snippet, "ITangleServices.sol");
}

const docs = docsPaths.map((targetPath) => ({
  path: targetPath,
  content: readFile(targetPath),
}));

if (docs[0].content !== docs[1].content) {
  throw new Error(
    "ITangleServices reference pages diverged: keep generated/ and non-generated copies identical.",
  );
}

const requiredDocsSnippets = [
  "function requestService(uint64 blueprintId, address[] operators, bytes config, address[] permittedCallers, uint64 ttl, address paymentToken, uint256 paymentAmount, enum Types.ConfidentialityPolicy confidentiality) external payable returns (uint64 requestId)",
  "function requestServiceWithExposure(uint64 blueprintId, address[] operators, uint16[] exposureBps, bytes config, address[] permittedCallers, uint64 ttl, address paymentToken, uint256 paymentAmount, enum Types.ConfidentialityPolicy confidentiality) external payable returns (uint64 requestId)",
  "function requestServiceWithSecurity(uint64 blueprintId, address[] operators, struct Types.AssetSecurityRequirement[] securityRequirements, bytes config, address[] permittedCallers, uint64 ttl, address paymentToken, uint256 paymentAmount, enum Types.ConfidentialityPolicy confidentiality) external payable returns (uint64 requestId)",
  "function getServiceRequestResourceRequirements(uint64 requestId) external view returns (struct Types.ResourceCommitment[])",
  "function approveService(struct Types.ApprovalParams params) external",
  "function expireServiceRequest(uint64 requestId) external",
  "function getTeeCommitmentRoot(uint64 serviceId, address operator) external view returns (bytes32)",
  "function teeNonceFor(uint64 requestId) external view returns (bytes32)",
  "function terminateServiceForNonPayment(uint64 serviceId) external",
  "event ServiceRequested(uint64 requestId, uint64 blueprintId, address requester, enum Types.ConfidentialityPolicy confidentiality)",
  "event ServiceRequestedWithSecurity(uint64 requestId, uint64 blueprintId, address requester, enum Types.ConfidentialityPolicy confidentiality)",
  "event ServiceActivated(uint64 serviceId, uint64 requestId, uint64 blueprintId, enum Types.ConfidentialityPolicy confidentiality)",
  "event ServiceTerminatedForNonPayment(uint64 serviceId, address triggeredBy, uint64 dueAt, uint64 graceEndsAt, uint256 requiredAmount, uint256 escrowBalance)",
];

for (const { path: targetPath, content } of docs) {
  for (const snippet of requiredDocsSnippets) {
    assertIncludes(content, snippet, targetPath);
  }
}

console.log("tnt-core sync checks passed");
