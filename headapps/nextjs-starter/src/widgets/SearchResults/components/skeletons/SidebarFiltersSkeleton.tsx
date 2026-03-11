import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { SKELETON_BORDER_RADIUS, SIDEBAR_FILTERS_CONFIG } from 'lib/const';

export const SidebarFiltersSkeleton: React.FC = () => {
  const facetGroups = Array.from({ length: SIDEBAR_FILTERS_CONFIG.FACET_GROUP_COUNT }, (_, i) => i);
  const checkboxItems = Array.from({ length: SIDEBAR_FILTERS_CONFIG.ITEMS_PER_GROUP }, (_, i) => i);

  return (
    <div className="flex flex-col" data-testid="sidebar-filters-skeleton">
      {/* Filters header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="w-20">
          <Skeleton height={24} />
        </div>
      </div>

      {/* Facet groups */}
      {facetGroups.map((groupIndex) => (
        <div key={groupIndex} className="border-b border-content py-4">
          {/* Facet title bar with chevron */}
          <div className="mb-3 flex items-center justify-between">
            <div className="w-3/5">
              <Skeleton height={20} />
            </div>
            <div className="w-4">
              <Skeleton height={16} />
            </div>
          </div>

          {/* Checkbox items */}
          <div className="flex flex-col gap-2">
            {checkboxItems.map((itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-2">
                <div className="w-4">
                  <Skeleton height={16} borderRadius={SKELETON_BORDER_RADIUS.SQUARE} />
                </div>
                <div className="flex-1">
                  <Skeleton height={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
