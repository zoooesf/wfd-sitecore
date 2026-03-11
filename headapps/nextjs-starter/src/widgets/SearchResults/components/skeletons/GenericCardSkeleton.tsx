import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { cn } from 'lib/helpers/classname';
import type { TailwindBreakpoint } from 'lib/types';
import { breakpointOrder } from 'lib/helpers/card-helpers';
import { SKELETON_BORDER_RADIUS } from 'lib/const';

type GenericCardSkeletonProps = {
  horizontalBreakpoint?: TailwindBreakpoint;
  showImage?: boolean;
};

// Width classes for each breakpoint when card is horizontal
const WIDTH_CLASSES: Record<TailwindBreakpoint, string> = {
  xs: 'xs:w-60',
  sm: 'sm:w-60',
  md: 'md:w-65',
  lg: 'lg:w-65',
  xl: 'xl:w-60',
  '2xl': '2xl:w-60',
};

/**
 * Generates dynamic width classes based on horizontal breakpoint.
 * If card is vertical at a breakpoint, width classes for that breakpoint and smaller are removed.
 * @param horizontalBreakpoint - The breakpoint at which card becomes horizontal
 * @returns String of width classes
 */
const getImageWidthClasses = (horizontalBreakpoint?: TailwindBreakpoint): string => {
  // Base class for mobile (always vertical, always full width)
  const baseClass = 'w-full';

  // If no horizontal breakpoint, card is vertical at all sizes
  if (!horizontalBreakpoint) {
    return baseClass;
  }

  // Find index of horizontal breakpoint
  const breakpointIndex = breakpointOrder.indexOf(horizontalBreakpoint);

  // If breakpoint not found, return base only
  if (breakpointIndex === -1) {
    return baseClass;
  }

  // Include width classes for horizontal breakpoint and above
  const responsiveClasses = breakpointOrder
    .slice(breakpointIndex) // Get breakpoints from horizontal breakpoint onwards
    .map((bp) => WIDTH_CLASSES[bp])
    .filter(Boolean) // Remove undefined values
    .join(' ');

  return `${baseClass} ${responsiveClasses}`.trim();
};

export const GenericCardSkeleton: React.FC<GenericCardSkeletonProps> = ({
  horizontalBreakpoint,
  showImage = true,
}) => {
  const isHorizontal = !!horizontalBreakpoint;

  // Flex direction classes
  const flexDirectionClass = isHorizontal
    ? `flex-col ${horizontalBreakpoint}:flex-row`
    : 'flex-col';

  // Content padding classes with responsive left padding
  // Safelist: sm:pl-8 md:pl-8 lg:pl-8 xl:pl-8 2xl:pl-8
  const contentPaddingClass = isHorizontal ? `py-4 pr-4 ${horizontalBreakpoint}:pl-8 pl-4` : 'p-4';

  // Dynamic image width classes based on layout
  // Safelist: w-full xs:w-60 sm:w-60 md:w-65 lg:w-65 xl:w-60 2xl:w-60
  const imageWidthClass = getImageWidthClasses(horizontalBreakpoint);
  const imageClass = `flex h-full aspect-square ${imageWidthClass}`;

  return (
    <div
      className={cn('flex h-full border border-content/20', flexDirectionClass)}
      data-testid="generic-card-skeleton"
    >
      {/* Image Skeleton */}
      {showImage && <Skeleton containerClassName={imageClass} />}

      {/* Content Skeleton */}
      <div className={cn('flex flex-1 flex-col gap-3', contentPaddingClass)}>
        {/* Type/Category */}
        <div className="w-1/3">
          <Skeleton height={12} />
        </div>

        {/* Title */}
        <div className="w-5/6">
          <Skeleton height={24} />
        </div>

        {/* Description lines */}
        <div className="flex flex-col gap-1">
          <div className="w-full">
            <Skeleton height={14} />
          </div>
          <div className="w-11/12">
            <Skeleton height={14} />
          </div>
          <div className="w-4/5">
            <Skeleton height={14} />
          </div>
        </div>

        {/* Metadata items (icons + text) - using grid like ArticleItemCard */}
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
          <div className="flex gap-2">
            <div className="w-4">
              <Skeleton height={16} borderRadius={SKELETON_BORDER_RADIUS.SQUARE} />
            </div>
            <div className="flex-1">
              <Skeleton height={12} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-4">
              <Skeleton height={16} borderRadius={SKELETON_BORDER_RADIUS.SQUARE} />
            </div>
            <div className="flex-1">
              <Skeleton height={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
