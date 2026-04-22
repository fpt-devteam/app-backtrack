export type TimeSincePastOptions = {
  /** "just now" if within this many seconds */
  justNowSeconds?: number;
};

const DEFAULTS: Required<TimeSincePastOptions> = {
  justNowSeconds: 10,
};

export function toDate(input: Date | string | number): Date | null {
  if (input instanceof Date)
    return Number.isNaN(input.getTime()) ? null : input;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function timeSincePast(
  input: Date | string | number,
  opts?: TimeSincePastOptions,
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
  options: T,
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
export function formatIsoDate(input: Date, pattern = "HH:mm dd/MM/yyyy") {
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

/**
 * Format a date/string to a compact event-time label suited for cards and list items.
 * Shows month + day + 24h time, omitting the year to save space.
 *
 * Usage:
 *   import { formatShortEventTime } from "@/src/shared/utils/datetime.utils";
 *   formatShortEventTime("2026-01-15T14:30:00Z") // → "Jan 15 · 14:30"
 *   formatShortEventTime(new Date())              // → "Apr  1 · 09:05"
 */
export function formatShortEventTime(input: Date | string): string {
  console.log(input);
  const d = toDate(typeof input === "string" ? input : input.toISOString());
  if (!d) return "Unknown";
  const month = MONTH_NAMES[d.getMonth()];
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${month} ${day} · ${hh}:${mm}`;
}

export function formatMessageTimestamp(input: string): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return "Unknown";

  const now = new Date();

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Calculate time difference between two dates
 * @param date1 First date (Date object or ISO string)
 * @param date2 Second date (Date object or ISO string)
 * @returns Time difference in milliseconds
 */
export const calculateTimeDifference = (
  date1: Date | string,
  date2: Date | string,
): number => {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;
  return Math.abs(d1.getTime() - d2.getTime());
};

/**
 * Format time difference for display
 * @param diffInMs Time difference in milliseconds
 * @returns Formatted string (e.g., "2 hrs apart", "30 mins apart")
 */
export const formatTimeDifference = (diffInMs: number): string => {
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }
  return "Same time";
};
/**
 * Get time match status based on time difference
 * @param diffInMs Time difference in milliseconds
 * @returns Match status
 */
export const getTimeMatchStatus = (
  diffInMs: number,
): "high" | "medium" | "low" => {
  const hours = diffInMs / (1000 * 60 * 60);

  if (hours <= 3) return "high";
  if (hours <= 24) return "medium";
  return "low";
};

/**
 * Check whether two dates fall on the same calendar day.
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Human-friendly date label for chat date separators.
 *
 * - Today        → "Today"
 * - Yesterday    → "Yesterday"
 * - Same year    → "Monday, Mar 15"
 * - Other year   → "Monday, Mar 15, 2026"
 */
export function getDateLabel(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const now = new Date();
  if (isSameDay(d, now)) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(d, yesterday)) return "Yesterday";

  const weekday = WEEKDAY_NAMES[d.getDay()];
  const formatted = formatDate(d.toISOString()); // "Mar 15, 2026"

  if (d.getFullYear() === now.getFullYear()) {
    return `${weekday}, ${formatted.replace(`, ${now.getFullYear()}`, "")}`;
  }
  return `${weekday}, ${formatted}`;
}



import { format } from 'date-fns';

type DateFormatPattern = "yyyy-MM-dd" | "MM/dd/yyyy" | "dd/MM/yyyy" | "yyyy/MM/dd";

export const formatDateByPattern = (input: Date | string | number, pattern: DateFormatPattern) => {
  const result = format(input, pattern);
  return result;
}

import { parseISO } from 'date-fns';

export const parseStringToDate = (dateString?: string | null) => {
  if (!dateString) return null;
  return parseISO(dateString);
};