import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SKELETON_BORDER_RADIUS, SKELETON_DIMENSIONS } from 'lib/const';

export const SearchInputSkeleton: React.FC = () => {
  return (
    <div className="flex w-full items-center" data-testid="search-input-skeleton">
      {/* Input field */}
      <div className="flex-1">
        <Skeleton
          height={SKELETON_DIMENSIONS.SEARCH_INPUT_HEIGHT}
          borderRadius={SKELETON_BORDER_RADIUS.SQUARE}
        />
      </div>
      {/* Search button */}
      <Skeleton
        width={SKELETON_DIMENSIONS.SEARCH_BUTTON_WIDTH}
        height={SKELETON_DIMENSIONS.SEARCH_INPUT_HEIGHT}
        borderRadius={SKELETON_BORDER_RADIUS.SQUARE}
      />
    </div>
  );
};
