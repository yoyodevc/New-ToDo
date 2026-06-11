import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isOverdue(dueDateStr: string): boolean {
  const due = new Date(dueDateStr);
  const now = new Date();
  const hasTime = due.getHours() !== 0 || due.getMinutes() !== 0;
  if (hasTime) {
    return due < now;
  }
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  return due < todayStart;
}
