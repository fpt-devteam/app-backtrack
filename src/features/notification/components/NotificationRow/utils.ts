export const ICON_SIZE = 40;

export const formatTime = (date: Date | string): string => {
  const now = new Date();
  const notifDate = new Date(date);
  const diffMs = now.getTime() - notifDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${Math.max(diffMins, 1)}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  const day = notifDate.getDate().toString().padStart(2, "0");
  const month = (notifDate.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}`;
};
