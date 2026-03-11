import clsx, { ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Custom tailwind-merge configuration that recognizes our custom typography classes
 * from layer-components.scss (heading-*, copy-*, eyebrow)
 *
 * Each custom class family has its own conflict group, so:
 * - copy-* classes only conflict with other copy-* classes
 * - heading-* classes only conflict with other heading-* classes
 * - They remain independent from Tailwind's built-in text-* utilities
 */
const customTwMerge = extendTailwindMerge({
  override: {
    classGroups: {
      // Create separate conflict group for copy-* classes
      'copy-size': [
        'copy-xs',
        'copy-sm',
        'copy-base',
        'copy-lg',
        'copy-xl',
        'copy-2xl',
        'copy-3xl',
        'copy-4xl',
        'copy-5xl',
        'copy-6xl',
        'copy-7xl',
        'copy-8xl',
      ],
      // Create separate conflict group for heading-* classes
      'heading-size': [
        'heading-xs',
        'heading-sm',
        'heading-base',
        'heading-lg',
        'heading-xl',
        'heading-2xl',
        'heading-3xl',
        'heading-4xl',
        'heading-5xl',
        'heading-6xl',
        'heading-7xl',
        'heading-8xl',
        'heading-9xl',
      ],
    } as Record<string, string[]>,
  },
});

/**
 * Combines multiple class names and merges Tailwind CSS classes intelligently.
 * Now with support for custom typography classes from layer-components.scss
 * @param inputs - Array of class values to be merged
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
