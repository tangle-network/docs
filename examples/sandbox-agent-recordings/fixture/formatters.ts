export function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  const digits = size >= 10 || index === 0 ? 0 : 1;
  return `${size.toFixed(digits)} ${units[index]}`;
}

export function formatDate(value: string | number | Date) {
  return new Date(value).toLocaleDateString();
}

export function formatDateTime(value: string | number | Date) {
  return new Date(value).toLocaleString();
}

export function formatUptime(valueMs: number) {
  const totalSeconds = Math.max(0, Math.floor(valueMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/**
 * Compact past-relative time ("just now", "5m ago", "2h ago", "3d ago"). Used
 * for last-activity stamps on stopped/recovering sandboxes where a coarse
 * "how long ago" reads better than an absolute timestamp. Returns null for a
 * missing or unparseable value so callers can choose their own fallback.
 */
export function formatRelativeTime(
  value: string | number | Date | undefined | null,
): string | null {
  if (value == null) return null;
  const then = new Date(value).getTime();
  if (!Number.isFinite(then)) return null;
  const diffMs = Math.max(0, Date.now() - then);
  // Sub-10s reads as "just now" and 10-59s reports the seconds, matching the
  // workflow list's formatter in this app and the platform one it mirrors.
  // Reporting "just now" for a whole minute made the same age read two ways on
  // two screens.
  if (diffMs < 10_000) return "just now";
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
