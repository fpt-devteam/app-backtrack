export type TimeSincePastOptions = {
  /** "just now" if within this many seconds */
  justNowSeconds?: number; // default 10
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

  const formatString = (str: string, value: number) => {
    const c = value === 1 ? '' : 's';
    return `${value} ${str}${c} ago`;
  }

  const seconds = Math.floor(diffMs / 1000);
  if (seconds <= o.justNowSeconds) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return formatString("minute", minutes);

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return formatString("hour", hours);

  const days = Math.floor(hours / 24);
  if (days < 30) return formatString("day", days);

  const months = Math.floor(days / 30);
  if (months < 12) return formatString("month", months);

  const years = Math.floor(months / 12);
  return formatString("year", years);
}

export const formatDateTime = (d: Date) => {
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const yyyy = d.getFullYear();
  const hh = pad2(d.getHours());
  const min = pad2(d.getMinutes());
  return `${mm}/${dd}/${yyyy}, ${hh}:${min}`;
};
