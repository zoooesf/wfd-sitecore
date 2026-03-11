import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SKELETON_BORDER_RADIUS, SKELETON_DIMENSIONS } from 'lib/const';

export const SearchToolbarSkeleton: React.FC = () => {
  return (
    <div data-testid="search-toolbar-skeleton">
      <div className="flex flex-col gap-6 xs:flex-row xs:items-center xs:justify-between">
        {/* Mobile facets button - show on mobile/tablet, hide on desktop */}
        <div className="block md:hidden">
          <Skeleton
            width={SKELETON_DIMENSIONS.TOOLBAR_BUTTON_WIDTH}
            height={SKELETON_DIMENSIONS.TOOLBAR_BUTTON_HEIGHT}
          />
        </div>

        {/* Results Summary - hidden on mobile/tablet, show on desktop */}
        <div className="hidden md:block">
          <Skeleton
            width={SKELETON_DIMENSIONS.RESULTS_SUMMARY_WIDTH}
            height={SKELETON_DIMENSIONS.RESULTS_SUMMARY_HEIGHT}
          />
        </div>

        {/* Sort dropdown */}
        <div className="w-full xs:w-auto">
          <Skeleton
            width={SKELETON_DIMENSIONS.SORT_DROPDOWN_WIDTH}
            height={SKELETON_DIMENSIONS.TOOLBAR_BUTTON_HEIGHT}
            borderRadius={SKELETON_BORDER_RADIUS.SQUARE}
          />
        </div>
      </div>

      {/* Results Summary on mobile - show below sort on mobile/tablet */}
      <div className="mt-4 flex md:hidden">
        <Skeleton
          width={SKELETON_DIMENSIONS.RESULTS_SUMMARY_WIDTH}
          height={SKELETON_DIMENSIONS.RESULTS_SUMMARY_HEIGHT}
        />
      </div>
    </div>
  );
};
