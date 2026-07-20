import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple Tailwind CSS class strings and conditionally merges conflicting classes.
 * @param inputs List of class names or conditional class values.
 * @returns Merged className string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
