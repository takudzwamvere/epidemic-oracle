import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple Tailwind CSS class strings and conditionally merges conflicting classes
 * using clsx for conditional class handling and tailwind-merge to deduplicate conflicting utility classes.
 *
 * @example
 * ```ts
 * cn("px-2 py-1", isPrimary && "bg-blue-600", "px-4") // results in "py-1 bg-blue-600 px-4"
 * ```
 *
 * @param inputs List of class names, expressions, or conditional class values.
 * @returns Clean, deduplicated className string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
