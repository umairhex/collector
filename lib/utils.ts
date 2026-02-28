import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared date formatter (DRY-002)
 */
export function formatDate(isoString: string | undefined) {
  if (!isoString) return "Today";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "Today";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(d);
}

/**
 * Shared category configuration (DRY-005)
 */
export const DEFAULT_CATEGORIES = ["Ideas", "Work", "General"] as const;
