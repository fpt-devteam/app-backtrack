export type TimeSincePastOptions = {
  /** "just now" if within this many seconds */
  justNowSeconds?: number;
};

const DEFAULTS: Required<TimeSincePastOptions> = {
  justNowSeconds: 10,
};

export function toDate(input: Date | string | number): Date | null {
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function timeSincePast(
  input: Date | string | number,
  opts?: TimeSincePastOptions
): string {
  const o = { ...DEFAULTS, ...(opts ?? {}) };
  const d = toDate(input);
  if (!d) return "Unknown date";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  const seconds = Math.floor(diffMs / 1000);
  if (seconds <= o.justNowSeconds) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(months / 12);
  return `${years}y`;
}

export const formatDateTime = (input: Date | string) => {
  const d = toDate(input);
  if (!d) return "Invalid date";

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const yyyy = d.getFullYear();
  const hh = pad2(d.getHours());
  const min = pad2(d.getMinutes());
  return `${mm}/${dd}/${yyyy}, ${hh}:${min}`;
};

export function formatTime<T extends Intl.DateTimeFormatOptions>(
  input: Date | string,
  options: T
): string {
  const d = toDate(input);
  if (!d) return "Invalid time";
  return d.toLocaleTimeString([], options);
}


/**
 * Format ISO date string (e.g. 2026-01-01T13:31:50.117+00:00) into custom pattern.
 * Supported tokens: yyyy, MM, dd, HH, mm, ss
 *
 * Example:
 * formatIsoDate("2026-01-01T13:31:50.117+00:00", "HH:mm dd/MM/yyyy") -> " 20:31 01/01/2026"
 */
export function formatIsoDate(
  input: Date,
  pattern = "HH:mm dd/MM/yyyy",
) {
  const locale = "vi-VN";
  const timeZone = "Asia/Ho_Chi_Minh";
  const d = input instanceof Date ? input : new Date(String(input).trim());

  if (Number.isNaN(d.getTime())) {
    console.warn("formatIsoDate: Invalid date input =", input);
    return "";
  }

  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  const tokens: Record<string, string> = {
    HH: map.hour ?? "",
    mm: map.minute ?? "",
    dd: map.day ?? "",
    MM: map.month ?? "",
    yyyy: map.year ?? "",
  };

  return pattern.replace(/HH|mm|dd|MM|yyyy/g, (t) => tokens[t] ?? t);
}


const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(input: string): string {
  const d = toDate(input);
  if (!d) return "Unknown";
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}