import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SKELETON_DIMENSIONS } from 'lib/const';

export const PaginationSkeleton: React.FC = () => {
  return (
    <div
      className="flex w-full flex-col items-center justify-between md:flex-row"
      data-testid="pagination-skeleton"
    >
      {/* Page navigation buttons - order-2 on mobile, order-1 on desktop */}
      <div className="order-2 flex items-center gap-2 md:order-1">
        <Skeleton
          width={SKELETON_DIMENSIONS.PAGINATION_PREV_NEXT_WIDTH}
          height={SKELETON_DIMENSIONS.PAGINATION_BUTTON_HEIGHT}
        />
        <Skeleton
          width={SKELETON_DIMENSIONS.PAGINATION_NUMBER_WIDTH}
          height={SKELETON_DIMENSIONS.PAGINATION_BUTTON_HEIGHT}
        />
        <Skeleton
          width={SKELETON_DIMENSIONS.PAGINATION_NUMBER_WIDTH}
          height={SKELETON_DIMENSIONS.PAGINATION_BUTTON_HEIGHT}
        />
        <Skeleton
          width={SKELETON_DIMENSIONS.PAGINATION_NUMBER_WIDTH}
          height={SKELETON_DIMENSIONS.PAGINATION_BUTTON_HEIGHT}
        />
        <Skeleton
          width={SKELETON_DIMENSIONS.PAGINATION_PREV_NEXT_WIDTH}
          height={SKELETON_DIMENSIONS.PAGINATION_BUTTON_HEIGHT}
        />
      </div>

      {/* Page size selector - order-1 on mobile (full width), order-2 on desktop */}
      <div className="order-1 flex w-full items-center justify-between gap-1 md:order-2 md:w-auto">
        <Skeleton
          width={SKELETON_DIMENSIONS.PAGINATION_SELECTOR_TEXT_WIDTH}
          height={SKELETON_DIMENSIONS.RESULTS_SUMMARY_HEIGHT}
        />
        <Skeleton
          width={SKELETON_DIMENSIONS.PAGINATION_SELECTOR_DROPDOWN_WIDTH}
          height={SKELETON_DIMENSIONS.PAGINATION_BUTTON_HEIGHT}
        />
      </div>
    </div>
  );
};
