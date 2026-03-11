import React from 'react';
import { GenericCardSkeleton } from './GenericCardSkeleton';
import { SearchInputSkeleton } from './SearchInputSkeleton';
import { SearchToolbarSkeleton } from './SearchToolbarSkeleton';
import { SidebarFiltersSkeleton } from './SidebarFiltersSkeleton';
import { PaginationSkeleton } from './PaginationSkeleton';
import {
  MainLayoutContainer,
  SidebarContainer,
  MainContentContainer,
  ResultListContainer,
  ListLayoutContainer,
} from '../../GlobalSearch/styled';
import { cn } from 'lib/helpers/classname';
import type { TailwindBreakpoint } from 'lib/types';
import { SKELETON_ITEMS_CONFIG } from 'lib/const';

type SearchResultsSkeletonLayoutProps = {
  itemsPerPage?: number;
  showSidebar?: boolean;
  gridCols?: string;
  horizontalBreakpoint?: TailwindBreakpoint;
  showImage?: boolean;
};

/**
 * Main orchestrator component that combines all skeleton components into a full search results layout.
 * Mirrors the actual search results structure to prevent layout shift when content loads.
 *
 * @param itemsPerPage - Number of skeleton cards to display (defaults to SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE)
 * @param showSidebar - Whether to show the sidebar with filters (defaults to true)
 * @param gridCols - Tailwind grid column classes for responsive layout (defaults to single column)
 * @param horizontalBreakpoint - Breakpoint for horizontal card layout (e.g., 'sm', 'md'); if not provided, cards are vertical
 * @param showImage - Whether to show image skeleton in cards (defaults to true)
 */
export const SearchResultsSkeletonLayout: React.FC<SearchResultsSkeletonLayoutProps> = ({
  itemsPerPage = SKELETON_ITEMS_CONFIG.ITEMS_PER_PAGE,
  showSidebar = true,
  gridCols = 'grid-cols-1',
  horizontalBreakpoint,
  showImage = true,
}) => {
  // Generate array of skeleton cards based on itemsPerPage
  const skeletonCards = Array.from({ length: itemsPerPage }, (_, index) => index);

  return (
    <MainLayoutContainer>
      {/* Left Sidebar - Filters */}
      {showSidebar && (
        <SidebarContainer>
          <SidebarFiltersSkeleton />
        </SidebarContainer>
      )}

      {/* Right Content Area */}
      <MainContentContainer>
        {/* Search Input */}
        <SearchInputSkeleton />

        {/* Toolbar (sort, filter summary) */}
        <SearchToolbarSkeleton />

        {/* Results List */}
        <ResultListContainer data-component="SearchResultsList">
          <ListLayoutContainer>
            <div className={cn('grid w-full gap-4', gridCols)}>
              {skeletonCards.map((index) => (
                <div key={index} className="h-full">
                  <GenericCardSkeleton
                    horizontalBreakpoint={horizontalBreakpoint}
                    showImage={showImage}
                  />
                </div>
              ))}
            </div>
          </ListLayoutContainer>
        </ResultListContainer>

        {/* Pagination Controls */}
        <PaginationSkeleton />
      </MainContentContainer>
    </MainLayoutContainer>
  );
};
