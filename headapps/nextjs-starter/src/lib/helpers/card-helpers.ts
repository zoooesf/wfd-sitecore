import { cn } from './classname';
import type { TailwindBreakpoint } from 'lib/types';

// Breakpoint hierarchy for Tailwind responsive classes
export const breakpointOrder: TailwindBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * Generates dynamic image wrapper classes for card components based on horizontal breakpoint.
 * This ensures image width constraints only apply at or after the breakpoint where the layout becomes horizontal.
 *
 * @param horizontalBreakpoint - The breakpoint at which the card switches to horizontal layout
 * @returns Computed className string for the image wrapper
 *
 * @example
 * // For horizontalBreakpoint="sm": returns "w-full sm:w-60 lg:w-65 xl:w-60"
 * const classes = getCardImageWrapperClasses("sm");
 *
 * @example
 * // For horizontalBreakpoint="lg": returns "w-full lg:w-65 xl:w-60" (sm classes filtered out)
 * const classes = getCardImageWrapperClasses("lg");
 */
export function getCardImageWrapperClasses(horizontalBreakpoint?: TailwindBreakpoint): string {
  if (!horizontalBreakpoint) {
    return '';
  }

  // Width classes at each breakpoint for horizontal layout (from cards.scss)
  const widthClasses: Record<string, string> = {
    xs: 'xs:w-full',
    sm: 'sm:w-60',
    md: 'md:w-65',
    lg: 'lg:w-65',
    xl: 'xl:w-60',
  };

  // Dynamically build image wrapper classes based on breakpoint
  // Only include width constraints that activate at or after the horizontalBreakpoint
  return cn([
    'w-full', // Base full width
    // Filter out width classes that activate before horizontalBreakpoint
    ...Object.entries(widthClasses)
      .filter(([bp]) => {
        const bpIndex = breakpointOrder.indexOf(bp as TailwindBreakpoint);
        const horizontalBpIndex = breakpointOrder.indexOf(horizontalBreakpoint);
        return bpIndex >= horizontalBpIndex; // Keep classes at or after the horizontal breakpoint
      })
      .map(([, className]) => className),
  ]);
}
